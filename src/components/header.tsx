import { Coins, Star } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"

export const Header = () => {
  return (
    <header className="flex p-2 justify-between">
    <div className="flex gap-4 ">
      <div className="flex items-center text-green-500  ">
        <Star className="h-8 w-8 p-2 bg-green-500/20 rounded-full"/>
        <p className="ml-2 text-base font-normal">
        <span className="font-semibold">{2093}</span> 
        {" "}
          pontos
        </p>
      </div>
      <div className="flex items-center text-yellow-500 ">
        <Coins className="h-8 w-8 p-2 bg-yellow-500/20 rounded-full"/>
        <p className="ml-2 text-base font-normal">
          <span className="font-semibold">{2093}</span> 
          {" "}
          moedas
        </p>
      </div>
    </div>
    <div className="flex i">
      <DropdownMenu >
          <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="p-2 rounded-full">
                  {
                      // loading 
                      // ? (<Loader2 className="mr-2 h-4 w-4 animate-spin"/>) 
                      // : (
                      //     <Avatar className="">
                      //         <AvatarImage src="/icons/metamask-icon.svg" alt="Avatar"/>
                      //     </Avatar>
                      // )
                  }
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Suporte</DropdownMenuItem>
              <DropdownMenuSeparator/>
              <DropdownMenuItem className="text-red-500 hover:text-red-500 focus:text-red-500" onClick={() => {}}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
  )
}