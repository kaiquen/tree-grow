import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { walletAddress } = await request.json();

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

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const { walletAddress, level, treeProgress } = await request.json();

  console.log(level);

  const updatedUser = await prisma.users.update({
    where: { walletAddress },
    data: {
      level,
      treeProgress,
    },
  });

  return NextResponse.json(updatedUser);
}
