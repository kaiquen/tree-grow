"use client"

import { MetamaskRequirementDialog } from "@/components/metamask-requirement-dialog";
import { createContext, Dispatch, ReactNode, SetStateAction,  useContext, useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import { authenticateUser } from "@/actions/auth-actions";
import { User } from "@/types/user";
import { useMetaMask } from "@/hooks/use-meta-mask";

type WalletContextProps = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>

  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>

  connectWallet: () => Promise<void>
  isLoading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { account, isLoading, error, connectWallet } = useMetaMask();

  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      if(account) {
        try {
          console.log("Conta detectada no contexto:", account);

          const user = await authenticateUser(account);
          
          console.log("Usuário autenticado:", user);

          
          setUser(user);
          localStorage.setItem("walletAccount", JSON.stringify(account));
        } catch (error) {
          console.error("Erro ao autenticar usuário:", error);
        }
      } else {
        console.log("Nenhuma conta conectada. Redirecionando para /auth.");

        setUser(null);
        localStorage.removeItem("walletAccount");
        router.replace("/auth");
      }
    }

    loadUser();
  }, [account, router]);

  return (
    <WalletContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        user,
        setUser,
        connectWallet,
        isLoading,
        error
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