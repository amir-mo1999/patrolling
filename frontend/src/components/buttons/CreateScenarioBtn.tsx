"use client";

import React, { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface CreateScenarioBtnProps {
  className?: string; // Optional className prop
}

const CreateScenarioBtn: FC<CreateScenarioBtnProps> = ({ className }) => {
  return (
    <button
      className={
        " border-2 border-secondary_text dark:border-dark_secondary_text opacity-75 hover:opacity-100 hover:dark_secondary_text font-bold py-2 rounded focus:outline-none focus:shadow-outline " +
        className
      }
      onClick={() => {
        console.log("create scenario clicked");
      }}
    >
      <FontAwesomeIcon
        icon={faPlus}
        className="mr-2 text-secondary_text dark:text-dark_secondary_text"
        style={{ opacity: "inherit" }}
      />
    </button>
  );
};

export default CreateScenarioBtn;
