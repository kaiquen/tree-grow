/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

export const useMetaMask = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccountsChanged = useCallback((accounts: unknown) => {
    if (Array.isArray(accounts) && accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(null);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask não está instalado!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      handleAccountsChanged(accounts);
    } catch (error: any) {
      if (error.code === 4001) {
        setError("Conexão rejeitada pelo usuário.");
      } else {
        setError("Erro ao conectar com MetaMask.");
      }

      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [handleAccountsChanged]);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          handleAccountsChanged(accounts);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchAccounts();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", () => window.location.reload());

      return () => {
        window.ethereum?.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum?.removeListener("chainChanged", () =>
          window.location.reload()
        );
      };
    }
  }, [handleAccountsChanged]);

  return {
    account,
    isLoading,
    error,
    connectWallet,
  };
};
