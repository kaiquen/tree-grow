"use client";

import React, {   useState } from "react";
import  {useRive, useStateMachineInput} from "@rive-app/react-canvas";

const GrowingTree = () => {
  const [clickCount, setClickCount] = useState<number>(0);

  const {RiveComponent, rive} = useRive({
    src:"/animations/pomodoro_tree.riv",
    stateMachines: "State Machine 1",
    autoplay: true, 
  })

  const growthInput = useStateMachineInput(rive, "State Machine 1", "input", clickCount)

  const handleRiveClick = () => {
      setClickCount((prev) => prev + 1);

      if (growthInput) {
        const newValue = Math.min((growthInput.value as number) * 2, 100);
        growthInput.value = newValue;
      }
  };

  return (
    <div className="flex items-center justify-center  flex-col max-h-screen p-4">
      <h1 className="text-4xl font-bold text-green-800 flex items-center justify-center gap-2 mb-2">
        Cuide do seu Broto
      </h1>
      <div
        className="select-none relative w-screen h-screen"
     
      >
        <RiveComponent
          onClick={handleRiveClick}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "contain",
            cursor: "pointer"
          }}
        />
      </div>

    </div>
  );
}

export default GrowingTree;
