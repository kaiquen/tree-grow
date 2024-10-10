"use client";

import GrowingTree from "@/components/growing-tree";
import {useEffect, useState} from "react";


export default function Page() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if(!isMounted) return null;

  return (
      <GrowingTree />
  );
}