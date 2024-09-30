import Image from "next/image"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import Link from "next/link"
import { Dispatch, SetStateAction } from "react";

type PropsType = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

export const MetamaskRequirementDialog: React.FC<PropsType> = ({ isModalOpen, setIsModalOpen }) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} >
      <DialogContent className="flex flex-col items-center">
        <DialogHeader className="items-center">
          <Image
            src="/icons/metamask-icon.svg"
            alt="Metamask Icon"
            width={42}
            height={42}
          />


          <DialogTitle className="text-green-800">
            Metamask Obrigatório
          </DialogTitle>
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
    </Dialog >
  )
}