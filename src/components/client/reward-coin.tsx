"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Coins } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { withdrawCoins } from "@/actions/user-actions"


export const RewardCoin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useWallet();
    
  const minimumWithdrawal = parseFloat(process.env.NEXT_PUBLIC_MINIMUM_WITHDRAWAL ?? "500");
  const conversionRate = parseFloat(process.env.NEXT_PUBLIC_CONVERSION_RATE ?? "0.0001");

  if(!user) return;

  const handleWithdraw = async () => {
    if (user.coins < minimumWithdrawal) {
      setError(`Saldo mínimo de ${minimumWithdrawal} coins necessário para retirada.`);
      return;
    };

    setLoading(true);
    setError(null);

    try {

      const updatedUser = await withdrawCoins(user.id)

      setUser(updatedUser);

      setIsOpen(false)
    } catch (error: unknown) {
      console.error("Erro ao retirar coins:", error);

      if(error instanceof Error) {
        setError(error.message || "Erro ao retirar coins.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="absolute top-2 right-2 block"> 
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="rounded-full p-2 hover:text-yellow-500 hover:bg-yellow-500/10 text-yellow-500">
          <Coins className="h-6 w-6 " />
          <span className="ml-2 font-bold">{user.coins.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Resgate de Reward Coins</DialogTitle>
          <DialogDescription>
            Transfira suas Reward Coins para sua carteira MetaMask.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Coins className="h-10 w-10 text-yellow-500" />
            <div>
              <p className="text-lg font-semibold">{user.coins.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Coins</p>
              <p className="text-sm text-muted-foreground">
                Disponíveis para resgate
              </p>
            </div>
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-medium">Informações de Resgate:</p>
            <ul className="list-disc list-inside text-sm">
              <li>Valor mínimo para resgate: {minimumWithdrawal} Coins</li>
              <li>
                Taxa de conversão: 1 Coin = {conversionRate.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ETH
              </li>
              <li>
                Valor em ETH: {(user.coins * conversionRate).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ETH
              </li>
            </ul>
          </div>

          {error && (
            <div className="p-2 bg-red-500 text-white rounded">
              {error}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleWithdraw} disabled={user.coins < minimumWithdrawal || loading} aria-disabled={user.coins < minimumWithdrawal || loading}>
            {loading ? "Processando..." : "Resgatar para MetaMask"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  )
}