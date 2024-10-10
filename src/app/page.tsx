/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { InfoStep } from "@/components/info-step";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet-context";
import { Coins, Droplets, Sprout, Trees } from 'lucide-react'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { account, loading, connectWallet } = useWallet();

  const router = useRouter();

  useEffect(() => {
    if (account.length > 0) {
      router.replace("/tree");
    }
  }, [account, router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-800 flex items-center justify-center gap-2 mb-2">
          <Trees className="h-10 w-10" />
          Tree Grow
        </h1>
        <p className="text-lg text-green-600">Regue árvores, ganhe criptos</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mb-8">
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 text-lg py-6"
          onClick={connectWallet}
          disabled={loading}
        >
          {account.length === 0 && loading ? (
            <Loading />
          ) : (
            <>
              <Image src="/icons/metamask-icon.svg" width={10} height={10} alt="Metamask Icon" className="h-6 w-6" />
              Conectar com MetaMask
            </>
          )}
        </Button>
      </div>

      <div className="w-full max-w-md space-y-4 mb-8">
        <InfoStep icon={Droplets} iconColor="text-blue-600" bgIconColor="bg-blue-100" text="1. Regue" description="Cuide das suas árvores virtuais regando-as regularmente." />
        <InfoStep icon={Sprout} iconColor="text-green-600" bgIconColor="bg-green-100" text="2. Cultive" description="Veja suas árvores crescerem e se desenvolverem com o tempo." />
        <InfoStep icon={Coins} iconColor="text-yellow-600" bgIconColor="bg-yellow-100" text="3. Ganhe" description="Receba tokens como recompensa pelo seu cuidado com as árvores." />
      </div>

      <p className="text-sm text-gray-600 text-center max-w-md">Conecte sua carteira para começar a cuidar de árvores virtuais e ganhar recompensas!</p>
    </main>
  );
}