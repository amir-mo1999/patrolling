"use client";

import { useState, useEffect } from "react";
import ROSLIB from "roslib";
import {
  RosConnector,
  Ros2DMap,
  CreateScenarioBtn,
  DarkModeSwitch,
  CreateScenarioPopup,
  ScenarioList,
  CloseBtn,
} from "@/components";
import { lightTheme, darkTheme, scenario } from "@/utils";
import moment from "moment";
import "moment-timezone";

function prefersDarkMode() {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  // Fallback for browsers that do not support matchMedia
  return false;
}

export default function Home() {
  // set dark mode setting from users system settings
  const [isDarkMode, setIsDarkMode] = useState<boolean | undefined>(undefined);

  // the scenario that is currently active; undefined means no scenario is active
  const [activeScenario, setActiveScenario] = useState<scenario | undefined>(
    undefined
  );

  // set ros instance and connection status
  const [ros, setRos] = useState<ROSLIB.Ros | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // if we are in create scenario mode
  const [inCreateScenarioMode, setInCreateScenarioMode] =
    useState<boolean>(false);

  useEffect(() => {
    setIsDarkMode(prefersDarkMode());
  }, []);

  return (
    <main className={" h-full relative " + (isDarkMode ? "dark" : "")}>
      <CreateScenarioPopup
        inCreateScenarioMode={inCreateScenarioMode}
      ></CreateScenarioPopup>
      {/* Main wrapper */}
      <div className="h-full w-full absolute top-0 left-0 bg-primary_color dark:bg-dark_primary_color">
        {/* Bar on the top */}
        <div className="flex justify-between border-b border-primary_text dark:border-black pb-2 pt-2">
          <DarkModeSwitch
            className=" ml-auto"
            checked={isDarkMode ? true : false}
            onChange={() => {
              setIsDarkMode(!isDarkMode);
            }}
            theme={isDarkMode ? darkTheme : lightTheme}
          />
        </div>
        {/* Connect to ROS */}
        <RosConnector
          isConnected={isConnected}
          setIsConnected={setIsConnected}
          setRos={setRos}
        ></RosConnector>
        {/* Main Content*/}
        <div className="h-full flex-col">
          <div className="h-[70%] flex justify-start gap-0">
            {/* Left bar */}
            <div className=" w-1/6 h-full flex flex-col py-3 px-2">
              <div className="flex-none text-primary_text dark:text-dark_primary_text w-full pb-3">
                Patrolling Scenarios
              </div>
              <ScenarioList
                activeScenario={activeScenario}
                setActiveScenario={setActiveScenario}
                className="flex-grow pr-4"
              ></ScenarioList>
              <CreateScenarioBtn
                className={
                  activeScenario === undefined
                    ? "w-full mt-4 flex-none"
                    : "hidden"
                }
              ></CreateScenarioBtn>
              {/* Interface for the active scenario */}
              <div
                className={
                  activeScenario !== undefined
                    ? "flex-grow flex flex-col pl-2"
                    : "hidden"
                }
              >
                <CloseBtn
                  className="text-right"
                  onClick={() => {
                    setActiveScenario(undefined);
                  }}
                ></CloseBtn>
                <div className="text-semibold text-lg text-primary_text dark:text-dark_primary_text">
                  {activeScenario?.scenarioTitle}
                </div>
                <div className="text-sm text-primary_text dark:text-dark_primary_text">
                  {moment
                    .tz(activeScenario?.createdAt, "Europe/Berlin")
                    .format("MM/DD/YYYY h:mm A")}
                </div>
              </div>
            </div>
            {/* Map */}
            <div className=" w-4/6 dark:bg-dark_secondary_color bg-secondary_color">
              {isConnected ? (
                <div>
                  <div className=" w-1/6 text-primary_text dark:text-dark_primary_text">
                    Map
                  </div>
                  {/* this renders the map after it was published*/}
                  <Ros2DMap ros={ros} isDarkMode={isDarkMode}></Ros2DMap>
                </div>
              ) : (
                <p className=" text-primary_text dark:text-dark_primary_text ">
                  Connecting to ROS...
                </p>
              )}
            </div>
            {/* Right bar */}
            <div className="text-primary_text dark:text-dark_primary_text">
              Right Bar
            </div>
          </div>
          {/* Bottom Bar*/}
          <div className=" h-[30%] text-primary_text dark:text-dark_primary_text border-t border-primary_text dark:border-black">
            Bottom Bar
          </div>
        </div>
      </div>
    </main>
  );
}
