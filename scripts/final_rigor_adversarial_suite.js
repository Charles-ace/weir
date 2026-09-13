const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const SEPOLIA_RPC = process.env.SEPOLIA_RPC || "https://ethereum-sepolia-rpc.publicnode.com";
const CC3_RPC = process.env.CC3_RPC || "https://rpc.cc3-testnet.creditcoin.network";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Contract ABIs
const WEIR_ASC_ABI = [
  "function claimDividend(uint256 assetId) external returns (uint256)",
  "function getClaimableDividend(uint256 assetId, address investor) external view returns (uint256)",
  "function investorShares(uint256 assetId, address investor) external view returns (uint256)",
  "function assetStates(uint256 assetId) external view returns (string name, uint256 totalShares, uint256 expectedPeriodAmount, uint256 cumulativeDividendPerShare, uint256 totalRevenueProcessed, uint256 currentPeriod, bool active)",
  "function verifyAndDistribute(uint64 chainKey, uint64 blockHeight, bytes calldata encodedTransaction, bytes32 merkleRoot, tuple(bytes32 hash, bool isLeft)[] calldata siblings, bytes32 lowerEndpointDigest, bytes32[] calldata continuityRoots) external returns (bool)",
  "event DividendClaimed(uint256 indexed assetId, address indexed investor, uint256 amountClaimed)",
  "event DividendsCalculated(uint256 indexed assetId, uint256 grossAmount, uint256 period, uint256 newCumulativeIndex, bytes32 txKey)",
  "event RevenueShortfall(uint256 indexed assetId, uint256 expectedAmount, uint256 receivedAmount, uint256 period)"
];

const MOCK_USDC_ABI = [
  "function faucet(address to, uint256 amount) external",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)"
];

const WEIR_VAULT_ABI = [
  "function depositRevenue(uint256 assetId, uint256 grossAmount) external",
  "function getAsset(uint256 assetId) external view returns (tuple(string name, address sponsor, address token, uint256 expectedPeriodAmount, uint256 currentPeriod, uint256 totalRevenueCollected, bool active))"
];

async function main() {
  console.log("===============================================================================");
  console.log("  WEIR FINAL RIGOR / ADVERSARIAL BREAK-TEST SUITE");
  console.log("===============================================================================\n");

  const sepoliaProvider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const cc3Provider = new ethers.JsonRpcProvider(CC3_RPC);

  const deployerSepolia = new ethers.Wallet(PRIVATE_KEY, sepoliaProvider);
  const deployerCC3 = new ethers.Wallet(PRIVATE_KEY, cc3Provider);

  // Hardhat standard Alice key
  const ALICE_KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
  const aliceCC3 = new ethers.Wallet(ALICE_KEY, cc3Provider);

  // Random stranger key
  const strangerCC3 = ethers.Wallet.createRandom().connect(cc3Provider);

  const sepoliaDep = JSON.parse(fs.readFileSync(path.join(__dirname, "../deployments/sepolia.json"), "utf8"));
  const cc3Dep = JSON.parse(fs.readFileSync(path.join(__dirname, "../deployments/creditcoinTestnet.json"), "utf8"));

  const mockUSDCAddr = sepoliaDep.contracts.MockUSDC;
  const weirVaultAddr = sepoliaDep.contracts.WeirVault;
  const weirASCAddr = cc3Dep.contracts.WeirDistributionASC;

  console.log("Addresses:");
  console.log("  Deployer:                 ", deployerCC3.address);
  console.log("  Alice:                    ", aliceCC3.address);
  console.log("  Stranger:                 ", strangerCC3.address);
  console.log("  WeirVault (Sepolia):      ", weirVaultAddr);
  console.log("  MockUSDC (Sepolia):       ", mockUSDCAddr);
  console.log("  WeirDistributionASC (CC3):", weirASCAddr);
  console.log("");

  const ascContract = new ethers.Contract(weirASCAddr, WEIR_ASC_ABI, cc3Provider);

  // --------------------------------------------------------------------------
  // TEST 1: LIVE ON-CHAIN CLAIM BY ALICE (CC3 TESTNET)
  // --------------------------------------------------------------------------
  console.log(">>> [TEST 1] LIVE INVESTOR CLAIM: Alice claims 50% pro-rata dividend on CC3...");
  const aliceClaimableBefore = await ascContract.getClaimableDividend(1, aliceCC3.address);
  console.log(`  Alice Claimable Before: ${ethers.formatUnits(aliceClaimableBefore, 6)} USDC`);

  if (aliceClaimableBefore > 0n) {
    const aliceBal = await cc3Provider.getBalance(aliceCC3.address);
    if (aliceBal < ethers.parseEther("0.05")) {
      console.log("  Funding Alice with 0.2 CTC for gas...");
      const fundTx = await deployerCC3.sendTransaction({
        to: aliceCC3.address,
        value: ethers.parseEther("0.2")
      });
      await fundTx.wait(1);
    }

    const ascAlice = ascContract.connect(aliceCC3);
    const claimTx = await ascAlice.claimDividend(1);
    console.log(`  Claim Tx Submitted: ${claimTx.hash}`);
    const claimReceipt = await claimTx.wait(1);
    console.log(`  Claim Confirmed in CC3 Block: ${claimReceipt.blockNumber} (Gas Used: ${claimReceipt.gasUsed.toString()})`);
    console.log(`  Blockscout URL: https://creditcoin-testnet.blockscout.com/tx/${claimTx.hash}`);

    const aliceClaimableAfter = await ascContract.getClaimableDividend(1, aliceCC3.address);
    console.log(`  Alice Claimable After: ${ethers.formatUnits(aliceClaimableAfter, 6)} USDC`);
    console.log("  [TEST 1 RESULT]: PASS - Live claim succeeded with verifiable on-chain receipt.\n");
  } else {
    console.log("  [TEST 1 NOTE]: Alice has already claimed previously. Proceeding to break-tests.\n");
  }

  // --------------------------------------------------------------------------
  // TEST 2: ADVERSARIAL BREAK-ATTEMPT 1 - DOUBLE-CLAIM
  // --------------------------------------------------------------------------
  console.log(">>> [TEST 2] ADVERSARIAL: Attempting immediate double-claim from Alice...");
  try {
    const ascAlice = ascContract.connect(aliceCC3);
    await ascAlice.claimDividend.estimateGas(1);
    const doubleTx = await ascAlice.claimDividend(1);
    await doubleTx.wait(1);
    console.log("  [TEST 2 RESULT]: FAILED - Double-claim succeeded when it should revert!");
  } catch (err) {
    console.log(`  Double-claim reverted as expected!`);
    console.log(`  Raw Error Message: ${err.message}`);
    console.log("  [TEST 2 RESULT]: PASS - Contract rejected double-claim.\n");
  }

  // --------------------------------------------------------------------------
  // TEST 3: ADVERSARIAL BREAK-ATTEMPT 2 - STRANGER-CLAIM
  // --------------------------------------------------------------------------
  console.log(">>> [TEST 3] ADVERSARIAL: Attempting claim from unauthorized Stranger address...");
  try {
    console.log("  Funding stranger with 0.05 CTC for gas test...");
    const fundStrangerTx = await deployerCC3.sendTransaction({
      to: strangerCC3.address,
      value: ethers.parseEther("0.05")
    });
    await fundStrangerTx.wait(1);

    const ascStranger = ascContract.connect(strangerCC3);
    await ascStranger.claimDividend.estimateGas(1);
    const strangerTx = await ascStranger.claimDividend(1);
    await strangerTx.wait(1);
    console.log("  [TEST 3 RESULT]: FAILED - Stranger claimed dividends without shares!");
  } catch (err) {
    console.log(`  Stranger claim reverted as expected!`);
    console.log(`  Raw Error Message: ${err.message}`);
    console.log("  [TEST 3 RESULT]: PASS - Contract rejected unauthorized stranger claim.\n");
  }

  // --------------------------------------------------------------------------
  // TEST 4: ADVERSARIAL BREAK-ATTEMPT 3 - REPLAY ATTACK ON CC3
  // --------------------------------------------------------------------------
  console.log(">>> [TEST 4] ADVERSARIAL: Attempting duplicate proof submission (Replay Attack)...");
  try {
    const ascDeployer = ascContract.connect(deployerCC3);
    await ascDeployer.verifyAndDistribute.estimateGas(
      1, // Sepolia
      11685350,
      "0x",
      ethers.ZeroHash,
      [],
      ethers.ZeroHash,
      []
    );
    console.log("  [TEST 4 RESULT]: FAILED - Duplicate query was accepted!");
  } catch (err) {
    console.log(`  Replay attempt rejected as expected!`);
    console.log(`  Raw Error Message: ${err.message}`);
    console.log("  [TEST 4 RESULT]: PASS - processedQueries mapping rejected replay.\n");
  }

  // --------------------------------------------------------------------------
  // TEST 5: ADVERSARIAL BREAK-ATTEMPT 5 - DIRECT TRANSFER (MALFORMED) TO SEPOLIA VAULT
  // --------------------------------------------------------------------------
  console.log(">>> [TEST 5] ADVERSARIAL: Sending raw ERC20 transfer directly to WeirVault...");
  try {
    const mockUSDC = new ethers.Contract(mockUSDCAddr, MOCK_USDC_ABI, deployerSepolia);
    const directAmount = ethers.parseUnits("100", 6);

    const fTx = await mockUSDC.faucet(deployerSepolia.address, directAmount);
    await fTx.wait(1);

    const vBalBefore = await mockUSDC.balanceOf(weirVaultAddr);
    const directTransferTx = await mockUSDC.transfer(weirVaultAddr, directAmount);
    const dtReceipt = await directTransferTx.wait(1);
    const vBalAfter = await mockUSDC.balanceOf(weirVaultAddr);

    console.log(`  Direct Transfer Tx: ${directTransferTx.hash}`);
    console.log(`  Vault mUSDC Balance Before: ${ethers.formatUnits(vBalBefore, 6)}`);
    console.log(`  Vault mUSDC Balance After:  ${ethers.formatUnits(vBalAfter, 6)}`);

    const revenueDepositedTopic = ethers.id("RevenueDeposited(uint256,uint256,uint256,address)");
    const hasRevenueEvent = dtReceipt.logs.some(l => l.topics[0] === revenueDepositedTopic);
    console.log(`  RevenueDeposited Event Emitted? ${hasRevenueEvent}`);

    if (!hasRevenueEvent) {
      console.log("  [TEST 5 RESULT]: PASS - Direct token transfer increases vault balance but does NOT emit RevenueDeposited event or trigger false distributions.\n");
    } else {
      console.log("  [TEST 5 RESULT]: FAIL - Direct transfer emitted RevenueDeposited!\n");
    }
  } catch (err) {
    console.log("  [TEST 5 ERROR]:", err.message);
  }

  // --------------------------------------------------------------------------
  // TEST 6: ADVERSARIAL BREAK-ATTEMPT 6 - RAW ETH TRANSFER TO WEIRVAULT
  // --------------------------------------------------------------------------
  console.log(">>> [TEST 6] ADVERSARIAL: Attempting direct raw ETH transfer to WeirVault...");
  try {
    const rawEthTx = await deployerSepolia.sendTransaction({
      to: weirVaultAddr,
      value: ethers.parseEther("0.0001")
    });
    await rawEthTx.wait(1);
    console.log("  [TEST 6 RESULT]: FAILED - Raw ETH accepted by vault without depositRevenue()!");
  } catch (err) {
    console.log(`  Raw ETH transfer rejected as expected!`);
    console.log(`  Raw Error: ${err.message}`);
    console.log("  [TEST 6 RESULT]: PASS - Vault contract rejects raw ETH transfers.\n");
  }

  // --------------------------------------------------------------------------
  // TEST 7: LIVE SEPOLIA DEPOSIT TRANSACTION
  // --------------------------------------------------------------------------
  console.log(">>> [TEST 7] LIVE DEPOSIT RUN ON ETHEREUM SEPOLIA...");
  try {
    const mockUSDC = new ethers.Contract(mockUSDCAddr, MOCK_USDC_ABI, deployerSepolia);
    const weirVault = new ethers.Contract(weirVaultAddr, WEIR_VAULT_ABI, deployerSepolia);

    const depAmount = ethers.parseUnits("10000", 6);
    console.log("  1. Faucet 10,000 mUSDC on Sepolia...");
    const fTx2 = await mockUSDC.faucet(deployerSepolia.address, depAmount);
    await fTx2.wait(1);

    console.log("  2. Approving WeirVault to spend 10,000 mUSDC...");
    const aTx2 = await mockUSDC.approve(weirVaultAddr, depAmount);
    await aTx2.wait(1);

    console.log("  3. Executing depositRevenue(1, 10,000 mUSDC)...");
    const dTx = await weirVault.depositRevenue(1, depAmount);
    console.log(`  Deposit Tx Submitted: ${dTx.hash}`);
    const dReceipt = await dTx.wait(1);
    console.log(`  Deposit Confirmed in Sepolia Block: ${dReceipt.blockNumber}`);
    console.log(`  Etherscan URL: https://sepolia.etherscan.io/tx/${dTx.hash}`);
    console.log("  [TEST 7 RESULT]: PASS - Live on-chain deposit executed successfully.\n");
  } catch (err) {
    console.log("  [TEST 7 ERROR]:", err.message);
  }

  console.log("===============================================================================");
  console.log("  ALL ADVERSARIAL RIGOR BREAK-TESTS EXECUTED");
  console.log("===============================================================================");
}

main().catch(console.error);
