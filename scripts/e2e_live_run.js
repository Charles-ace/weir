/**
 * WEIR Protocol — Automated Live End-to-End Testnet Execution Script
 */

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const { WeirRelayer } = require("./relayer");
require("dotenv").config();

const SEPOLIA_RPC = process.env.SEPOLIA_RPC || "https://ethereum-sepolia-rpc.publicnode.com";
const CC3_RPC = process.env.CC3_RPC || "https://rpc.cc3-testnet.creditcoin.network";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const MOCK_USDC_ABI = [
  "function faucet(address to, uint256 amount) external",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)"
];

const WEIR_VAULT_ABI = [
  "function depositRevenue(uint256 assetId, uint256 grossAmount) external",
  "function registeredAssets(uint256) external view returns (string name, address manager, address paymentToken, uint256 expectedGrossPerPeriod, bool active)"
];

const WEIR_ASC_ABI = [
  "function getClaimableDividend(uint256 assetId, address investor) external view returns (uint256)",
  "function assetStates(uint256 assetId) external view returns (string name, uint256 totalShares, uint256 expectedPeriodAmount, uint256 cumulativeDividendPerShare, uint256 totalRevenueProcessed, uint256 currentPeriod, bool active)"
];

async function main() {
  console.log("\n===============================================================");
  console.log("  WEIR LIVE END-TO-END VERIFICATION RUNNER");
  console.log("===============================================================\n");

  if (!PRIVATE_KEY || PRIVATE_KEY === "0x0000000000000000000000000000000000000000000000000000000000000001") {
    console.error("[-] ERROR: No funded PRIVATE_KEY found in environment or .env!");
    console.error("    Please set PRIVATE_KEY in .env with Sepolia ETH and CC3 CTC.");
    process.exit(1);
  }

  const sepoliaProvider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const cc3Provider = new ethers.JsonRpcProvider(CC3_RPC);

  const sepoliaSigner = new ethers.Wallet(PRIVATE_KEY, sepoliaProvider);
  const cc3Signer = new ethers.Wallet(PRIVATE_KEY, cc3Provider);

  console.log(`Deployer Address: ${sepoliaSigner.address}`);

  const sepoliaBalance = await sepoliaProvider.getBalance(sepoliaSigner.address);
  const cc3Balance = await cc3Provider.getBalance(cc3Signer.address);

  console.log(`Sepolia Balance:  ${ethers.formatEther(sepoliaBalance)} ETH`);
  console.log(`CC3 CTC Balance:  ${ethers.formatEther(cc3Balance)} CTC\n`);

  if (sepoliaBalance === 0n) {
    console.error("[-] ERROR: Signer has 0 Sepolia ETH. Cannot perform live on-chain deposit.");
    process.exit(1);
  }
  if (cc3Balance === 0n) {
    console.error("[-] ERROR: Signer has 0 CC3 CTC. Cannot perform live on-chain distribution.");
    process.exit(1);
  }

  const deploymentsDir = path.join(__dirname, "../deployments");
  const sepoliaDepPath = path.join(deploymentsDir, "sepolia.json");
  const cc3DepPath = path.join(deploymentsDir, "creditcoinTestnet.json");

  if (!fs.existsSync(sepoliaDepPath) || !fs.existsSync(cc3DepPath)) {
    console.error("[-] Deployments not found for sepolia or creditcoinTestnet.");
    console.error("    Please deploy contracts first via scripts/deploy.js");
    process.exit(1);
  }

  const sepoliaDeployments = JSON.parse(fs.readFileSync(sepoliaDepPath, "utf8"));
  const cc3Deployments = JSON.parse(fs.readFileSync(cc3DepPath, "utf8"));

  const mockUSDCAddress = sepoliaDeployments.contracts.MockUSDC;
  const weirVaultAddress = sepoliaDeployments.contracts.WeirVault;
  const weirASCAddress = cc3Deployments.contracts.WeirDistributionASC;

  console.log("Loaded Deployments:");
  console.log(`  MockUSDC (Sepolia):           ${mockUSDCAddress}`);
  console.log(`  WeirVault (Sepolia):          ${weirVaultAddress}`);
  console.log(`  WeirDistributionASC (CC3):    ${weirASCAddress}\n`);

  console.log("[Step 1] Minting 10,000 mUSDC on Sepolia...");
  const mockUSDC = new ethers.Contract(mockUSDCAddress, MOCK_USDC_ABI, sepoliaSigner);
  const weirVault = new ethers.Contract(weirVaultAddress, WEIR_VAULT_ABI, sepoliaSigner);

  const depositAmount = ethers.parseUnits("10000", 6);
  const mintTx = await mockUSDC.faucet(sepoliaSigner.address, depositAmount);
  console.log(`  Faucet Tx Submitted: ${mintTx.hash}`);
  await mintTx.wait(1);
  console.log("  Faucet Confirmed!\n");

  console.log("[Step 2] Approving WeirVault to spend 10,000 mUSDC...");
  const approveTx = await mockUSDC.approve(weirVaultAddress, depositAmount);
  console.log(`  Approve Tx Submitted: ${approveTx.hash}`);
  await approveTx.wait(1);
  console.log("  Approve Confirmed!\n");

  console.log("[Step 3] Executing depositRevenue(assetId=1, amount=10,000 mUSDC) on Sepolia...");
  const depositTx = await weirVault.depositRevenue(1, depositAmount);
  console.log(`  Deposit Tx Hash: ${depositTx.hash}`);
  const depositReceipt = await depositTx.wait(1);
  console.log(`  Deposit Confirmed in Sepolia Block: ${depositReceipt.blockNumber}`);
  console.log(`  Gas Used: ${depositReceipt.gasUsed.toString()}\n`);

  console.log("[Step 4] Handing off to Attestcoin Relayer...");
  const relayer = new WeirRelayer(weirASCAddress, PRIVATE_KEY);
  const relayResult = await relayer.relayTransaction(depositTx.hash);

  console.log("\n===============================================================");
  console.log("  RAW ON-CHAIN EXECUTION EVIDENCE");
  console.log("===============================================================");
  console.log(`  Sepolia Deposit Tx:    ${depositTx.hash}`);
  console.log(`  Sepolia Block:         ${depositReceipt.blockNumber}`);
  console.log(`  Creditcoin CC3 Tx:     ${relayResult.cc3TxHash}`);
  console.log(`  Creditcoin CC3 Block:  ${relayResult.cc3Block}`);
  console.log(`  Etherscan URL:         https://sepolia.etherscan.io/tx/${depositTx.hash}`);
  console.log(`  Creditcoin Explorer:   https://creditcoin-testnet.blockscout.com/tx/${relayResult.cc3TxHash}`);

  console.log("\n[Step 5] Verifying Post-Distribution State on Creditcoin CC3...");
  const weirASC = new ethers.Contract(weirASCAddress, WEIR_ASC_ABI, cc3Provider);
  const assetState = await weirASC.assetStates(1);
  console.log(`  Asset: ${assetState.name}`);
  console.log(`  Cumulative Dividend Per Share: ${ethers.formatEther(assetState.cumulativeDividendPerShare)}`);

  const alice = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const bob   = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
  const charlie = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";

  const aliceClaim = await weirASC.getClaimableDividend(1, alice);
  const bobClaim   = await weirASC.getClaimableDividend(1, bob);
  const charlieClaim = await weirASC.getClaimableDividend(1, charlie);

  console.log(`  Alice Claimable (50%):   ${ethers.formatUnits(aliceClaim, 6)} mUSDC`);
  console.log(`  Bob Claimable (30%):     ${ethers.formatUnits(bobClaim, 6)} mUSDC`);
  console.log(`  Charlie Claimable (20%): ${ethers.formatUnits(charlieClaim, 6)} mUSDC`);
  console.log("===============================================================\n");
}

main().catch((err) => {
  console.error("[-] Live Run Failed:", err);
  process.exit(1);
});
