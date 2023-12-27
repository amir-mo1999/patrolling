"use client";

import React, { useEffect, useRef } from "react";
import ROSLIB from "roslib";

// component
const Ros2DMap = ({ ros, isDarkMode }) => {
  // canvas reference
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      console.error("Could not get 2D context for canvas");
      return;
    }

    const drawMap = (mapData) => {
      const data = mapData.data;
      const width = mapData.info.width;
      const height = mapData.info.height;

      canvas.width = width;
      canvas.height = height;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = y * width + x;
          const value = data[index];

          // Color the map based on occupancy value
          const color = value === 0 ? "#ffffff" : "#000000";
          context.fillStyle = color;
          context.fillRect(x, y, 1, 1);
        }
      }
    };

    // Subscribe to the map topic
    const mapTopic = new ROSLIB.Topic({
      ros: ros,
      name: "/selected_map_topic", // Replace with your actual ROS topic name
      messageType: "nav_msgs/OccupancyGrid", // Replace with the actual message type
    });

    mapTopic.subscribe((message) => {
      drawMap(message);
    });

    return () => {
      //Unsubscribe when the component is unmounted
      mapTopic.unsubscribe();
    };
  }, []); // Add dependencies if needed

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Ros2DMap;
