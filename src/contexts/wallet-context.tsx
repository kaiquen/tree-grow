/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface WalletContextProps {
  isConnected: boolean;
  account: string | null;
  loading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const WalletContext = createContext<WalletContextProps>({
  isConnected: false,
  account: null,
  loading: true,
  error: null,
  connectWallet: async () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
})

export const WalletProvider:React.FC<{children: ReactNode}> = ({children}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleAccountsChanged = (accounts: unknown) => {
    if (Array.isArray(accounts) && accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
    } else {
      setAccount(null);
      setIsConnected(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if(isConnected) {
      router.push('/treen');
    } else {
      router.replace("/");
    }
  }, [isConnected, router])

  const connectWallet = async () => {
    try {
      setLoading(true);

      const { ethereum } = window ;

      if (!ethereum) {
        setError("MetaMask não está instalado. Por favor, instale MetaMask.");
        setIsModalOpen(true);
        setLoading(false);
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      handleAccountsChanged(accounts);
    } catch (error: any) {
      if (error.code !== -32002) {
        console.error("Erro ao conectar:", error);
        setLoading(false);
      }
    }
  };


  
  useEffect(() => {
    const { ethereum } = window as any;

    if (!ethereum) {
      setError("MetaMask não está instalado. Por favor, instale MetaMask.");
      setLoading(false);
      setIsModalOpen(true);
      return;
    }

    const checkConnection = async () => {
      try {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        handleAccountsChanged(accounts);
      } catch (error: unknown) {
        if(error instanceof Error) {
          setError("Erro ao verificar contas conectadas: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    checkConnection();

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", () => window.location.reload());

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", () => window.location.reload());
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        account,
        loading,
        error,
        connectWallet,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="flex flex-col items-center">
          <DialogHeader >
            <Image src="/icons/metamask-icon.svg" width={10} height={10} alt="Metamask Icon" className="h-12 w-12 mx-auto"/>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-green-800 sm:text-4xl">Metamask Obrigatório</h1>
          </DialogHeader>
            
          <p className="text-center text-muted-foreground">
            Para usar este aplicativo, você precisa ter a extensão Metamask instalada no seu
            navegador. O Metamask permite que você conecte com segurança sua carteira de criptomoedas e
            interaja com aplicativos descentralizados.
          </p>
            
          <DialogFooter className="mx-auto text-center">
            <div className="mt-6">
              <Link
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md  bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium  shadow-sm transition-colors"
              >
                Instalar MetaMask
              </Link>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);