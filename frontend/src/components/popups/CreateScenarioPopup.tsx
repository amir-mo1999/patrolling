// components/RobotScenarioPopup.tsx

import { useState } from "react";
import { CloseBtn, MapList } from "@/components";

interface CreateScenarioPopupProps {
  inCreateScenarioMode: boolean;
}

const CreateScenarioPopup: React.FC<CreateScenarioPopupProps> = ({
  inCreateScenarioMode,
}) => {
  const items = [
    { id: 1, imageUrl: "https://placekitten.com/50/50", text: "Item 1" },
    { id: 2, imageUrl: "https://placekitten.com/51/51", text: "Item 2" },
    { id: 3, imageUrl: "https://placekitten.com/52/52", text: "Item 3" },
    // Add more items as needed
  ];

  return (
    <div className={inCreateScenarioMode ? "" : "hidden "}>
      {/* Dark Hue over page */}
      <div
        className={
          "h-screen w-screen absolute top-0 left-0 bg-black opacity-70 z-10"
        }
      ></div>
      <div className=" h-screen w-screen absolute top-0 left-0 z-20 flex items-center justify-center">
        {/* Popup content */}
        <div className="h-[80%] w-[80%] bg-primary_color dark:bg-dark_primary_color px-2 py-2">
          {/* First row */}
          <div className="flex">
            {/* Close Button */}
            <CloseBtn
              onClick={() => console.log("clicked close btn")}
              className="ml-auto scale-150"
            ></CloseBtn>
          </div>
          <MapList items={items}></MapList>
        </div>
      </div>
    </div>
  );
};

export default CreateScenarioPopup;
