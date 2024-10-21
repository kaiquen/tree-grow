export type User = {
  id: string;
  walletAddress: string;
  level: number;
  treeProgress: number;
  coins: number;
  lastWateredAt: Date | null;
};
