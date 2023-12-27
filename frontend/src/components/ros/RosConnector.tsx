"use client";

import React, { useEffect } from "react";
import ROSLIB from "roslib";

// interface for roslib error
interface RoslibError extends Error {
  status?: string;
  roslibMessage?: string;
}

//props
interface RosConnectorProps {
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setRos: React.Dispatch<React.SetStateAction<ROSLIB.Ros | null>>;
}

//component
const RosConnector: React.FC<RosConnectorProps> = ({
  isConnected,
  setIsConnected,
  setRos,
}) => {
  useEffect(() => {
    // Create a ROS connection when the component mounts
    const rosInstance = new ROSLIB.Ros({
      url: process.env.NEXT_PUBLIC_ROS_URL as string, // Adjust the URL based on your ROS Bridge Server configuration
    });

    // Handle connection event
    rosInstance.on("connection", () => {
      setIsConnected(true);
    });

    // Handle error event
    rosInstance.on("error", (err?: RoslibError) => {
      console.error("Error connecting to ROS:", err);
    });

    // Handle close event
    rosInstance.on("close", () => {
      console.log("Connection to ROS closed");
      setIsConnected(false);
    });

    // Set the ROS instance in the state
    setRos(rosInstance);

    // clean ros instance when the component unmounts
    return () => {
      if (isConnected) {
        rosInstance.close();
        setRos(null);
        setIsConnected(false);
      }
    };
  }, []);

  return "";
};

export default RosConnector;
