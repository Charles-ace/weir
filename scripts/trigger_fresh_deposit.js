const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const SEPOLIA_RPC = process.env.SEPOLIA_RPC || "https://ethereum-sepolia-rpc.publicnode.com";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const MOCK_USDC_ABI = [
  "function faucet(address to, uint256 amount) external",
  "function approve(address spender, uint256 amount) external returns (bool)"
];

const WEIR_VAULT_ABI = [
  "function depositRevenue(uint256 assetId, uint256 grossAmount) external",
  "event RevenueDeposited(uint256 indexed assetId, uint256 grossAmount, uint256 period, address payor)"
];

async function main() {
  console.log("===============================================================================");
  console.log("  TRIGGER FRESH SEPOLIA DEPOSIT (FOR LIVE RELAYER VALIDATION)");
  console.log("===============================================================================\n");

  const sepoliaDep = JSON.parse(fs.readFileSync(path.join(__dirname, "../deployments/sepolia.json"), "utf8"));
  const mockUSDCAddr = sepoliaDep.contracts.MockUSDC;
  const weirVaultAddr = sepoliaDep.contracts.WeirVault;

  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Signer Address: ", signer.address);
  console.log("WeirVault:      ", weirVaultAddr);
  console.log("MockUSDC:       ", mockUSDCAddr);

  const mockUSDC = new ethers.Contract(mockUSDCAddr, MOCK_USDC_ABI, signer);
  const weirVault = new ethers.Contract(weirVaultAddr, WEIR_VAULT_ABI, signer);

  const testAmount = ethers.parseUnits("500", 6); // 500 USDC test deposit
  console.log("\n1. Fauceting 500 mUSDC on Sepolia...");
  const fTx = await mockUSDC.faucet(signer.address, testAmount);
  await fTx.wait(1);
  console.log("   Faucet tx confirmed.");

  console.log("2. Approving WeirVault for 500 mUSDC...");
  const aTx = await mockUSDC.approve(weirVaultAddr, testAmount);
  await aTx.wait(1);
  console.log("   Approval tx confirmed.");

  console.log("3. Executing depositRevenue(Asset #1, 500 USDC)...");
  const dTx = await weirVault.depositRevenue(1, testAmount);
  console.log(`   Deposit Tx Submitted: ${dTx.hash}`);
  const receipt = await dTx.wait(1);

  console.log("\n>>> FRESH SEPOLIA DEPOSIT CONFIRMED!");
  console.log(`    Tx Hash:      ${dTx.hash}`);
  console.log(`    Block Number: ${receipt.blockNumber}`);
  console.log(`    Etherscan:    https://sepolia.etherscan.io/tx/${dTx.hash}\n`);
}

main().catch((err) => {
  console.error("Deposit error:", err);
  process.exit(1);
});
