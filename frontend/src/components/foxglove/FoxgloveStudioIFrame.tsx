"use client";
import { useEffect } from "react";
import React, { FC } from "react";

interface FoxGloveStudioIFrameProps {
  className?: string;
}

const FoxGloveStudioIFrame: FC<FoxGloveStudioIFrameProps> = ({ className }) => {
  useEffect(() => {
    const iframe = document.getElementById(
      "foxglove-studio"
    ) as HTMLIFrameElement;
    const ifrDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
    const studioRoot = ifrDoc?.getElementById("studio-root");
    console.log(iframe);
    if (!ifrDoc || studioRoot) {
      return;
    }

    const div = ifrDoc.createElement("div");
    div.id = "studio-root";

    const script = ifrDoc.createElement("script");
    script.src = "/lib/foxglove/main.js";
    script.async = true;
    script.defer = true;

    ifrDoc.body?.appendChild(div);
    ifrDoc.body?.appendChild(script);
  }, []);

  return (
    <div
      className={"w-full h-full grow flex flex-col studio-page " + className}
    >
      <iframe id="foxglove-studio" className="w-full h-full grow flex"></iframe>
    </div>
  );
};

export default FoxGloveStudioIFrame;
