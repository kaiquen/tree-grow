"use client";

import React from "react";

type IProps = {
  children: React.ReactNode;
}

export default function Layout({children}: IProps) {
  return (
    <div className="bg-tree bg-cover bg-center w-screen h-screen">
      {children}
    </div>
  );
}