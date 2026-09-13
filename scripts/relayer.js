/**
 * WEIR Protocol — Attestcoin Relayer Worker
 * 
 * Bridges Ethereum Sepolia gross commercial revenue events to Creditcoin CC3 Testnet.
 * Uses @gluwa/usc-sdk to query the live Proof Builder API and calls WeirDistributionASC.
 */

const { ethers } = require("ethers");
const usc = require("@gluwa/usc-sdk");
require("dotenv").config();

const SEPOLIA_CHAIN_KEY = 1;
const PROVER_URL = process.env.PROVER_URL || "https://prover.cc3-testnet.creditcoin.network";
const SEPOLIA_RPC = process.env.SEPOLIA_RPC || "https://ethereum-sepolia-rpc.publicnode.com";
const CC3_RPC = process.env.CC3_RPC || "https://rpc.cc3-testnet.creditcoin.network";

// ABI snippet for WeirDistributionASC
const ASC_ABI = [
  "function verifyAndDistribute(uint64 chainKey, uint64 blockHeight, bytes calldata encodedTransaction, bytes32 merkleRoot, tuple(bytes32 hash, bool isLeft)[] calldata siblings, bytes32 lowerEndpointDigest, bytes32[] calldata continuityRoots) external returns (bool)",
  "function getClaimableDividend(uint256 assetId, address investor) external view returns (uint256)",
  "function assetStates(uint256 assetId) external view returns (string name, uint256 totalShares, uint256 expectedPeriodAmount, uint256 cumulativeDividendPerShare, uint256 totalRevenueProcessed, uint256 currentPeriod, bool active)",
  "event DividendsCalculated(uint256 indexed assetId, uint256 grossAmount, uint256 period, uint256 newCumulativeIndex, bytes32 txKey)",
  "event RevenueShortfall(uint256 indexed assetId, uint256 expectedAmount, uint256 receivedAmount, uint256 period)"
];

class WeirRelayer {
  constructor(ascAddress, privateKey) {
    this.ascAddress = ascAddress;
    this.sepoliaProvider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    this.cc3Provider = new ethers.JsonRpcProvider(CC3_RPC);
    this.cc3Signer = privateKey ? new ethers.Wallet(privateKey, this.cc3Provider) : null;
    this.proofBuilder = new usc.proofProvider.service.ProofBuilder(SEPOLIA_CHAIN_KEY, PROVER_URL);
  }

  /**
   * Processes a Sepolia revenue transaction and submits cryptographic proof to Creditcoin
   */
  async relayTransaction(txHash) {
    console.log(`\n[WEIR RELAYER] Processing Sepolia transaction: ${txHash}`);

    // 1. Fetch Sepolia Receipt
    const t0 = Date.now();
    const receipt = await this.sepoliaProvider.getTransactionReceipt(txHash);
    if (!receipt) {
      throw new Error(`Transaction receipt not found on Sepolia: ${txHash}`);
    }
    if (receipt.status !== 1) {
      throw new Error(`Sepolia transaction reverted: status = ${receipt.status}`);
    }
    console.log(`  -> Sepolia Block: ${receipt.blockNumber} (confirmed in ${Date.now() - t0}ms)`);

    // 2. Wait for block attestation on Creditcoin
    console.log(`  -> Waiting for Attestcoin consensus on block ${receipt.blockNumber}...`);
    const t1 = Date.now();
    await this.proofBuilder.waitUntilHeightAttested(SEPOLIA_CHAIN_KEY, receipt.blockNumber);
    console.log(`  -> Block ${receipt.blockNumber} attested on Creditcoin! (${Date.now() - t1}ms)`);

    // 3. Fetch Merkle and Continuity Proofs
    console.log(`  -> Fetching Merkle inclusion and continuity proofs from Prover API...`);
    const proofRes = await this.proofBuilder.getProof(txHash);
    if (!proofRes.success) {
      throw new Error(`ProofBuilder API error: ${proofRes.error}`);
    }

    const proofData = proofRes.data;
    console.log(`  -> Proof acquired! Root: ${proofData.merkleProof.root}, Siblings: ${proofData.merkleProof.siblings.length}`);

    // 4. Submit to WeirDistributionASC on Creditcoin
    if (!this.cc3Signer) {
      console.log(`  -> Read-only mode: skipping on-chain execution (no CC3 signer configured).`);
      return { success: true, proofData };
    }

    console.log(`  -> Submitting proof to WeirDistributionASC at ${this.ascAddress}...`);
    const ascContract = new ethers.Contract(this.ascAddress, ASC_ABI, this.cc3Signer);

    const tx = await ascContract.verifyAndDistribute(
      proofData.chainKey,
      proofData.headerNumber,
      proofData.txBytes,
      proofData.merkleProof.root,
      proofData.merkleProof.siblings,
      proofData.continuityProof.lowerEndpointDigest,
      proofData.continuityProof.roots,
      { gasLimit: 500000 }
    );

    console.log(`  -> CC3 Transaction Submitted: ${tx.hash}`);
    const cc3Receipt = await tx.wait();
    console.log(`  -> CC3 Transaction Confirmed in block ${cc3Receipt.blockNumber}! Gas used: ${cc3Receipt.gasUsed}`);

    return {
      success: true,
      sepoliaBlock: receipt.blockNumber,
      cc3TxHash: tx.hash,
      cc3Block: cc3Receipt.blockNumber,
      proofData
    };
  }
}

/**
 * Continuous autonomous daemon loop
 */
async function startDaemon() {
  const fs = require("fs");
  const path = require("path");

  console.log("===============================================================================");
  console.log("  WEIR ATTESTCOIN CONTINUOUS RELAYER DAEMON");
  console.log("  Mode: Autonomous Background Worker (Docker / Railway / Cloud)");
  console.log("===============================================================================\n");

  let weirVaultAddr = process.env.WEIR_VAULT_ADDRESS;
  let weirASCAddr = process.env.WEIR_ASC_ADDRESS;

  try {
    const sepoliaDep = JSON.parse(fs.readFileSync(path.join(__dirname, "../deployments/sepolia.json"), "utf8"));
    const cc3Dep = JSON.parse(fs.readFileSync(path.join(__dirname, "../deployments/creditcoinTestnet.json"), "utf8"));
    weirVaultAddr = weirVaultAddr || sepoliaDep.contracts.WeirVault;
    weirASCAddr = weirASCAddr || cc3Dep.contracts.WeirDistributionASC;
  } catch (err) {
    console.log("  [WARN] Deployments file not read, using env fallback:", err.message);
  }

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("  [FATAL] PRIVATE_KEY environment variable is required to submit CC3 proofs!");
    process.exit(1);
  }

  console.log(`  Vault Address (Sepolia): ${weirVaultAddr}`);
  console.log(`  ASC Address (CC3):       ${weirASCAddr}`);
  console.log(`  Sepolia RPC:             ${SEPOLIA_RPC}`);
  console.log(`  CC3 RPC:                 ${CC3_RPC}`);
  console.log(`  Proof Builder URL:       ${PROVER_URL}\n`);

  const relayer = new WeirRelayer(weirASCAddr, privateKey);
  const sepoliaProvider = new ethers.JsonRpcProvider(SEPOLIA_RPC);

  const VAULT_ABI = [
    "event RevenueDeposited(uint256 indexed assetId, uint256 grossAmount, uint256 period, address payor)"
  ];
  const vault = new ethers.Contract(weirVaultAddr, VAULT_ABI, sepoliaProvider);

  let currentBlock = await sepoliaProvider.getBlockNumber();
  let lastScannedBlock = currentBlock - 10; // scan past 10 blocks on boot
  console.log(`[DAEMON] Initialized at Sepolia block #${currentBlock}. Beginning continuous polling...\n`);

  const processedTxs = new Set();

  const pollIntervalMs = 12000; // 12-second Sepolia block time
  let heartbeatCounter = 0;

  setInterval(async () => {
    try {
      const latest = await sepoliaProvider.getBlockNumber();
      if (latest > lastScannedBlock) {
        const fromBlock = lastScannedBlock + 1;
        const toBlock = latest;

        const filter = vault.filters.RevenueDeposited();
        const events = await vault.queryFilter(filter, fromBlock, toBlock);

        if (events.length > 0) {
          console.log(`\n[DAEMON] Detected ${events.length} new RevenueDeposited event(s) in blocks ${fromBlock}..${toBlock}!`);
          for (const ev of events) {
            const txHash = ev.transactionHash;
            if (!processedTxs.has(txHash)) {
              processedTxs.add(txHash);
              console.log(`[DAEMON] Relaying transaction: ${txHash}...`);
              try {
                const res = await relayer.relayTransaction(txHash);
                console.log(`[DAEMON] Successfully settled on CC3: ${res.cc3TxHash}\n`);
              } catch (relayErr) {
                console.error(`[DAEMON ERROR] Failed to relay ${txHash}:`, relayErr.message);
              }
            }
          }
        }
        lastScannedBlock = toBlock;
      }

      heartbeatCounter++;
      if (heartbeatCounter % 5 === 0) {
        console.log(`[HEARTBEAT] Relayer active | Sepolia block: #${lastScannedBlock} | CC3: ${weirASCAddr} | Monitored`);
      }
    } catch (pollErr) {
      console.error("[DAEMON POLL ERROR]", pollErr.message);
    }
  }, pollIntervalMs);
}

if (require.main === module) {
  startDaemon().catch((err) => {
    console.error("Fatal daemon error:", err);
    process.exit(1);
  });
}

module.exports = { WeirRelayer, startDaemon };
