"use client"

import { useWallet } from "@/contexts/wallet-context";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Loading } from "./loading";

type PropsType = {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<PropsType> = ({ children }) => {
  const { account, loading } = useWallet();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (account.length === 0) {
      router.replace("/");
    }
  }, [account, router]);


  if (!hasMounted) {
    return null;
  }

  if (loading && account.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  return (
    <>
      {children}
    </>
  )
}