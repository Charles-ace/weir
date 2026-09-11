/**
 * WEIR Protocol — Deployment Script
 * 
 * Deploys:
 * 1. MockUSDC.sol & WeirVault.sol to Ethereum Sepolia
 * 2. WeirDistributionASC.sol to Creditcoin CC3 Testnet
 * 3. Initializes demo asset and 3-investor cap table
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const EVM_V1_DECODER_CC3 = "0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f";

async function main() {
  const networkName = hre.network.name;
  console.log(`\n====================================================`);
  console.log(`  WEIR DEPLOYMENT PIPELINE (${networkName.toUpperCase()})`);
  console.log(`====================================================\n`);

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${hre.ethers.formatEther(balance)} ETH/CTC\n`);

  const deploymentData = {
    network: networkName,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {}
  };

  if (networkName === "sepolia" || networkName === "hardhat") {
    console.log("[1/2] Deploying Sepolia Inflow Contracts...");

    // Deploy MockUSDC
    const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
    const mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();
    const mockUSDCAddress = await mockUSDC.getAddress();
    console.log(`  -> MockUSDC deployed at: ${mockUSDCAddress}`);
    deploymentData.contracts.MockUSDC = mockUSDCAddress;

    // Deploy WeirVault
    const WeirVault = await hre.ethers.getContractFactory("WeirVault");
    const weirVault = await WeirVault.deploy();
    await weirVault.waitForDeployment();
    const weirVaultAddress = await weirVault.getAddress();
    console.log(`  -> WeirVault deployed at: ${weirVaultAddress}`);
    deploymentData.contracts.WeirVault = weirVaultAddress;

    // Register Asset #1: Sahara Solar Array #4
    console.log("  -> Registering Asset #1 (Sahara Solar Array #4) on WeirVault...");
    const txRegister = await weirVault.registerAsset(
      1,
      "Sahara Solar Array #4",
      deployer.address,
      mockUSDCAddress,
      hre.ethers.parseUnits("10000", 6) // 10,000 mUSDC target
    );
    await txRegister.wait();
    console.log("  -> Asset #1 registered successfully on Sepolia!");
  }

  if (networkName === "creditcoinTestnet" || networkName === "hardhat") {
    console.log("\n[2/2] Deploying Creditcoin CC3 Settlement Contracts...");

    // In local hardhat testnet, deploy mock decoder if decoder code not present
    let decoderAddress = EVM_V1_DECODER_CC3;
    if (networkName === "hardhat") {
      const MockDecoder = await hre.ethers.getContractFactory("MockEvmV1Decoder");
      const mockDecoder = await MockDecoder.deploy();
      await mockDecoder.waitForDeployment();
      decoderAddress = await mockDecoder.getAddress();
    }

    // Deploy WeirDistributionASC
    const WeirDistributionASC = await hre.ethers.getContractFactory("WeirDistributionASC");
    const weirASC = await WeirDistributionASC.deploy(decoderAddress);
    await weirASC.waitForDeployment();
    const ascAddress = await weirASC.getAddress();
    console.log(`  -> WeirDistributionASC deployed at: ${ascAddress}`);
    deploymentData.contracts.WeirDistributionASC = ascAddress;

    // Register Asset #1 with 3-investor cap table
    // Alice (50%), Bob (30%), Charlie (20%)
    const alice = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // standard Hardhat account 1 or designated
    const bob   = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"; // account 2
    const charlie = "0x90F79bf6EB2c4f870365E785982E1f101E93b906"; // account 3

    console.log("  -> Initializing 3-investor cap table for Asset #1 (Alice 50%, Bob 30%, Charlie 20%)...");
    const txCapTable = await weirASC.registerAssetWithCapTable(
      1,
      "Sahara Solar Array #4",
      10000n, // 10,000 total shares
      hre.ethers.parseUnits("10000", 6), // $10,000 covenant
      alice,
      bob,
      charlie
    );
    await txCapTable.wait();
    console.log("  -> Cap table initialized successfully on Creditcoin CC3!");
  }

  // Save deployment artifact
  const outDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outFile = path.join(outDir, `${networkName}.json`);
  fs.writeFileSync(outFile, JSON.stringify(deploymentData, null, 2));
  console.log(`\nDeployment summary saved to: ${outFile}`);
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exit(1);
});
