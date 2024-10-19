"use client";

import { Achievements } from "@/components/achievements";
import { Navigation } from "@/components/navigation";
import { Ratings } from "@/components/ratings";
import { Tree } from "@/components/tree";
import { useWallet } from "@/contexts/wallet-context";
import { Loader, Trees } from "lucide-react";
import { useCallback, useState} from "react";

export default function Page() {
  const { userData, setUserData } = useWallet();

  const [activeSection, setActiveSection] = useState("home");
  const [resetTree, setResetTree] = useState(false);


  const handleTreeComplete = useCallback( async () => {    
    if(!userData) return;
    
    const nextLevel = ++userData.level;

    setUserData({
      ...userData,
      level: nextLevel,
      treeProgress: 0
    });

    setResetTree((prev) => !prev);

    await fetch("/api/users/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress: userData.walletAddress,
        level: userData.level,
        treeProgress: userData.treeProgress,
      }),
    });
  }, [setUserData, setResetTree, userData]);
  
  const handleProgressChange = useCallback(async (progress: number) => {
    if(!userData) return;

    setUserData({...userData, treeProgress: progress});

    await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress: userData.walletAddress,
        treeProgress: progress,
      }),
    })
  }, [userData, setUserData]);

  if(!userData) {
    return (
      <Loader className="w-10 h-10 animate-spin"/>
    );
  }

  return (
      <main className="w-full h-full flex items-center justify-center ">
        <div className="bg-zinc-800 flex flex-col w-96 h-2/3 p-4 rounded-lg shadow-lg overflow-hidden">
          <div>
            <h1 className="text-4xl font-bold text-green-400 flex items-center justify-center gap-2 mb-2">
              <Trees className="h-10 w-10" />
              Tree Grow
            </h1>
            <div className="w-full flex items-center py-2">
              <p className="text-zinc-200 mr-4">Nível {userData.level}</p>
              <div className="rounded-full flex-1 bg-zinc-600 h-2.5">
                <div className="h-full bg-green-400" style={{width: `${userData.treeProgress}%`}}/>
              </div>
            </div>
          </div>
          <div className="bg-zinc-600 w-full h-full rounded-lg">
            {activeSection === "home" && 
              <Tree 
                onComplete={handleTreeComplete} 
                resetSignal={resetTree} 
                onProgressChange={handleProgressChange}
                initialProgress={userData.treeProgress}
              />
            }
            {activeSection === "achievements" && <Achievements/>}
            {activeSection === "ratings" && <Ratings/>}
          </div>  
          <Navigation activeSection={activeSection} setActiveSection={setActiveSection}/>
        </div>
      </main>
  );
}

 {/* <div className="flex flex-col items-center gap-8">
          <Image src="/image/natureza.png" alt="natureza" width={100} height={100}/>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              As árvores estão crescendo!
            </h1>
            <p className="text-base text-green-600">
            Você é demais! Continue mantendo o nível de água regulado
            Lembre-se de todo dia regar a sua árvore para ganhar suas recompensas e ajudar o meio ambiente!
            </p>
          </div>
        </div>
        <div className="w-full h-96 ">
          <Tree />
        </div>
        <div className="">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
              Minhas Árvores
          </h1>

          <div>

          </div>

        </div> */}