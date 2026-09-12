const { ethers } = require("ethers");
require("dotenv").config();

const SEPOLIA_RPC = process.env.SEPOLIA_RPC || "https://ethereum-sepolia-rpc.publicnode.com";
const CC3_RPC = process.env.CC3_RPC || "https://rpc.cc3-testnet.creditcoin.network";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function check() {
  const sepoliaProvider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const cc3Provider = new ethers.JsonRpcProvider(CC3_RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY);

  console.log("Wallet Address: " + wallet.address);
  const sepoliaBal = await sepoliaProvider.getBalance(wallet.address);
  const cc3Bal = await cc3Provider.getBalance(wallet.address);

  console.log("Sepolia ETH:  " + ethers.formatEther(sepoliaBal) + " ETH");
  console.log("Creditcoin CTC: " + ethers.formatEther(cc3Bal) + " CTC");
}

check().catch(console.error);
