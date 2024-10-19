/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { MetamaskRequirementDialog } from "@/components/metamask-requirement-dialog";
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import {useRouter} from "next/navigation";

type UserData = {
  walletAddress: string;
  level: number;
  treeProgress: number;
}

type WalletContextProps = {
  loading: boolean;
  connectWallet: () => Promise<void>;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
  userData: UserData | null;
  setUserData: Dispatch<SetStateAction<UserData | null>>
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const router = useRouter();

  const loadOrCreateUser = useCallback(async (walletAddress: string) => {
    try {
      const res = await fetch("/api/users", {
        method:"POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({walletAddress})
      });

      const data = await res.json();

      setUserData(data);
    } catch (error) {
      console.error("Erro ao carregar ou criar usuário:", error);
    }
  }, [setUserData]);

  const handleAccountsChanged = useCallback((accounts: unknown) => {
    if (Array.isArray(accounts) && accounts.length > 0) {
      const [firstAccount] = accounts;

      localStorage.setItem("walletAccount", JSON.stringify(accounts));
      loadOrCreateUser(firstAccount);
    } else {
      setUserData(null);
      localStorage.removeItem("walletAccount");
      router.replace("/auth");
    }

    setLoading(false);
  }, [loadOrCreateUser, setUserData, router]);

  const connectWallet = async () => {
    setLoading(true);

    const { ethereum } = window;

    if (!ethereum) {
      setIsModalOpen(true);
      setLoading(false);
      return;
    }

    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      handleAccountsChanged(accounts);
    } catch (error: any) {
      if (error.code !== -32002) {
        console.error("Erro ao conectar:", error);
      }
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    const {ethereum} = window;

    if(ethereum) {
      ethereum.request({method:"eth_accounts"}).then(handleAccountsChanged);

      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", () => window.location.reload());

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum?.removeListener("chainChanged", () => window.location.reload());
      };
    } else {
      setLoading(false)
    }
  }, [handleAccountsChanged]);

  return (
    <WalletContext.Provider
      value={{
        loading,
        connectWallet,
        isModalOpen,
        setIsModalOpen,
        userData,
        setUserData
      }}
    >
      {children}

      <MetamaskRequirementDialog isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </WalletContext.Provider >
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
 
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }

  return context;
};