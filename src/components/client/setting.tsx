import { Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export const Setting = () => {
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-zinc-300/20">
              {<Settings className="text-zinc-300"/>}
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
  );
}