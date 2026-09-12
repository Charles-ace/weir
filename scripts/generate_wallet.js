const { ethers } = require("ethers");
const fs = require("fs");

const wallet = ethers.Wallet.createRandom();
console.log("ADDRESS:" + wallet.address);
console.log("PRIVATE_KEY:" + wallet.privateKey);

const envContent = `# WEIR Hackathon Deployment Configuration
PRIVATE_KEY=${wallet.privateKey}
SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
CC3_RPC=https://rpc.cc3-testnet.creditcoin.network
PROVER_URL=https://prover.cc3-testnet.creditcoin.network
`;

fs.writeFileSync(".env", envContent, "utf8");
console.log("SAVED_TO_ENV");
