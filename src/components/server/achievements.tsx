"use server"

import { getAchievements } from "@/actions/user-actions";

type AchievementsProps = {
  userId: string;
}

export const Achievements = async ({userId}: AchievementsProps) => {  
  const achievements = await getAchievements(userId);

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-zinc-300">Minhas Conquistas</h1>
        <span className="text-green-400 font-semibold">{achievements.length}</span>
      </div>
      <div className="max-h-56 grid grid-cols-2 gap-4 overflow-y-auto">
        {achievements.map(achievement => (
          <div key={achievement.id} className="flex flex-col items-center">
            <img src={achievement.imageUrl} width={50} height={50} alt={achievement.title} className="object-contain"/>
            <p className="text-zinc-200 text-sm text-center mt-2">{achievement.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}