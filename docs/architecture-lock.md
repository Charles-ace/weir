# ARCHITECTURE SPECIFICATION (LOCKED) — `WEIR`

**Project Name:** `WEIR` (/wɪər/ — Hydraulic flow-rate divider)  
**Track:** Track 2 — Real-World Assets (RWA) (Track ID: 4518)  
**Status:** LOCKED & APPROVED FOR BUILD  
**Target Chain 1 (Source):** Ethereum Sepolia (chainKey: 1)  
**Target Chain 2 (Execution):** Creditcoin CC3 Testnet (Chain ID: 102031)  
**Interoperability Primitive:** Attestcoin Protocol (`0x0FD2` Block Prover Precompile)  

---

## 1. WHAT IT IS

`WEIR` is an unskimmable cross-chain cash-flow and dividend settlement pipeline for tokenized Real-World Assets and digital IP. Commercial lessees, utility off-takers, or NFT marketplaces deposit revenue directly into an audited Ethereum vault in USDC. Attestcoin cryptographically proves the deposit on Creditcoin within ~15 seconds, and Creditcoin's smart contract executes an $O(1)$ cumulative dividend index update. Fractional investors on Creditcoin claim their mathematically guaranteed pro-rata payouts without relying on an off-chain asset manager to report income or manually disburse funds.

---

## 2. CORE USER FLOWS

### Flow 1: Asset Onboarding & Cap-Table Setup (One-Time)
1. Asset sponsor deploys/registers an asset on `WeirVault` (Ethereum Sepolia).
2. The asset is registered in `WeirDistributionASC` on Creditcoin with total fractional shares (e.g. 10,000 shares).
3. Investors (Alice 50%, Bob 30%, Charlie 20%) hold fractional units registered on Creditcoin.

### Flow 2: Commercial Revenue Inflow (Ethereum)
1. The commercial payor transfers gross revenue (e.g. $10,000 MockUSDC) into `WeirVault` on Sepolia via `depositRevenue(assetId, amount)`.
2. `WeirVault` emits `RevenueDeposited(uint256 indexed assetId, uint256 grossAmount, uint256 period, address indexed payor)`.

### Flow 3: Attestcoin Relaying & Verification (Cross-Chain)
1. Off-chain worker daemon detects `RevenueDeposited` on Sepolia.
2. Worker queries Attestcoin Proof Builder API (`@gluwa/usc-sdk`) to obtain Merkle inclusion proof and continuity proof.
3. Worker submits the proof payload to `WeirDistributionASC` on Creditcoin.
4. `WeirDistributionASC` calls native precompile `0x0FD2` (`verifyAndEmit`).
5. Precompile verifies cryptographic inclusion; contract decodes receipt logs via `EvmV1Decoder` and asserts `receiptStatus == 1`.
6. Replay protection checks `processedQueries[txKey]`.

### Flow 4: $O(1)$ Dividend Math & Instant Investor Claim (Creditcoin)
1. The contract updates the asset's global cumulative dividend per share:
   $$\text{cumulativeDividendPerShare} += \frac{\text{grossAmount} \times 10^{18}}{\text{totalShares}}$$
2. Investor Alice (50%) visits the dashboard, sees her claimable balance increase by $5,000 USDC.
3. Alice clicks `claimDividend(assetId)`: Creditcoin contract transfers her owed dividend and updates `userLastIndex`.

---

## 3. REAL VS. MOCKED MATRIX

| Component | Target Environment | Status | Description |
| :--- | :--- | :--- | :--- |
| `WeirVault.sol` | Ethereum Sepolia | **REAL** | Receives revenue deposits, logs events |
| `MockUSDC.sol` | Ethereum Sepolia | **MOCKED** | Test ERC-20 token simulating institutional USDC with public faucet |
| Attestcoin Relayer | Node.js Worker | **REAL** | `@gluwa/usc-sdk` proof fetcher and transaction submitter |
| Block Prover Precompile | Creditcoin CC3 Testnet | **REAL** | Native precompile at `0x0FD2` |
| `WeirDistributionASC.sol` | Creditcoin CC3 Testnet | **REAL** | Attestcoin Smart Contract managing verification & $O(1)$ dividend splits |
| `EvmV1Decoder.sol` | Creditcoin CC3 Testnet | **REAL** | Official Gluwa receipt log decoder |
| Demo Frontend | Next.js / Tailwind | **REAL** | Interactive multi-party dashboard with live status updates |

---

## 4. EXPLICITLY IN SCOPE
- Full end-to-end flow from Sepolia deposit to Creditcoin dividend claim.
- $O(1)$ pull-pattern dividend index implementation.
- 3-investor live cap-table demo (Alice 50%, Bob 30%, Charlie 20%).
- Real-time attestation monitoring in frontend (~15s confirmation cycle).
- Comprehensive test suite covering underpayments, replay protection, and unauthorized calls.

## 5. EXPLICITLY OUT OF SCOPE
- Cross-chain writability payouts back to Ethereum (writability is unreleased on testnet).
- Secondary fractional share AMM trading (deferred to post-hackathon).
- Fiat payment rails / banking integrations.
