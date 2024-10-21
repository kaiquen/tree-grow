"use server";

import { prisma } from "@/lib/prisma";
import { User } from "@/types/user";

export const authenticateUser = async (
  walletAddress: string
): Promise<User> => {
  let user = await prisma.users.findUnique({
    where: { walletAddress },
  });

  if (!user) {
    user = await prisma.users.create({
      data: {
        walletAddress,
        level: 1,
        treeProgress: 0,
      },
    });
  }

  return user;
};
