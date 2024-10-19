"use client";

import React, { useEffect, useRef } from "react";
import  {useRive, useStateMachineInput} from "@rive-app/react-canvas";

type TreeProps = {
  onComplete: () => void;
  resetSignal: boolean;
  onProgressChange: (progress: number) => void;
  initialProgress: number;
}

export const Tree = ({onComplete,onProgressChange,resetSignal, initialProgress}:TreeProps) => {
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

  const onProgressChangeRef = useRef(onProgressChange);
  
  useEffect(() => {
    onProgressChangeRef.current = onProgressChange;
  }, [onProgressChange]);


  useEffect(() => {
    if(growthInput) {
      growthInput.value = initialProgress;
    }
  }, [growthInput, initialProgress]);

  useEffect(() => {
    if(growthInput && resetSignal) {
      growthInput.value = 0;
      onProgressChange(0);
    }
  }, [resetSignal, growthInput]);

  const handleRiveClick = () => {
    if (growthInput) {
      const newValue = Math.min((growthInput.value as number) + 1, 100);
      growthInput.value = newValue;

      onProgressChange(newValue);

      if(newValue >= 100) {
        onComplete();
      }
    }
  };

  return (
    <RiveComponent
      onClick={handleRiveClick}
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

