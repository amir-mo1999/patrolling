from flask import Flask
from flask_cors import CORS


def init_app():
    app = Flask(__name__, instance_relative_config=False)
    with app.app_context():
        from . import routes

    CORS(app)
    return app
