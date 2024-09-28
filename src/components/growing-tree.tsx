import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const stages = [
  "images/sprout.png",    // estágio 1: broto
  "images/youngTree.png", // estágio 2: árvore jovem
  "images/tree.png",      // estágio 3: árvore completa
];

const GrowingTree = () => {
  const [growthStage, setGrowthStage] = useState(0);

  const waterPlant = () => {
    setGrowthStage((prevStage) => (prevStage < stages.length - 1 ? prevStage + 1 : prevStage));
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Cuide do seu Broto</h1>

      <motion.div
        key={growthStage}
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }}  
        transition={{ duration: 0.5 }}     
        style={{ display: "inline-block" }} 
      >
        <Image
          src={stages[growthStage]}
          width={100}
          height={100}
          alt="Estágio de Crescimento"
          style={{ width: "200px", height: "auto" }}
        />
      </motion.div>

      <br />
      <button onClick={waterPlant} style={{ marginTop: "20px" }}>
        Regar
      </button>
    </div>
  );
}

export default GrowingTree;
