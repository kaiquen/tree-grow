import { ethers } from "ethers";

const systemWalletPrivateKey = process.env.SYSTEM_WALLET_PRIVATE_KEY;
const ethereumNetwork = process.env.ETHEREUM_NETWORK || "sepolia";
const infuraProjectId = process.env.INFURA_PROJECT_ID;

if (!infuraProjectId) {
  throw new Error("O Project ID do Infura não está definido.");
}

if (!systemWalletPrivateKey) {
  throw new Error("A chave privada da carteira do sistema não está definida.");
}

const providerUrl = `https://${ethereumNetwork}.infura.io/v3/${infuraProjectId}`;

const provider = new ethers.JsonRpcProvider(providerUrl);

export const systemWallet = new ethers.Wallet(systemWalletPrivateKey, provider);

export const transferETH = async (
  to: string,
  amountEmETH: number
): Promise<ethers.TransactionResponse> => {
  if (!ethers.isAddress(to)) {
    throw new Error("Endereço de destino inválido.");
  }

  const amountInWei = ethers.parseEther(amountEmETH.toString());

  const balance = await provider.getBalance(systemWallet.address);
  if (balance < amountInWei) {
    throw new Error(
      "Saldo insuficiente na carteira do sistema para realizar a transferência."
    );
  }

  const tx = await systemWallet.sendTransaction({
    to,
    value: amountInWei,
  });

  return tx;
};
