# ARCHITECTURE SPECIFICATION (LOCKED & CONFIRMED) — `WEIR`

**Project Name:** `WEIR` (/wɪər/ — Hydraulic flow-rate divider)  
**Track:** Track 2 — Real-World Assets (RWA) (DoraHacks Track ID: 4518)  
**Status:** LOCKED & CONFIRMED BY ACE & CLAUDE — AUTHORIZED FOR SECTION 5 BUILD  
**Target Chain 1 (Source):** Ethereum Sepolia (chainKey: 1)  
**Target Chain 2 (Execution):** Creditcoin CC3 Testnet (Chain ID: 102031)  
**Interoperability Primitive:** Attestcoin Protocol (`0x0FD2` Block Prover Precompile)  
**UI Reference:** Tier A Rights Confirmed — `dusk.network` (Direct structural mapping)  

---

## 1. WHAT IT IS

`WEIR` is an unskimmable cross-chain cash-flow and dividend settlement pipeline for tokenized Real-World Assets and digital IP. Commercial lessees, utility off-takers, or digital asset platforms deposit gross revenue directly into an audited Ethereum vault in USDC. Attestcoin cryptographically proves transaction inclusion on Creditcoin within ~15 seconds via the native `0x0FD2` Block Prover Precompile. Creditcoin's smart contract executes an $O(1)$ cumulative dividend index update. Fractional asset unit holders on Creditcoin withdraw their mathematically guaranteed pro-rata dividend payouts on demand, eliminating sponsor revenue-skimming, fraudulent expense deductions, and distribution delays.

---

## 2. LOCKED SCOPE & USER FLOWS

### 2.1 The 3-Investor Cap Table (Fixed Scope)
- Total Asset Shares: 10,000 units
- **Alice:** 5,000 units (50.0%)
- **Bob:** 3,000 units (30.0%)
- **Charlie:** 2,000 units (20.0%)
- *Decision:* Manual pull-claim only (`claimDividend()`). Auto-compound / reinvest is explicitly out of scope.

### 2.2 End-to-End Execution Flow
1. **Gross Deposit (Ethereum Sepolia):**  
   The commercial payor transfers gross revenue (e.g. $10,000 `MockUSDC`) into `WeirVault.sol` on Sepolia via `depositRevenue(uint256 assetId, uint256 amount)`.  
   `WeirVault` emits:
   `RevenueDeposited(uint256 indexed assetId, uint256 grossAmount, uint256 period, address indexed payor)`
2. **Attestcoin Proof Construction (Off-Chain Relayer):**  
   The off-chain relayer (`relayer.js` using `@gluwa/usc-sdk`) detects the `RevenueDeposited` event on Sepolia. Once the block is attested on CC3 Testnet, it queries the Proof Builder API (`https://prover.cc3-testnet.creditcoin.network`) to obtain Merkle inclusion and continuity proofs.
3. **Precompile Verification & Replay Protection (Creditcoin CC3):**  
   The relayer submits the proof bundle to `WeirDistributionASC.sol` on Creditcoin.  
   The contract calls the native Block Prover Precompile at `0x0FD2` (`verifyAndEmit`).  
   Replay protection enforces: `require(!processedQueries[txKey], "Query already processed")`.  
   Receipt status is validated: `require(receipt.receiptStatus == 1, "Transaction failed on source")`.
4. **$O(1)$ Dividend Settlement & Shortfall Handling:**  
   If the gross deposit is less than the scheduled covenant target, the contract emits a `RevenueShortfall(uint256 assetId, uint256 expected, uint256 received)`.  
   The contract increments the asset's global cumulative dividend per share based on the actual amount received:
   $$\text{cumulativeDividendPerShare} += \frac{\text{grossAmount} \times 10^{18}}{\text{totalShares}}$$
5. **Investor Withdrawal:**  
   Alice, Bob, or Charlie call `claimDividend(uint256 assetId)`. The contract calculates:
   $$\text{owed} = \text{userShares} \times (\text{cumulativeDividendPerShare} - \text{userLastIndex}) / 10^{18}$$
   Transfers dividend tokens and updates `userLastIndex`.

---

## 3. REAL VS. MOCKED MATRIX (LOCKED)

| Component | Target Environment | Status | Locked Technical Implementation |
| :--- | :--- | :--- | :--- |
| **`WeirVault.sol`** | Ethereum Sepolia | **REAL** | Solidity 0.8.23 contract deployed on Sepolia; receives deposits, enforces asset registration, emits `RevenueDeposited`. |
| **`MockUSDC.sol`** | Ethereum Sepolia | **MOCKED** | Standard ERC-20 deployed on Sepolia with public faucet. **Sole mocked component in the entire build.** |
| **Relayer Daemon** | Node.js / TypeScript | **REAL** | `@gluwa/usc-sdk` integration querying live Proof Builder API and executing CC3 transactions. |
| **Block Prover Precompile** | Creditcoin CC3 Testnet | **REAL** | Native precompile at `0x0000000000000000000000000000000000000FD2`. |
| **`EvmV1Decoder.sol`** | Creditcoin CC3 Testnet | **REAL** | Official Gluwa receipt decoder at `0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f`. |
| **`WeirDistributionASC.sol`**| Creditcoin CC3 Testnet | **REAL** | Solidity 0.8.23 ASC contract deployed on CC3 Testnet; executes $O(1)$ math, verifies proofs, handles claims. |
| **Frontend UI** | Next.js / Tailwind | **REAL** | Structured on Tier A reference (`dusk.network`); live contract state reading, Sepolia deposit trigger, real-time attestation pill, 3 investor claim cards. |

---

## 4. EXPLICIT BOUNDARIES

### In Scope
- Sepolia contracts deployment (`MockUSDC`, `WeirVault`).
- CC3 Testnet contract deployment (`WeirDistributionASC`).
- Live Attestcoin proof generation and precompile verification.
- $O(1)$ pull-claim dividend index.
- Shortfall event emission on underpayment.
- 3-investor live UI dashboard mapped to `dusk.network` structural grammar.
- `REAL_VS_MOCKED.md` honesty table.

### Out of Scope
- Auto-compound / reinvestment logic.
- First-loss performance bond auto-drawdown (underpayment stops at event logging + actual pro-rata split).
- Cross-chain writability / outbound messaging back to Ethereum.
- Secondary fractional share trading / AMM pool.
- Multi-token support beyond `MockUSDC`.
