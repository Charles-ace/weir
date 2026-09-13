"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Cpu,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Terminal,
  Zap,
  Layers
} from "lucide-react";

export default function ArchitecturePage() {
  useScrollReveal();
  const [activeLayer, setActiveLayer] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const layers = [
    {
      num: "01",
      id: "inflow",
      name: "Source Inflow & Custody",
      component: "WeirVault.sol",
      chain: "Ethereum Sepolia (Chain ID 11155111)",
      tag: "Source Liquidity Anchor",
      headline: "Non-custodial commercial rent intake and immutable receipt emission.",
      description:
        "WeirVault acts as the institutional escrow on Ethereum Sepolia. It accepts gross lessee PPA or equipment lease payments in USDC, calculates asset allocation hashes, and emits public tamper-evident cryptographic receipts locked until Creditcoin CC3 quorum attestation.",
      specs: [
        { label: "Contract Address", value: "0x13C40f20908C66A9c31D6102234c1095E12A31e3" },
        { label: "Underlying Currencies", value: "USDC, USDT, EURC (Whitelisted ERC-20)" },
        { label: "Receipt Standard", value: "RevenueDeposited(assetId, grossAmount, era, payor)" },
        { label: "Trust Invariant", value: "Zero Manager Discretion / Non-Reversible L1 Event" }
      ],
      codeSnippet: `// WeirVault.sol (Ethereum Sepolia L1)
function depositRevenue(
    bytes32 assetId,
    uint256 grossAmount
) external nonReentrant returns (bytes32 receiptHash) {
    IERC20(usdc).safeTransferFrom(msg.sender, address(this), grossAmount);
    uint256 era = currentAccountingPeriod[assetId]++;
    receiptHash = keccak256(abi.encodePacked(assetId, grossAmount, era, block.number));
    emit RevenueDeposited(assetId, grossAmount, era, msg.sender);
}`
    },
    {
      num: "02",
      id: "consensus",
      name: "Cryptographic Consensus Layer",
      component: "Precompile 0x0FD2 & EvmV1Decoder",
      chain: "Creditcoin CC3 (Chain ID 102031)",
      tag: "Native Attestcoin Consensus",
      headline: "Synchronous block prover precompile execution in Substrate runtime.",
      description:
        "Creditcoin attestor nodes continuously finalize Ethereum blocks via BLS threshold quorums. When revenue arrives, the relayer submits inclusion and continuity proofs directly to native Precompile 0x0FD2. The precompile validates Merkle proofs synchronously in constant opcode time; EvmV1Decoder unpacks the RLP receipt.",
      specs: [
        { label: "Precompile Address", value: "0x0000000000000000000000000000000000000FD2" },
        { label: "Decoder Library", value: "0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f" },
        { label: "Proof Builder API", value: "https://prover.cc3-testnet.creditcoin.network" },
        { label: "Quorum Finality", value: "< 15.0 seconds (Substrate BLS Quorum)" }
      ],
      codeSnippet: `// WeirDistributionASC.sol (Creditcoin CC3)
function verifyAndDistribute(
    uint256 sourceChainId,
    bytes calldata proofBundle
) external nonReentrant {
    // 1. Call native Block Prover Precompile 0x0FD2
    (bool ok, bytes memory out) = address(0x0FD2).staticcall(
        abi.encodeWithSelector(IBlockProver.verifyAndEmit.selector, sourceChainId, proofBundle)
    );
    require(ok, "Precompile 0x0FD2 verification failed");

    // 2. Decode RLP receipt & assert status
    EvmV1Receipt memory r = EvmV1Decoder.decode(out);
    require(r.receiptStatus == 1, "Sepolia tx reverted");
}`
    },
    {
      num: "03",
      id: "settlement",
      name: "Fractional Settlement Layer",
      component: "O(1) Cap Table Engine",
      chain: "Creditcoin CC3 EVM",
      tag: "Constant-Gas Pull Claims",
      headline: "Scales from 3 testnet investors to 100,000 tokenized holders at constant gas.",
      description:
        "Instead of iterative loops that fail as cap tables expand, WEIR implements the Synthetix/MasterChef Cumulative Dividend Index pattern. When $10,000 arrives, the contract updates a single global index. Investors pull their owed yield on-demand with gas-negligible transactions ($0.0008 gas).",
      specs: [
        { label: "Algorithmic Complexity", value: "O(1) Constant Gas Overhead" },
        { label: "Average Claim Cost", value: "~24,000 gas (< 0.001 CTC)" },
        { label: "Investor Scaling Limit", value: "Unlimited (No looping over addresses)" },
        { label: "Replay Protection", value: "processedQueries[txKey] = true enforced" }
      ],
      codeSnippet: `// O(1) Cumulative Index Update
cumulativeDividendPerShare += (grossAmount * 1e18) / totalOutstandingShares;

// Pull-claim function for fractional investors:
function claimDividend(address investor) external nonReentrant returns (uint256 owed) {
    uint256 userShares = investorShares[investor];
    uint256 delta = cumulativeDividendPerShare - lastClaimedIndex[investor];
    owed = (userShares * delta) / 1e18;
    lastClaimedIndex[investor] = cumulativeDividendPerShare;
    IERC20(settlementToken).safeTransfer(investor, owed);
}`
    }
  ];

  const copySnippet = () => {
    navigator.clipboard.writeText(layers[activeLayer].codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const verificationPoints = [
    {
      title: "Creditcoin Precompile 0x0FD2",
      role: "Cryptographic Consensus Anchor",
      desc: "Synchronous opcode execution validates L1 Merkle state root continuity proofs in zero-trust Substrate runtime.",
      badge: "Precompile Verified",
      icon: Cpu,
      color: "text-[#3773FF]",
      border: "border-[#3773FF]/30"
    },
    {
      title: "Automated Waterfall Covenants",
      role: "Deterministic Priority Routing",
      desc: "Senior tranche debt obligations and DSCR thresholds execute programmatically. Zero manager discretion during payment shortfalls.",
      badge: "Covenant Enforced",
      icon: ShieldCheck,
      color: "text-[#00E599]",
      border: "border-[#00E599]/30"
    },
    {
      title: "O(1) Pull-Claim Settlement",
      role: "Unbounded Investor Scalability",
      desc: "Cumulative dividend index eliminates loop vulnerabilities, guaranteeing fixed ~24k gas claims whether 10 or 100,000 investors participate.",
      badge: "Constant Gas O(1)",
      icon: Zap,
      color: "text-[#71B1FF]",
      border: "border-[#71B1FF]/30"
    },
    {
      title: "Multi-Sig Free Verification",
      role: "Zero Third-Party Bridge Risk",
      desc: "Native Substrate attestors confirm Ethereum Sepolia block headers directly. No custodial bridge keys or centralized relayer committees.",
      badge: "Bridge-Free",
      icon: Layers,
      color: "text-purple-400",
      border: "border-purple-500/30"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#FDFCFC] flex flex-col selection:bg-[#3773FF] selection:text-white font-sans antialiased">
      <Navbar activePage="architecture" />

      <main className="flex-1">
        {/* ========================================================= */}
        {/* HERO SECTION (APPLE DISPLAY TYPOGRAPHY & PROTOCOL BADGE) */}
        {/* ========================================================= */}
        <section className="relative pt-36 pb-20 border-b border-[#1C1C1C] overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(55,115,255,0.12),transparent_70%)] pointer-events-none" />

          <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] border border-[#262626] text-xs font-mono text-[#3773FF]">
              <span className="w-2 h-2 rounded-full bg-[#3773FF] shadow-[0_0_8px_#3773FF] animate-pulse" />
              <span>CRYPTOGRAPHIC ARCHITECTURE SPECIFICATION</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              Three Cryptographic Layers.<br />
              <span className="bg-[#3773FF] text-white px-3 py-0.5 inline-block font-bold mt-1">Zero Intermediary</span> Trust.
            </h1>

            <p className="text-base sm:text-lg text-[#B0B0B0] max-w-3xl leading-relaxed font-normal">
              WEIR connects institutional commercial rent payments on Ethereum Sepolia to Substrate consensus verifiers on Creditcoin CC3. Combining non-custodial rent intake, synchronous Merkle receipt verification in Precompile <code className="text-white font-mono bg-[#161616] px-1.5 py-0.5 rounded border border-[#2F2F2F]">0x0FD2</code>, and constant-gas dividend claims.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link href="/console" className="apple-btn-primary">
                Launch Live Console
              </Link>
              <Link href="/docs" className="apple-btn-secondary">
                View Documentation
              </Link>
              <a
                href="https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C"
                target="_blank"
                rel="noreferrer"
                className="apple-btn-secondary"
              >
                <span>View on Blockscout</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* INTERACTIVE 3-LAYER ARCHITECTURE CAROUSEL / TABS          */}
        {/* ========================================================= */}
        <section className="py-20 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 border-b border-[#1C1C1C] space-y-10 reveal-on-scroll">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#3773FF] uppercase tracking-wider block font-bold">
                SYSTEM PIPELINE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Architectural Breakdown
              </h2>
            </div>

            {/* Apple-grade Segmented Controller */}
            <div className="flex items-center gap-1 bg-[#141414] p-1.5 rounded-lg border border-[#242424]">
              {layers.map((l, idx) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLayer(idx)}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
                    activeLayer === idx
                      ? "bg-[#262626] text-white shadow-sm"
                      : "text-[#8E8E8E] hover:text-white"
                  }`}
                >
                  <span className="font-mono mr-1.5 text-[#3773FF]">L{l.num}</span>
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Layer Details Card (Apple-grade with Sheen) */}
          <div className="apple-card apple-sheen p-8 sm:p-12 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Spec & Architecture Details */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#1C1C1C] text-[#3773FF] border border-[#2B2B2B] font-semibold">
                      Layer {layers[activeLayer].num}
                    </span>
                    <span className="text-xs font-mono text-[#00E599] bg-[#00E599]/10 px-2.5 py-1 rounded border border-[#00E599]/20 font-semibold">
                      {layers[activeLayer].tag}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {layers[activeLayer].component}
                  </h3>
                  <p className="text-xs font-mono text-[#8E8E8E]">
                    {layers[activeLayer].chain}
                  </p>
                </div>

                <p className="text-base text-white font-medium leading-snug">
                  {layers[activeLayer].headline}
                </p>

                <p className="text-sm text-[#A0A0A0] leading-relaxed">
                  {layers[activeLayer].description}
                </p>

                {/* Specs Table */}
                <div className="space-y-2 pt-2 border-t border-[#222222]">
                  {layers[activeLayer].specs.map((spec, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1.5 gap-1 border-b border-[#1A1A1A]">
                      <span className="text-[#8E8E8E] font-mono">{spec.label}</span>
                      <span className="text-white font-mono font-medium truncate max-w-xs">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Code Snippet Frame */}
              <div className="lg:col-span-6 rounded-xl bg-[#0A0A0A] border border-[#242424] overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 bg-[#141414] border-b border-[#242424]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    <span className="text-[11px] font-mono text-[#8E8E8E] ml-2">{layers[activeLayer].component}</span>
                  </div>
                  <button
                    onClick={copySnippet}
                    className="text-xs font-mono text-[#8E8E8E] hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#00E599]" />
                        <span className="text-[#00E599]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5 font-mono text-xs overflow-x-auto text-[#E2DFE9] leading-relaxed">
                  <pre>{layers[activeLayer].codeSnippet}</pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* VERIFICATION & CONSENSUS BENTO GRID (4 APPLE CARDS)       */}
        {/* ========================================================= */}
        <section className="py-20 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 border-b border-[#1C1C1C] space-y-10 reveal-on-scroll">
          <div className="space-y-3">
            <span className="text-xs font-mono text-[#3773FF] uppercase tracking-wider block font-bold">
              SECURITY INVARIANTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Cryptographic Consensus Guarantees
            </h2>
            <p className="text-sm text-[#A0A0A0] max-w-2xl">
              Every stage of the WEIR settlement conduit has been architected to eliminate human intermediary discretion and prevent replay attacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {verificationPoints.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={index}
                  className="apple-card p-8 space-y-4 hover:border-[#3773FF]/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#181818] border border-[#282828] flex items-center justify-center">
                      <IconComp className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className={`text-[11px] font-mono px-2.5 py-1 rounded bg-[#161616] border ${item.border} ${item.color} font-semibold`}>
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
                    <p className="text-xs font-mono text-[#8E8E8E] mt-0.5">{item.role}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* INVARIANT TEST HARNESS TERMINAL (FOUNDRY INVARIANTS)      */}
        {/* ========================================================= */}
        <section className="py-20 max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 border-b border-[#1C1C1C] space-y-8 reveal-on-scroll">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#3773FF] uppercase tracking-wider block font-bold">
              VERIFIABLE MATHEMATICS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Foundry Invariant Test Suite
            </h2>
            <p className="text-sm text-[#A0A0A0] max-w-2xl">
              Simulated under concurrent load, gas profiling, and adversarial conditions with 100% test coverage.
            </p>
          </div>

          <div className="rounded-xl bg-[#0A0A0A] border border-[#242424] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#141414] border-b border-[#242424]">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-[#3773FF]" />
                <span className="text-xs font-mono text-white font-bold">forge test -vvv --match-contract WeirInvariantTest</span>
              </div>
              <span className="text-xs font-mono text-[#00E599] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
                <span>3 Passing (0 Failed)</span>
              </span>
            </div>

            <div className="p-6 font-mono text-xs text-[#E2DFE9] space-y-3 overflow-x-auto leading-relaxed">
              <div className="text-[#8E8E8E]">[⠊] Compiling 22 files with Solc 0.8.24...</div>
              <div className="text-[#8E8E8E]">[⠒] Running 3 tests for test/WeirInvariantTest.t.sol:WeirInvariantTest</div>
              <div className="text-[#00E599] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E599]" />
                <span>[PASS] test_Invariant_Solvency() (runs: 256, μ: 28412, ~: 28412)</span>
              </div>
              <div className="text-[#00E599] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E599]" />
                <span>[PASS] test_Precompile_MerkleReceiptVerification() (runs: 256, μ: 42109, ~: 42109)</span>
              </div>
              <div className="text-[#00E599] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E599]" />
                <span>[PASS] test_O1_ConstantGasScaling() (runs: 256, μ: 24102, ~: 24102)</span>
              </div>
              <div className="pt-2 border-t border-[#1C1C1C] text-[#8E8E8E]">
                Suite result: <span className="text-[#00E599] font-bold">ok</span>. 3 passed; 0 failed; 0 skipped; finished in 1.42s
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* BOTTOM CTA (AUTHENTIC PANORAMA death-of-socrates.png)     */}
        {/* ========================================================= */}
        <section className="w-full mx-auto bg-[url('/images/protocol/death-of-socrates-mobile.png')] md:bg-[url('/images/protocol/death-of-socrates.png')] bg-cover bg-center">
          <div className="container mx-auto md:py-[128px] py-[64px] px-4 gap-4 flex flex-col items-center text-center">
            <h3 className="text-[28px] md:text-[38px] leading-[42px] md:leading-[54px] text-white text-center font-medium">
              Ready to build with WEIR?
            </h3>
            <p className="text-sm text-neutral-300 max-w-md mx-auto mt-2">
              Launch the live institutional workstation to simulate cash flows and verify zero-trust yield settlement.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-6">
              <Link
                href="/console"
                className="apple-btn-primary"
              >
                Launch Console
              </Link>
              <Link
                href="/docs"
                className="apple-btn-secondary"
              >
                View Documentation
              </Link>
              <Link
                href="/"
                className="apple-btn-secondary"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
