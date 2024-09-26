"use client"

import { InfoStep } from "@/components/info-step";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Coins, Droplets, Sprout, Trees } from 'lucide-react'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const connectWallet = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { ethereum } = window as any;

    if (!ethereum) {
      setIsModalOpen(true);
      return;
    }

    try {
      const accounts = await ethereum.request({method: "eth_requestAccounts"})
      console.log("Conectado à conta:", accounts[0]);
      setAccount(accounts[0]);
      setIsConnected(true)
    } catch (error) {
      console.error("Erro ao conectar:", error)
    }
  }

  return (
    <div>
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 flex items-center justify-center gap-2 mb-2">
            <Trees className="h-10 w-10"/>
            Tree Grow
          </h1>
          <p className="text-lg text-green-600">Regue árvores, ganhe criptos</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mb-8">
          {!isConnected && (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 text-lg py-6"
              onClick={connectWallet}
            >
              <Image src="/icons/metamask-icon.svg" width={10} height={10} alt="Metamask Icon" className="h-6 w-6"/>
              Conectar com MetaMask
            </Button>
          )}
          
          {
            account && (
              <p className="text-center">{account.slice(0,6)}...{account.slice(-3)}</p>
            )
          }
       
        </div>

        <div className="w-full max-w-md space-y-4 mb-8">
          <InfoStep icon={Droplets} text="1. Regue" description="Cuide das suas árvores virtuais regando-as regularmente."/>
          <InfoStep icon={Sprout} text="2. Cultive" description="Veja suas árvores crescerem e se desenvolverem com o tempo."/>
          <InfoStep icon={Coins} text="3. Ganhe" description="Receba tokens como recompensa pelo seu cuidado com as árvores."/>
        </div>

        {!isConnected && (
          <p className="text-sm text-gray-600 text-center max-w-md">Conecte sua carteira para começar a cuidar de árvores virtuais e ganhar recompensas!</p>
        )}
      </main>

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
    </div>
  );
}





