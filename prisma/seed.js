/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const achievements = [
    {
      code: "FIRST_WATER",
      title: "Primeira Rega",
      description: "Você regou sua primeira árvore!",
      imageUrl: "/images/first_water.png",
      conditionType: "ACTION_COUNT",
      conditionValue: 1,
    },
    {
      code: "FIRST_TREE",
      title: "Primeira Árvore Plantada",
      description: "Você plantou sua primeira árvore!",
      imageUrl: "/images/first_tree.png",
      conditionType: "ACTION_COUNT",
      conditionValue: 1,
    },
    {
      code: "THREE_TREE",
      title: "Terceira Árvore Plantada",
      description: "Você plantou sua terceira árvore!",
      imageUrl: "/images/three_trees.png",
      conditionType: "ACTION_COUNT",
      conditionValue: 3,
    },
    {
      code: "FIVE_TREE",
      title: "Quinta Árvore Plantada",
      description: "Você plantou sua quinta árvore!",
      imageUrl: "/images/five_trees.png",
      conditionType: "ACTION_COUNT",
      conditionValue: 5,
    },
    {
      code: "TEN_TREE",
      title: "Decima Árvore Plantada",
      description: "Você plantou sua decima árvore!",
      imageUrl: "/images/ten_trees.png",
      conditionType: "ACTION_COUNT",
      conditionValue: 10,
    },
    {
      code: "FIRST_WITHDRAW",
      title: "Primeiro Resgate",
      description: "Você resgatou reward coins pela primeira vez!",
      imageUrl: "/images/first_withdraw.png",
      conditionType: "ACTION_COUNT",
      conditionValue: 1,
    },
    {
      code: "TWO_DAYS_CONSECUTIVE",
      title: "Dois Dias Consecutivos",
      description: "Você regou por dois dias consecutivos!",
      imageUrl: "/images/two_days.png",
      conditionType: "CONSECUTIVE_DAYS",
      conditionValue: 2,
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievements.upsert({
      where: { code: achievement.code },
      update: {
        title: achievement.title,
        description: achievement.description,
        imageUrl: achievement.imageUrl,
        conditionType: achievement.conditionType,
        conditionValue: achievement.conditionValue,
      },
      create: achievement,
    });
  }

  console.log("Conquistas iniciais inseridas com sucesso.");
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
