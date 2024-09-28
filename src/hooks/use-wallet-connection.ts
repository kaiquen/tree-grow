import { useEffect, useState } from "react";

export const useWalletConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const { ethereum } = window;

    if (!ethereum) {
      setError("MetaMask não está instalado. Por favor, instale MetaMask.");
      setIsModalOpen(true);
      setLoading(false);
      return;
    }

    const checkConnection = async () => {
      try {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        handleAccountsChanged(accounts);
      } catch (error: unknown) {
        if (error instanceof Error) {
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

  return {
    isConnected,
    account,
    loading,
    setLoading,
    error,
    isModalOpen,
    setIsModalOpen,
  };
};
