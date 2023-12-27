"use client";

import React, { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface CloseBtnProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string; // Optional className prop}
}

const CloseBtn: FC<CloseBtnProps> = ({ onClick, className }) => {
  return (
    <button
      className={
        " opacity-75 hover:opacity-100 hover:dark_secondary_text font-bold rounded focus:outline-none focus:shadow-outline " +
        className
      }
      onClick={onClick}
    >
      <FontAwesomeIcon
        icon={faXmark}
        className=" text-secondary_text dark:text-dark_secondary_text"
        style={{ opacity: "inherit" }}
      />
    </button>
  );
};

export default CloseBtn;
