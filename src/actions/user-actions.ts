"use server";

import { transferETH } from "@/lib/ethers";
import { prisma } from "@/lib/prisma";
import { User } from "@/types/user";

type AchievementContext = {
  level: number;
  progress: number;
  withdrawals: number;
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

const checkAndGrantAchievements = async (
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
        if (achievement.code.includes("TREE")) {
          if (context.level - 1 >= achievement.conditionValue) {
            conditionMet = true;
          }
        }

        if (achievement.code.includes("WATER")) {
          if (context.progress >= achievement.conditionValue) {
            conditionMet = true;
          }
        }

        if (achievement.code.includes("WITHDRAW")) {
          if (context.withdrawals >= achievement.conditionValue) {
            conditionMet = true;
          }
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
  const treeBaseIncrement = parseFloat(
    process.env.TREE_BASE_INCREMENT ?? "10.0"
  );
  const treeDecrementPerLevel = parseFloat(
    process.env.TREE_DECREMENTE_PER_LEVEL ?? "0.6"
  );

  const coinBaseIncrement = parseFloat(
    process.env.COIN_BASE_INCREMENT ?? "1.0"
  );
  const coinBaseDecrementPerLevel = parseFloat(
    process.env.COIN_BASE_DECREMENT_PER_LEVEL ?? "0.1"
  );
  const coinAdditionalPerLevel = parseFloat(
    process.env.COIN_PER_LEVEL ?? "1.0"
  );
  const coinAdditionalPerLevelIncrease = parseFloat(
    process.env.COIN_ADDITIONAL_PER_LEVEL_INCREASE ?? "0.2"
  );

  let increment = treeBaseIncrement - (user.level - 1) * treeDecrementPerLevel;

  if (increment < 0.1) increment = 0.1;

  let newProgress = user.treeProgress + increment;
  let newLevel = user.level;
  let additionalCoins = 0;

  if (newProgress >= 100) {
    newLevel += 1;
    newProgress = 0;

    additionalCoins =
      coinAdditionalPerLevel + (newLevel - 1) * coinAdditionalPerLevelIncrease;
  }

  let coins = coinBaseIncrement - (user.level - 1) * coinBaseDecrementPerLevel;

  if (coins < 0.1) coins = 0.1;

  const now = new Date();

  const updatedUser = await prisma.users.update({
    where: { id: user.id },
    data: {
      treeProgress: newProgress,
      level: newLevel,
      lastWateredAt: now,
      coins: user.coins + coins + additionalCoins,
    },
  });

  const consecutiveDays = calculateConsecutiveDays(updatedUser.lastWateredAt);

  const withdrawals = await prisma.withdrawals.count({
    where: { userId: user.id },
  });

  const context: AchievementContext = {
    level: updatedUser.level,
    progress: updatedUser.treeProgress,
    withdrawals,
    consecutiveDays: consecutiveDays,
  };

  await checkAndGrantAchievements(user.id, context);

  return updatedUser;
};

export const getAchievements = async (userId: string) => {
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
  const minimumWithdrawal = parseFloat(
    process.env.NEXT_PUBLIC_MINIMUM_WITHDRAWAL ?? "50.00"
  );
  const conversionRate = parseFloat(
    process.env.NEXT_PUBLIC_CONVERSION_RATE ?? "0.0001"
  );

  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const coinsToWithdraw = user.coins;

  if (coinsToWithdraw < minimumWithdrawal) {
    throw new Error(
      `Saldo mínimo de ${minimumWithdrawal} coins necessário para retirada.`
    );
  }

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
