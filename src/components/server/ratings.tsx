"use server"

import { Award } from "lucide-react";
import { Separator } from "../ui/separator";
import { User } from "@/types/user";
import { getRatings } from "@/actions/user-actions";
import React from "react";
import { truncateAddress } from "@/utils/truncate-address";

export const Ratings = async  () => {
  const users: User[] = await getRatings(); 
 
  return (
    <div className="p-2">
      <h1 className="text-center text-zinc-300 mb-4">Classificações globais</h1>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {users.map((user, index) => (
          <React.Fragment key={user.id}>
            <div className="flex items-top">
              <Award className={`w-6 h-6 shadow-md ${
                index === 0 ? "text-yellow-400": index === 1 ? "text-zinc-400" : index === 2 ? "text-amber-900" : ""}`}/>
              <div className="ml-2">
                <h3 className="text-white">{index > 3 && `${index + 1}.`} {truncateAddress(user.walletAddress)}</h3>
                <p className="text-zinc-400 text-xs ">
                  {user.level - 1 === 0 
                    ? "nenhuma árvore plantada" 
                  : user.level - 1 === 1 
                    ? "1 árvore plantada"
                  : `${user.level - 1} árvores plantadas`
                  }
                </p>
              </div>
            </div>
            {index < users.length - 1 && (
              <Separator className="bg-zinc-500 h-[1px]" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
