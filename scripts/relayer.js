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

module.exports = { WeirRelayer };
