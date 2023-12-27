"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils";
import { scenario } from "@/utils";
import moment from "moment";

interface ScenarioListProps {
  activeScenario: scenario | undefined;
  setActiveScenario: React.Dispatch<React.SetStateAction<scenario | undefined>>;
  className?: string;
}

const ScenarioList: React.FC<ScenarioListProps> = ({
  activeScenario,
  setActiveScenario,
  className,
}) => {
  // set all scenarios
  const [scenarios, setScenarios] = useState<scenario[]>([]);
  useEffect(() => {
    api.getAllScenarios().then((scenarios) => {
      let scenariosList: Array<scenario> = [];
      scenarios["scenarios"].forEach((item: any) => {
        scenariosList.push({
          scenarioTitle: item["scenario_title"],
          mapName: item["map_name"],
          createdAt: item["created_at"],
        });
      });
      setScenarios(scenariosList);
    });
  }, []);

  const handleItemClick = (clickedScenario: scenario) => {
    // Placeholder click method
    console.log("Clicked Scenario:", clickedScenario);
    setActiveScenario(clickedScenario);
  };

  return (
    <div
      className={
        activeScenario !== undefined
          ? "hidden"
          : " overflow-auto overflow-x-hidden " + className
      }
    >
      {scenarios.map((scenario) => (
        <div
          key={scenario.scenarioTitle}
          className="flex items-center p-2 mb-2 transition duration-300 ease-in-out cursor-pointer 
          bg-primary_color dark:bg-dark_primary_color hover:bg-secondary_color hover:dark:bg-dark_secondary_color
          rounded-lg"
          onClick={() => handleItemClick(scenario)}
        >
          <div>
            <div className="font-semibold break-words text-primary_text dark:text-dark_primary_text mb-2">
              {scenario.scenarioTitle}
            </div>
            <div className="text-sm text-primary_text dark:text-dark_primary_text">
              {moment
                .tz(scenario.createdAt, "Europe/Berlin")
                .format("MM/DD/YYYY h:mm A")}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScenarioList;
