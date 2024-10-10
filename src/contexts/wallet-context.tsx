/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { MetamaskRequirementDialog } from "@/components/metamask-requirement-dialog";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import {useRouter} from "next/navigation";

interface IWalletContext {
  account: string[];
  loading: boolean;
  connectWallet: () => Promise<void>;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

const WalletContext = createContext({} as IWalletContext);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleAccountsChanged = (accounts: unknown) => {
    if (Array.isArray(accounts) && accounts.length > 0) {
      setAccount(accounts);
      localStorage.setItem("walletAccount", JSON.stringify(accounts));
    } else {
      setAccount([]);
      localStorage.removeItem("walletAccount");
      router.replace("/");
    }

    setLoading(false);
  };

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
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        loading,
        connectWallet,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}

      <MetamaskRequirementDialog isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </WalletContext.Provider >
  );
};

export const useWallet = () => useContext(WalletContext);