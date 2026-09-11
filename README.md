# `WEIR` — Unskimmable RWA Cash-Flow & Dividend Settlement

> **`WEIR` turns messy off-chain commercial revenue into an unskimmable dividend pipe—cryptographically proving Ethereum revenue inflows via Attestcoin to mathematically settle fractional investor payouts on Creditcoin.**

[![Creditcoin CC3 Testnet](https://img.shields.io/badge/Creditcoin-CC3_Testnet_(102031)-06B6D4?style=flat-square)](https://creditcoin.org)
[![Attestcoin Protocol](https://img.shields.io/badge/Attestcoin_Protocol-Precompile_0x0FD2-10B981?style=flat-square)](https://docs.attestcoin.org)
[![Ethereum Sepolia](https://img.shields.io/badge/Ethereum-Sepolia_(11155111)-627EEA?style=flat-square)](https://sepolia.etherscan.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](LICENSE)

---

## 1. Hackathon Submission Information
- **Hackathon:** BUIDL CTC 2026 Fall — "BUIDL For The Real World"
- **Platform:** DoraHacks (`https://dorahacks.io/hackathon/buidl-ctc-2026-fall/detail`)
- **Track:** **Track 2 — Real-World Assets (RWA)** *(Track ID: `4518`)*
- **Theme:** Attestcoin Protocol (Universal Smart Contracts / USC)

---

## 2. The Problem: The RWA Middleman Trust Gap

In real-world asset tokenization (commercial solar installations, delivery fleets, agricultural equipment leasing, real estate), **business operations generate cash in the real world, but dividend distribution to on-chain investors is fundamentally broken.**

Today, the asset sponsor collects commercial revenue into an off-chain corporate bank account. Every month, fractional investors receive an opaque email report:
> *"We collected $50,000 in lease revenue this month, but maintenance and administrative fees cost $35,000, so we are only distributing $15,000 to investors."*

Investors have **no way to verify** if gross revenue was actually $50,000 or $80,000, or whether maintenance deductions were real. Investors then wait weeks for manual bank wires or centralized multi-sigs to bridge money. Asset managers frequently skim profits, delay payouts, or alter distribution math behind closed doors.

---

## 3. The Solution: How `WEIR` Works

`WEIR` (/wɪər/ — named after the civil engineering barrier that mathematically measures and divides hydraulic flow without human intervention) removes manager discretion and opaque accounting from corporate dividend distributions:

```
 [ Ethereum Sepolia ]
   │
   ├─► Commercial Lessee / Marketplace deposits gross USDC into:
   │   ┌────────────────────────────────────────────────────────┐
   │   │  WeirVault.sol (Ethereum Revenue Vault)                │
   │   │  - Validates whitelisted asset & ERC-20 token          │
   │   │  - Emits: RevenueDeposited(assetId, grossAmount, era)  │
   │   └────────────────────────────────────────────────────────┘
   │
 [ Attestcoin Relay Layer ]
   │
   ├─► Attestor Network finalizes Ethereum block on Creditcoin (~15s)
   ├─► Weir Relayer Worker (Node.js + @gluwa/usc-sdk):
   │   - Detects RevenueDeposited event
   │   - Calls Proof Builder API -> fetches Merkle + Continuity proofs
   │   - Submits proof bundle to Creditcoin
   │
 [ Creditcoin CC3 Testnet ]
   │
   └─► ┌────────────────────────────────────────────────────────┐
       │  WeirDistributionASC.sol (Attestcoin Smart Contract)   │
       │  1. Calls Precompile 0x0FD2 (verifyAndEmit)            │
       │  2. Decodes receipt bytes via EvmV1Decoder             │
       │  3. Replay Protection: processedQueries[txKey] = true  │
       │  4. Asserts receipt.receiptStatus == 1                 │
       │  5. Increments O(1) Cumulative Dividend Index:         │
       │     ΔIndex = (grossAmount * 1e18) / totalShares        │
       └────────────────────────────────────────────────────────┘
            │
            ├─► Investor Alice (50%) -> calls claimDividend() -> receives 50%
            ├─► Investor Bob   (30%) -> calls claimDividend() -> receives 30%
            └─► Investor Charlie (20%) -> calls claimDividend() -> receives 20%
```

### The 4-Step Pipeline:
1. **Gross Inflow on Ethereum:** The commercial lessee pays their monthly lease invoice in USDC directly into `WeirVault.sol` on Ethereum Sepolia. The contract emits a public receipt: `RevenueDeposited(assetId, grossAmount, period, payor)`.
2. **Attestcoin Cryptographic Proof:** Within ~15 seconds, Attestcoin attestor nodes finalize the Ethereum block on Creditcoin. The off-chain relayer fetches Merkle inclusion and continuity proofs via `@gluwa/usc-sdk` and submits them to Creditcoin.
3. **Creditcoin Precompile Verification:** `WeirDistributionASC.sol` calls native Block Prover Precompile `0x0FD2`. The precompile validates inclusion synchronously; `EvmV1Decoder` unpacks the receipt log and verifies `status == 1`.
4. **$O(1)$ Mathematical Settlement:** Creditcoin increments a single global index (`cumulativeDividendPerShare`). Investors withdraw their exact pro-rata share on demand via gas-negligible pull claims ($0.001 gas).

---

## 4. Why Creditcoin & Attestcoin are Strictly Load-Bearing

- **Why not just build it on Ethereum?**  
  Executing multi-party cap table accounting, fractional share registries, and monthly micro-dividend claims on Ethereum L1 costs $10–$30 in gas per claim. On Creditcoin, it costs a fraction of a cent.
- **Why not just build it on Creditcoin without Ethereum?**  
  Because corporate lessees and institutional clients don't maintain treasury accounts on Creditcoin—they pay in USDC on Ethereum.
- **Why is Attestcoin essential?**  
  Attestcoin provides the trustless cryptographic bridge: corporate capital stays on Ethereum, while granular investor distribution settles on Creditcoin. Without Attestcoin, the system would require a centralized operator to manually report Ethereum revenues—reintroducing the exact risk of skimming and accounting fraud that `WEIR` eliminates.

---

## 5. The $O(1)$ Scalability Invariant

Naive dividend smart contracts loop over all investor addresses:
```solidity
// THE WRONG WAY: Reverts above 50-100 users due to gas limits
for (uint i = 0; i < allInvestors.length; i++) {
    payDividend(allInvestors[i]);
}
```

`WEIR` implements the **Cumulative Dividend-Per-Share Index (Pull Pattern)** used by Synthetix, MasterChef, and Uniswap:
$$\Delta \text{Index} = \frac{\text{Gross Revenue Deposited} \times 10^{18}}{\text{Total Outstanding Shares}}$$

- When $10,000 arrives, the contract updates **one global variable**.
- Individual investors claim their owed dividend whenever they wish:
  $$\text{Owed} = \text{UserShares} \times (\text{CurrentIndex} - \text{UserLastClaimedIndex}) / 10^{18}$$
- **Result:** A 3-investor live demo runs the **identical production-grade code** that scales to 100,000 investors with constant $O(1)$ gas.

---

## 6. Tier A Design System Adaptation (`dusk.network`)

Per project authorization, the frontend directly adopts the layout, spacing rhythm, and component grammar of **`dusk.network`**:
- **Adapted Structure:** Deep obsidian dark mode (`#080B11`), frosted glass surfaces (`#0E131F`), high-contrast display typography paired with technical monospace telemetry labels, and glowing status pills.
- **Originated for `WEIR`:** The 3-Conduit interactive workstation grid (Sponsor Inflow Conduit $\rightarrow$ Attestcoin Prover Conduit $\rightarrow$ Cap-Table Settlement Conduit) and the live cryptographic audit trail.

---

## 7. Verified Testnet Endpoints & Contracts

| Network | Component | Address / Endpoint | Status |
| :--- | :--- | :--- | :--- |
| **Creditcoin CC3 Testnet** | Block Prover Precompile | `0x0000000000000000000000000000000000000FD2` | **REAL (Native)** |
| **Creditcoin CC3 Testnet** | Chain Info Precompile | `0x0000000000000000000000000000000000000FD3` | **REAL (Native)** |
| **Creditcoin CC3 Testnet** | EvmV1Decoder Library | `0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f` | **REAL** |
| **Creditcoin CC3 Testnet** | RPC Endpoint | `https://rpc.cc3-testnet.creditcoin.network` (Chain ID 102031) | **REAL** |
| **Ethereum Sepolia** | RPC Endpoint | `https://ethereum-sepolia-rpc.publicnode.com` (Chain ID 11155111) | **REAL** |
| **Attestcoin Protocol** | Proof Builder API | `https://prover.cc3-testnet.creditcoin.network` | **REAL (HTTP 200)** |

*Complete honesty disclosure: see [REAL_VS_MOCKED.md](REAL_VS_MOCKED.md).*

---

## 8. Quickstart & Verification

### Prerequisites
- Node.js v20+ or v24+
- npm v10+

### 1. Run Unit Tests (Asserting $O(1)$ math, shortfall detection, replay protection)
```bash
npx hardhat test
```
*Expected output: 9 passing tests.*

### 2. Run Live Network & SDK Risk Burndown Probe
```bash
node scripts/probe_risk_burndown.js
```
*Captures live latency and precompile existence against Creditcoin CC3 and Sepolia.*

### 3. Launch Interactive Frontend Dashboard
```bash
npm run dev --prefix frontend
```
Open [http://localhost:3000](http://localhost:3000) to interact with the live 3-conduit demo.

---

## 9. License
MIT License. Open source for the Creditcoin Ecosystem.
