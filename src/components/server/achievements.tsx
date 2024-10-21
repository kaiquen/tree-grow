"use server"

import { prisma } from "@/lib/prisma";

type AchievementsProps = {
  userId: string;
}

export const Achievements = async ({userId}: AchievementsProps) => {  
  const userAchievements = await prisma.userAchievements.findMany({
    where: { userId },
    include: {
      achievement: true,
    },
  });

  const achievements = userAchievements.map((ua) => ({
    id: ua.achievement.id,
    title: ua.achievement.title,
    description: ua.achievement.description,
    imageUrl: ua.achievement.imageUrl,
    createdAt: ua.createdAt,
  }));

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-zinc-300">Minhas Conquistas</h1>
        <span className="text-green-400 font-semibold">{achievements.length}</span>
      </div>
      <div className="pt-4 grid grid-cols-2 gap-4">
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