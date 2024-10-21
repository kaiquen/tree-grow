"use server";

import { transferETH } from "@/lib/ethers";
import { prisma } from "@/lib/prisma";
import { User } from "@/types/user";

type AchievementContext = {
  actionCount: number;
  consecutiveDays: number;
};

const calculateConsecutiveDays = (lastWateredAt: Date | null): number => {
  if (!lastWateredAt) return 1;

  const now = new Date();
  const diffTime = now.getTime() - lastWateredAt.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 2;
  } else {
    return 1;
  }
};

const checkAdnGrantAchievements = async (
  userId: string,
  context: AchievementContext
) => {
  const achievements = await prisma.achievements.findMany({
    where: {
      users: {
        none: { userId },
      },
    },
  });

  for (const achievement of achievements) {
    let conditionMet = false;

    switch (achievement.conditionType) {
      case "ACTION_COUNT":
        if (context.actionCount >= achievement.conditionValue) {
          conditionMet = true;
        }
        break;
      case "CONSECUTIVE_DAYS":
        if (context.consecutiveDays >= achievement.conditionValue) {
          conditionMet = true;
        }
        break;

      default:
        break;
    }

    if (conditionMet) {
      await prisma.userAchievements.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
      });
    }
  }
};

export const updateTreeProgress = async (user: User): Promise<User> => {
  const baseIncrement = 10;
  const decrementPerLevel = 1;

  let increment = baseIncrement - (user.level - 1) * decrementPerLevel;

  if (increment < 1) increment = 1;

  let newProgress = user.treeProgress + increment;
  let newLevel = user.level;

  if (newProgress >= 100) {
    newLevel += 1;
    newProgress = 0;
  }

  const baseCoins = 10;
  const coinsPerLevel = 2;
  const coins = baseCoins + (newLevel - 1) * coinsPerLevel;

  const now = new Date();

  const updatedUser = await prisma.users.update({
    where: { id: user.id },
    data: {
      treeProgress: newProgress,
      level: newLevel,
      lastWateredAt: now,
      coins,
    },
  });

  const consecutiveDays = calculateConsecutiveDays(updatedUser.lastWateredAt);

  const context: AchievementContext = {
    actionCount: updatedUser.treeProgress,
    consecutiveDays: consecutiveDays,
  };

  await checkAdnGrantAchievements(user.id, context);

  return updatedUser;
};

export const getUserAchievements = async (userId: string) => {
  const userAchievements = await prisma.userAchievements.findMany({
    where: { userId },
    include: {
      achievement: true,
    },
  });

  return userAchievements.map((ua) => ({
    id: ua.achievement.id,
    title: ua.achievement.title,
    description: ua.achievement.description,
    imageUrl: ua.achievement.imageUrl,
    createdAt: ua.createdAt,
  }));
};

export const updateUser = async (user: User) => {
  await prisma.users.update({
    where: { id: user.id },
    data: {
      ...user,
    },
  });
};

export const getRatings = async (): Promise<User[]> => {
  const users = await prisma.users.findMany({
    orderBy: [{ level: "desc" }, { treeProgress: "desc" }],
    take: 10,
  });

  return users;
};

const subtractCoins = async (
  userId: string,
  coinsToSubtract: number
): Promise<User> => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  if (user.coins < coinsToSubtract) {
    throw new Error("Coins insuficientes para retiradas.");
  }

  const updatedUser = await prisma.users.update({
    where: { id: user.id },
    data: {
      coins: { decrement: coinsToSubtract },
    },
  });

  return updatedUser;
};

export const withdrawCoins = async (userId: string): Promise<User> => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const coinsToWithdraw = user.coins;
  if (coinsToWithdraw < 20) {
    throw new Error("Saldo mínimo de 500 coins necessário para retirada.");
  }

  const conversionRate = 0.001;
  const amountInETH = coinsToWithdraw * conversionRate;

  try {
    const tx = await transferETH(user.walletAddress, amountInETH);

    await tx.wait();

    const updatedUser = await subtractCoins(user.id, coinsToWithdraw);

    await prisma.withdrawals.create({
      data: {
        userId: userId,
        amountETH: BigInt(Math.floor(amountInETH * 1e18)), // Convertendo ETH para Wei como bigint
        amountCoins: coinsToWithdraw,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Erro ao transferir ETH:", error);
    throw new Error(
      "Falha ao realizar a retirada. Tente novamente mais tarde."
    );
  }
};
