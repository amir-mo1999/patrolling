from flask import current_app as app
from flask import request, jsonify
import roslibpy
import os
from pymongo import MongoClient
import yaml
from bson.binary import Binary
from PIL import Image
import numpy as np
from io import BytesIO
from datetime import datetime
import pytz
import pickle
import open3d as o3d

# setup ros client
ros_client = roslibpy.Ros(
    host=os.environ.get("ROS_HOST"), port=int(os.environ.get("ROS_PORT"))
)
ros_client.run()

# set up mongo client
mongo_client = MongoClient(os.environ.get("MONGO_URL"))
db = mongo_client["patrolling-web"]


def convert_binary_image_to_1D_array(binary_img):
    # Assuming binary_data is the binary image data retrieved from MongoDB

    # Decode binary data into an image using Pillow (PIL)
    image = Image.open(BytesIO(binary_img))

    # Convert the image to a NumPy array
    image_np = np.array(image)

    # Flatten the 2D array to a 1D array
    flattened_image = image_np.flatten()

    return flattened_image.tolist()


@app.route("/", methods=["GET"])
def home():
    return "Patrolling backend is up and running!"


@app.route("/init-2D-maps", methods=["GET"])
def init_2D_maps():
    # define the maps collection
    map_collection = db["maps"]

    #  where we save the documents that we later send to mongo
    map_documents = []
    # path to map folders
    map_dir_path = "App/Data/2D-Maps"
    # loop over map folders
    for map_name in os.listdir(map_dir_path):
        # get all files in map folder
        files = [f for f in os.listdir(os.path.join(map_dir_path, map_name))]

        # if the folder has no yaml its invalid and we skip it
        if "map.yaml" not in files:
            continue

        # load yaml data
        with open(os.path.join(map_dir_path, map_name, "map.yaml"), "r") as f:
            map_yaml = yaml.safe_load(f)

        # get the image file name of the map
        image = map_yaml["image"]

        # the image file name is not in the map folder we skip this folder
        if image not in files:
            continue

        # get the image binary
        with open(os.path.join(map_dir_path, map_name, image), "rb") as f:
            image_binary = Binary(f.read())

        # create the document
        document = {
            "name": map_name,
            "dim": "2D",
            "image_binary": image_binary,
            "metadata": map_yaml,
        }
        map_documents.append(document)

    for map_document in map_documents:
        # if map is not present in the data base insert it; if it is instead update it
        if map_collection.find_one({"name": map_document["name"]}) is None:
            map_collection.insert_one(map_document)
        else:
            map_collection.update_one(
                {"name": map_document["name"]}, {"$set": map_document}, upsert=True
            )

    return f"Maps initialized successfully"


@app.route("/init-3D-maps", methods=["Get"])
def init_3D_maps():
    # define the maps collection
    map_collection = db["maps"]

    #  where we save the documents that we later send to mongo
    map_documents = []

    # path to map folders
    map_dir_path = "App/Data/3D-Maps"

    for f in os.listdir(map_dir_path):
        point_cloud = o3d.io.read_point_cloud(os.path.join(map_dir_path, f))
        document = {
            "name": f.split(".")[0],
            "dim": "3D",
            "point_cloud": pickle.dumps(point_cloud),
        }

    return "Maps initialized successfully"


@app.route("/publish-map", methods=["POST"])
def publish_map():
    # get map name from json body
    map_name = request.json.get("map_name", None)
    # if map name is none return 400
    if not map_name:
        return (
            jsonify(
                {"message": f"The field 'map_name' is not present in the request body."}
            ),
            400,
        )

    # get the map data
    map_data = db["maps"].find_one({"name": map_name})
    # if not found return 400
    if not map_data:
        return (
            jsonify({"message": f"Map not found."}),
            400,
        )

    # Create a ROS publisher
    topic_name = "/selected_map_topic"
    map_publisher = roslibpy.Topic(ros_client, topic_name, "nav_msgs/OccupancyGrid")

    # decode binary image
    image = Image.open(BytesIO(map_data["image_binary"]))
    # grayscale the image
    image = image.convert("L")
    # convert to array
    image = np.array(image)
    # convert to occupancy grid: 0 for empty and 100 for occupied
    image = np.where(image == 0, 100, 0)
    # get width and height
    height = image.shape[0]
    width = image.shape[1]
    # turn img to flattened list
    image = image.flatten().tolist()

    # construct the message
    origin = map_data["metadata"]["origin"]

    map_msg = {
        "data": image,
        "info": {
            "width": width,
            "height": height,
            "resolution": map_data["metadata"]["resolution"],
            "origin": {"position": {"x": origin[0], "y": origin[1], "z": origin[2]}},
        },
    }
    # TODO: verify that there was no error in ros logs
    # publish message
    map_publisher.publish(map_msg)

    return "Map published", 200


@app.route("/publish-roboot", methods=["POST"])
def publish_robot():
    return "this does nothing"


@app.route("/post-scenario", methods=["POST"])
def post_scenario():
    # get request json body
    body = request.json

    # the body must have the following keys and their fields must be strings
    needed_keys = ["scenario_title", "map_name"]

    if not all(key in body for key in needed_keys):
        return (
            f"The request body must contain the following keys: {str(needed_keys)}.",
            400,
        )

    # get the scenario collection
    scenario_collection = db["scenarios"]

    # get the scenario title
    scenario_title = body["scenario_title"]

    # check if scenario exists already
    if scenario_collection.find_one({"scenario_title": scenario_title}):
        return f"Scenario '{scenario_title}' already exists.", 400

    # get map data and check if it exists
    map_collection = db["maps"]
    map_data = map_collection.find_one({"name": body["map_name"]})
    if not map_data:
        return jsonify({"message": f"Map '{body['map_name']}' not found."}), 400

    # create scenario document
    timezone = pytz.timezone("Europe/Berlin")
    scenario_document = {
        "scenario_title": scenario_title,
        "map_id": map_data["_id"],
        "created_at": str(datetime.now(timezone)),
    }
    print(datetime.now(timezone))
    # insert scenario document
    scenario_collection.insert_one(scenario_document)

    print(scenario_collection.find_one({"scenario_title": scenario_title}))

    return "Scenario created successfully", 200


@app.route("/get-all-scenarios", methods=["GET"])
def get_all_scenarios():
    # get collections
    scenario_collection = db["scenarios"]
    map_collection = db["maps"]

    # get all scenarios
    scenarios = []
    for scenario in scenario_collection.find():
        scenarios.append(
            {
                "scenario_title": scenario["scenario_title"],
                "map_name": map_collection.find_one({"_id": scenario["map_id"]})[
                    "name"
                ],
                "created_at": scenario["created_at"],
            }
        )

    # return all scenarios
    return jsonify({"scenarios": scenarios}), 200


@app.route("/get-scenarios", methods=["POST"])
def get_scenarios():
    # get request body
    body = request.json
