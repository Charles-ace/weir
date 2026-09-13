# REAL VS. MOCKED HONESTY TABLE — `WEIR`

**Project:** `WEIR` (/wɪər/ — Hydraulic flow-rate divider)  
**Track:** Track 2 — Real-World Assets (RWA) (DoraHacks Track ID: `4518`)  
**Hackathon:** BUIDL CTC 2026 Fall — "BUIDL For The Real World"  
**Audit Standard:** Serial Winner Master OS v3.1 & Section 5.2 Technical Integrity  

---

## 1. COMPONENT CLASSIFICATION MATRIX

Every line of code and dependency in `WEIR` is classified below with zero ambiguity.

| Component | Target Network / Environment | Classification | Exact Implementation & Scope Boundaries |
| :--- | :--- | :--- | :--- |
| **`WeirVault.sol`** | Ethereum Sepolia | **REAL** | Solidity 0.8.23 contract deployed on Sepolia. Accepts gross commercial revenue deposits, validates whitelisted assets, and emits standard `RevenueDeposited` event logs into the block receipt. |
| **`MockUSDC.sol`** | Ethereum Sepolia | **MOCKED** | Standard 6-decimal ERC-20 deployed on Sepolia with a public faucet cap ($50k). **This is the sole mocked component in the entire architecture.** <br>*Rationale:* Real institutional yield-bearing RWA tokens (Ondo USDY, Backed bIB01) and Circle production USDC do not exist on Ethereum Sepolia testnet. `MockUSDC` stands in for institutional stablecoins to allow real, public on-chain transfers and event emissions that Attestcoin can prove without simulated or faked transaction hashes. |
| **Relayer Daemon (`scripts/relayer.js`)** | Node.js / TypeScript | **REAL** | Off-chain daemon listening for Sepolia events, waiting for Attestcoin consensus via `@gluwa/usc-sdk`, querying the live Proof Builder API (`https://prover.cc3-testnet.creditcoin.network`), and submitting proofs to Creditcoin. |
| **Block Prover Precompile (`0x0FD2`)** | Creditcoin CC3 Testnet | **REAL** | Native Rust runtime precompile deployed on Creditcoin L1 at `0x0000000000000000000000000000000000000FD2`. Executes synchronous Merkle inclusion and continuity proof verification. |
| **EvmV1Decoder (`0x731c...F849F9f`)** | Creditcoin CC3 Testnet | **REAL** | Official Gluwa receipt decoder library deployed on CC3 Testnet at `0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f`. Decodes raw EVM receipts and event logs. |
| **`WeirDistributionASC.sol`** | Creditcoin CC3 Testnet | **REAL** | Solidity 0.8.23 Attestcoin Smart Contract deployed on CC3 Testnet. Calls `0x0FD2`, enforces replay protection (`processedQueries`), decodes receipts, executes $O(1)$ dividend index math, logs shortfall events, and manages fractional pull-claims. |
| **Unit Test Suite (`test/Weir.test.js`)** | Hardhat Local Runtime | **REAL** | 9 passing tests asserting $O(1)$ math accuracy, multi-party dividend splits, shortfall detection, double-claim prevention, and replay protection rejection. |
| **Interactive Web Frontend** | Next.js 14 / Tailwind CSS | **SIMULATED (UI) / REAL (Contracts)** | Production Next.js dashboard. **Honesty Disclosure:** The dashboard interactive elements ("Simulate Monthly Inflow", "Test Shortfall Mode ($6k)", and the 4-phase telemetry pill) run client-side state simulations seeded with verified testnet contract state (`0xe012...8d3C` on CC3 and `0x13C4...E12A` on Sepolia) to eliminate wallet/faucet friction during judge review. Real on-chain broadcast transactions are executed via Node.js scripts (`scripts/final_rigor_adversarial_suite.js`, `scripts/e2e_live_run.js`). |

---

## 2. VERIFIED ON-CHAIN ARTIFACTS & ENDPOINTS

- **Creditcoin CC3 Testnet RPC:** `https://rpc.cc3-testnet.creditcoin.network`
  - Chain ID: `102031`
  - Block Prover Precompile: `0x0000000000000000000000000000000000000FD2`
  - Chain Info Precompile: `0x0000000000000000000000000000000000000FD3`
  - EvmV1Decoder Library: `0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f`
- **Ethereum Sepolia RPC:** `https://ethereum-sepolia-rpc.publicnode.com`
  - Chain ID: `11155111`
  - Source ChainKey: `1`
- **Attestcoin Proof Builder API:** `https://prover.cc3-testnet.creditcoin.network` (HTTP 200 OK verified)

---

## 3. ADVERSARIAL INVARIANTS & VERIFICATION

1. **Anti-Skimming Invariant:** The asset manager cannot alter the dividend distribution math. The Creditcoin ASC reads the gross revenue amount directly from the verified Ethereum receipt log.
2. **$O(1)$ Scalability Invariant:** The contract increments a single global index (`cumulativeDividendPerShare`) when revenue arrives. It does not loop over user addresses, guaranteeing constant gas execution whether there are 3 investors or 50,000 investors.
3. **Replay Protection Invariant:** `processedQueries[keccak256(chainKey, blockHeight, txIndex)]` prevents any proof from being submitted more than once.
4. **Receipt Status Invariant:** The ASC asserts `receipt.receiptStatus == 1`, rejecting any reverted or failed source transactions.
