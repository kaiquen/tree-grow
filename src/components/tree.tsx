"use client";

import React, { useEffect } from "react";
import  {useRive, useStateMachineInput} from "@rive-app/react-canvas";

type TreeProps = {
  initialProgress: number;
  onProgressChange: () => void;
}

export const Tree = ({onProgressChange,  initialProgress}:TreeProps) => {
  const STATE_MACHINE_NAME = "State Machine 1";
  const INPUT_NAME = "input";

  const {RiveComponent, rive} = useRive({
    src:"/animations/pomodoro_tree.riv",
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true, 
  });

  const growthInput = useStateMachineInput(
    rive, 
    STATE_MACHINE_NAME, 
    INPUT_NAME
  );

  useEffect(() => {
    if(growthInput) {
      growthInput.value = initialProgress;
    }
  }, [growthInput, initialProgress]);

  return (
    <RiveComponent
      onClick={onProgressChange}
      style={{
        userSelect: "none",
        width: "100%",
        height: "100%",
        display: "block",
        cursor: "pointer"
      }}
    />
  );
}

