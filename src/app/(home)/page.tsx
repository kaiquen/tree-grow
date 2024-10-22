"use client";

import { Achievements } from "@/components/server/achievements";
import { Navigation } from "@/components/navigation";
import { Ratings } from "@/components/server/ratings";
import { Tree } from "@/components/tree";
import { useWallet } from "@/contexts/wallet-context";
import { Trees } from "lucide-react";
import { Suspense, useState} from "react";
import { updateTreeProgress } from "@/actions/user-actions";
import { Loading } from "@/components/loading";
import { RewardCoin } from "@/components/client/reward-coin";
import { Setting } from "@/components/client/setting";

export default function Page() {
  const { user, setUser } = useWallet();

  const [activeSection, setActiveSection] = useState("home");

  if(!user) {
    return (
      <div className="h-screen flex items-center justify-center ">
        <Loading />
      </div>
    );
  }
  
  const handleProgressChange = async () => {
    if(!user) return;

    console.log(user);

    const updatedUser = await updateTreeProgress(user)

    setUser(updatedUser);
  };

  return (
      <main className="w-full h-full flex items-center justify-center ">
        <div className="bg-zinc-800 flex flex-col w-96 h-2/3 p-4 rounded-lg shadow-lg overflow-hidden">
          <div className="relative">
            <div className="absolute top-0 right-0">
              <Setting/>
            </div>
            <h1 className="text-4xl font-bold text-green-400 flex items-center justify-center gap-2 mb-2">
              <Trees className="h-10 w-10" />
              Tree Grow
            </h1>
            <div className="w-full flex items-center py-2">
              <p className="text-zinc-200 mr-4">Nível {user.level}</p>
              <div className="rounded-full flex-1 bg-zinc-600 h-2.5 overflow-hidden">
                <div className="h-full bg-green-400 " style={{width: `${user.treeProgress}%`}}/>
              </div>
            </div>
          </div>
          <div className="bg-zinc-600 w-full h-full rounded-lg">
            {activeSection === "home" && 
              <div className="w-full h-full relative ">
                <RewardCoin />
                <Tree 
                  onProgressChange={handleProgressChange}
                  initialProgress={user.treeProgress}
                />
              </div>
            }
            {activeSection === "achievements" && (
              <Suspense fallback={(
                <div className="h-full w-full flex items-center justify-center">
                  <Loading/>
                </div>
              )}>
                <Achievements userId={user.id!} />
              </Suspense>
            )}
            {activeSection === "ratings" && (
              <Suspense fallback={(
                <div className="h-full w-full flex items-center justify-center">
                  <Loading/>
                </div>
              )}>
                <Ratings/>
              </Suspense>
            )}
          </div>  
          <Navigation activeSection={activeSection} setActiveSection={setActiveSection}/>
        </div>
      </main>
  );
}

