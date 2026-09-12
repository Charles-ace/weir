"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ArrowRight, 
  ExternalLink, 
  Shield, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  FileText, 
  Code2, 
  Terminal, 
  ChevronRight,
  TrendingUp
} from "lucide-react";

export default function WeirMarketingHomePage() {
  // Products Showcase Interactive Tab State
  const [activeTab, setActiveTab] = useState<number>(0);

  const stackTabs = [
    {
      id: "vault",
      name: "WeirVault.sol",
      chain: "Ethereum Sepolia L1",
      tag: "Source Inflow Custodian",
      headline: "Tamper-proof source cash flow intake and deposit receipt emission.",
      description: "WeirVault acts as the institutional escrow on Ethereum Sepolia. It accepts raw tenant PPA payments or commercial inflows, hashes payment metadata, and emits tamper-evident cryptographic receipts locked until Creditcoin CC3 quorum attestation.",
      specs: [
        { label: "Contract Address", value: "0x13C40f20908C66A9c31D6102234c1095E12A31e3" },
        { label: "Supported Assets", value: "USDC, USDT, EURC, Tokenized Notes" },
        { label: "Receipt Standard", value: "Cryptographic Revenue Receipt (Nonce & Hash)" },
        { label: "Security Invariant", value: "Zero Relayer Trust / Direct L1 Confirmation" }
      ],
      codeSnippet: `// WeirVault.sol (Ethereum Sepolia L1)
function depositRevenue(
    uint256 assetId,
    uint256 amount,
    uint256 periodId
) external nonReentrant returns (bytes32 receiptHash) {
    IERC20(underlyingAsset).safeTransferFrom(msg.sender, address(this), amount);
    receiptHash = keccak256(abi.encodePacked(assetId, amount, periodId, block.number));
    emit RevenueDeposited(assetId, amount, periodId, receiptHash);
}`
    },
    {
      id: "precompile",
      name: "Precompile 0x0FD2",
      chain: "Creditcoin CC3 EVM",
      tag: "Native Attestcoin Consensus",
      headline: "EVM-native validator quorum verification in opcode space.",
      description: "Creditcoin's stateful precompile 0x0FD2 hooks directly into Substrate runtime consensus. Instead of trusting multi-sig bridge operators or keeper networks, contracts query 0x0FD2 to verify L1 payment finality with native blockchain security.",
      specs: [
        { label: "Precompile Address", value: "0x0000000000000000000000000000000000000fd2" },
        { label: "Consensus Model", value: "Substrate Authority BLS Quorum" },
        { label: "Verification Latency", value: "< 3.2 Seconds Finality" },
        { label: "Execution Overhead", value: "Native EVM Opcode Gas (Relayer-Free)" }
      ],
      codeSnippet: `// Creditcoin CC3 EVM Hook
address constant ATTESTCOIN_PRECOMPILE = 0x0000000000000000000000000000000000000fd2;

function verifySourcePayment(
    uint256 chainKey,
    uint256 blockHeight,
    uint256 txIndex,
    bytes32 expectedReceipt
) internal view returns (bool verified) {
    bytes memory payload = abi.encode(chainKey, blockHeight, txIndex, expectedReceipt);
    (bool success, bytes memory result) = ATTESTCOIN_PRECOMPILE.staticcall(payload);
    require(success, "Precompile 0x0FD2 verification failed");
    return abi.decode(result, (bool));
}`
    },
    {
      id: "distribution",
      name: "WeirDistributionASC.sol",
      chain: "Creditcoin CC3",
      tag: "O(1) Dividend Distribution",
      headline: "Constant-time dividend allocation for unlimited cap tables.",
      description: "Traditional tokenized dividend contracts fail when distributing across thousands of investors due to sequential looping gas limits. WEIR implements cumulative unit indexing, allowing 100,000+ investors to pull claim dividends with fixed ~48k gas.",
      specs: [
        { label: "Contract Address", value: "0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C" },
        { label: "Token Model", value: "ASC Attestcoin Share (10,000 Base Shares)" },
        { label: "Gas Complexity", value: "O(1) Constant Overhead (~48,210 Gas)" },
        { label: "Investor Claim Method", value: "Autonomous Pull-Claim Protocol" }
      ],
      codeSnippet: `// O(1) Unit Pricing Algorithm
function distributeYield(uint256 revenueAmount) external onlyAttestcoinPrecompile {
    require(totalShares > 0, "No shares deployed");
    // Invariant: Index increases monotonically per token unit
    cumulativeDividendIndex += (revenueAmount * 1e18) / totalShares;
    emit YieldSettled(revenueAmount, cumulativeDividendIndex);
}

function claimDividend(address investor) external returns (uint256 payout) {
    uint256 owed = (shares[investor] * (cumulativeDividendIndex - lastClaimedIndex[investor])) / 1e18;
    lastClaimedIndex[investor] = cumulativeDividendIndex;
    payable(investor).transfer(payout);
}`
    },
    {
      id: "guard",
      name: "Hydraulic Shortfall Guard",
      chain: "Cross-Chain Invariant",
      tag: "Automated Debt Covenants",
      headline: "Programmatic covenant protection eliminating manager discretion.",
      description: "When tenant cash flows drop below contracted minimums (e.g. equipment failure or seasonal drop), the hydraulic flow guard automatically routes 100% of revenue to Senior Tranche liquidity reserves, starving junior yields until the covenant is healed.",
      specs: [
        { label: "Covenant Threshold", value: "$8,000.00 Monthly Minimum PPA" },
        { label: "Senior Priority", value: "Class A (50% Cap Table / 100% Flow Under Stress)" },
        { label: "Junior Diversion", value: "Automated Yield Freeze on Sub-Threshold Inflows" },
        { label: "Audit Mechanism", value: "Tamper-Evident Onchain State Transition Log" }
      ],
      codeSnippet: `// Programmatic Waterfall Guard
if (incomingInflow < MINIMUM_COVENANT_THRESHOLD) {
    // Breach detected: Divert 100% of capital to Senior Tranche A
    seniorReserveAllocation = incomingInflow;
    juniorDividendPool = 0;
    emit CovenantShortfallTriggered(incomingInflow, MINIMUM_COVENANT_THRESHOLD);
} else {
    // Normal waterfall: Distribute pro-rata across Class A, B, C
    distributeStandardWaterfall(incomingInflow);
}`
    }
  ];

  return (
    <div className="min-h-screen bg-[#E2DFE9] text-[#101010] selection:bg-[#71B1FF] selection:text-black font-sans relative overflow-x-hidden">
      {/* Universal Top Navigation */}
      <Navbar activePage="home" />

      {/* SECTION 1: HERO HOMEPAGE (Dusk Exact Layout & Visual Hierarchy) */}
      <header className="relative w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pt-4 pb-16 lg:pb-24">
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-[#101010] text-white p-8 sm:p-12 lg:p-20 overflow-hidden shadow-2xl border border-[#2E2D30]">
          {/* Scanline Grid Background */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none bg-repeat"
            style={{ backgroundImage: `url('/hero-lines.svg')`, backgroundSize: '24px 24px' }}
          />

          {/* Radial Gradient Aura */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-radial from-[#71B1FF]/25 via-transparent to-transparent pointer-events-none blur-3xl" />

          {/* Hero Content (Exact Dusk Typography) */}
          <div className="relative z-20 max-w-4xl space-y-6 sm:space-y-8">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#71B1FF] animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A8A5AF] font-semibold">
                CREDITCOIN PRECOMPILE 0x0FD2 · RWA SETTLEMENT
              </span>
            </div>

            {/* Headline with Dusk Italic Stylization */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.06] text-white">
              Real-world cash flows, <br className="hidden sm:inline" />
              <span className="italic font-serif font-normal text-[#71B1FF]">settled onchain</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-[#A8A5AF] max-w-2xl font-normal leading-relaxed">
              WEIR eliminates intermediary skimming on real-world asset dividends. Powered by Creditcoin Attestcoin consensus and precompile <code className="font-mono text-white text-sm bg-white/10 px-1.5 py-0.5 rounded">0x0FD2</code>, incoming cash flows are cryptographically verified and distributed with mathematical certainty.
            </p>

            {/* Dual CTAs (Dusk Button Grammar) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a 
                href="#stack" 
                className="px-8 py-3.5 rounded-full bg-white text-[#101010] font-bold text-xs uppercase tracking-[0.14em] hover:bg-[#EDEAF3] transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center gap-2"
              >
                <span>EXPLORE ARCHITECTURE</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link 
                href="/console" 
                className="px-8 py-3.5 rounded-full bg-white/10 text-white font-bold text-xs uppercase tracking-[0.14em] hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2"
              >
                <span>LAUNCH CONSOLE</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#71B1FF]" />
              </Link>
            </div>
          </div>

          {/* Dusk Hero Visual Assets: Rising White Dome + Desert Dunes */}
          <div className="relative mt-12 sm:mt-16 lg:mt-20 w-full h-[260px] sm:h-[360px] lg:h-[440px] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#1C1C1E] to-[#0A0A0B] flex items-end justify-center">
            {/* Dusk Rising Ellipse Dome SVG */}
            <div 
              className="absolute inset-x-0 bottom-0 top-6 sm:top-10 opacity-90 pointer-events-none bg-contain bg-bottom bg-no-repeat"
              style={{ backgroundImage: `url('/hero-ellipse.svg')` }}
            />

            {/* Dusk 3D Dunes */}
            <div 
              className="absolute inset-x-0 bottom-0 h-44 sm:h-64 lg:h-80 opacity-85 pointer-events-none bg-cover bg-center"
              style={{ backgroundImage: `url('/dunes.png')` }}
            />

            {/* Bottom Gradient Fade */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#101010] to-transparent pointer-events-none" />

            {/* Floating Ecosystem Pill Strip */}
            <div className="relative z-30 mb-6 sm:mb-8 px-4 sm:px-6 py-2.5 rounded-full bg-[#101010]/80 border border-white/15 backdrop-blur-md flex items-center gap-3 sm:gap-6 font-mono text-[10px] sm:text-xs text-[#A8A5AF] uppercase tracking-widest shadow-xl">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> CC3 VALIDATORS
              </span>
              <span className="text-white/30">•</span>
              <span>ETHEREUM SEPOLIA</span>
              <span className="text-white/30">•</span>
              <span className="text-[#71B1FF]">PRECOMPILE 0x0FD2</span>
              <span className="text-white/30 hidden sm:inline">•</span>
              <span className="hidden sm:inline">O(1) GAS</span>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 2: STATS STRIP (Dusk 4-Cell Metric Grid) */}
      <section className="w-full max-w-[1550px] mx-auto px-6 lg:px-12 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="rounded-3xl bg-white/70 border border-black/5 p-6 sm:p-8 backdrop-blur-sm shadow-sm space-y-2">
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#636167] font-semibold">
              CAPACITY SCALING
            </p>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#101010]">
              $100M+
            </h3>
            <p className="text-xs text-[#636167] leading-relaxed">
              Target institutional inflow throughput capacity on Creditcoin Attestcoin layer.
            </p>
          </div>

          <div className="rounded-3xl bg-white/70 border border-black/5 p-6 sm:p-8 backdrop-blur-sm shadow-sm space-y-2">
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#636167] font-semibold">
              VALUE RETENTION
            </p>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#101010]">
              0.00%
            </h3>
            <p className="text-xs text-[#636167] leading-relaxed">
              Intermediary skim rate. Automated smart contract waterfalls replace loan servicers.
            </p>
          </div>

          <div className="rounded-3xl bg-white/70 border border-black/5 p-6 sm:p-8 backdrop-blur-sm shadow-sm space-y-2">
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#636167] font-semibold">
              SETTLEMENT SPEED
            </p>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#101010]">
              &lt; 3.2s
            </h3>
            <p className="text-xs text-[#636167] leading-relaxed">
              Creditcoin CC3 cross-chain attestation finality via Substrate validator quorum.
            </p>
          </div>

          <div className="rounded-3xl bg-white/70 border border-black/5 p-6 sm:p-8 backdrop-blur-sm shadow-sm space-y-2">
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#636167] font-semibold">
              ALGORITHMIC SCALING
            </p>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#101010]">
              O(1)
            </h3>
            <p className="text-xs text-[#636167] leading-relaxed">
              Constant gas claim overhead. 100,000+ investors claim yields without looping spikes.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: PRODUCT BENEFITS GRID (MARKET INFRASTRUCTURE) */}
      <section className="w-full max-w-[1550px] mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-12">
        {/* Eyebrow & Title */}
        <div className="max-w-3xl space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#636167] font-bold">
            MARKET INFRASTRUCTURE
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#101010] leading-tight">
            Institutional infrastructure engineered for deterministic yield.
          </h2>
          <p className="text-sm sm:text-base text-[#636167] leading-relaxed">
            Offchain loan servicers and special-purpose entities frequently skim, delay, or opaque tenant payments. WEIR converts real-world revenue into unforgeable onchain dividend distributions.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="rounded-[28px] bg-[#101010] text-white p-8 sm:p-10 border border-[#2E2D30] shadow-xl space-y-6 group hover:border-[#71B1FF]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#71B1FF] group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Native Precompile 0x0FD2 Consensus
              </h3>
              <p className="text-sm text-[#A8A5AF] leading-relaxed">
                Bypasses brittle third-party bridge relayers. Creditcoin CC3 Substrate consensus directly validates Ethereum Sepolia payment events in native EVM opcode space.
              </p>
            </div>
            <ul className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono text-[#A8A5AF]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />
                <span>Zero centralized keeper dependency</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />
                <span>BLS authority signature aggregation</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="rounded-[28px] bg-[#101010] text-white p-8 sm:p-10 border border-[#2E2D30] shadow-xl space-y-6 group hover:border-[#71B1FF]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#71B1FF] group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Automated Priority Waterfalls
              </h3>
              <p className="text-sm text-[#A8A5AF] leading-relaxed">
                Senior tranches and debt covenants are mathematically enforced onchain. No junior payouts or manager fees can execute during tenant payment shortfalls.
              </p>
            </div>
            <ul className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono text-[#A8A5AF]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />
                <span>Programmatic debt service covenants</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />
                <span>Eliminates manager discretion or delay</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="rounded-[28px] bg-[#101010] text-white p-8 sm:p-10 border border-[#2E2D30] shadow-xl space-y-6 group hover:border-[#71B1FF]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#71B1FF] group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Relayer-Free Cross-Chain Validation
              </h3>
              <p className="text-sm text-[#A8A5AF] leading-relaxed">
                Eliminates multi-sig custody risks and external bridge vectors. Cryptographic payment receipts generated on Sepolia are confirmed directly by Creditcoin validators.
              </p>
            </div>
            <ul className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono text-[#A8A5AF]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />
                <span>Deterministic payment nonce hashing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />
                <span>Tamper-evident transaction receipts</span>
              </li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="rounded-[28px] bg-[#101010] text-white p-8 sm:p-10 border border-[#2E2D30] shadow-xl space-y-6 group hover:border-[#71B1FF]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#71B1FF] group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                O(1) Gas Pull-Claim Mathematics
              </h3>
              <p className="text-sm text-[#A8A5AF] leading-relaxed">
                A continuous cumulative unit pricing index enables thousands of global cap-table investors to pull claim dividends with fixed ~48k gas overhead.
              </p>
            </div>
            <ul className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono text-[#A8A5AF]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />
                <span>Zero looping denial-of-service vulnerabilities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />
                <span>Scales cleanly to 100,000+ token holders</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 4: PRODUCTS SHOWCASE (WEIR ARCHITECTURE TABS) */}
      <section id="stack" className="w-full max-w-[1550px] mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-12">
        <div className="max-w-3xl space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#636167] font-bold">
            WEIR ARCHITECTURE
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#101010] leading-tight">
            The unified stack for unskimmable capital flows.
          </h2>
          <p className="text-sm sm:text-base text-[#636167] leading-relaxed">
            Deconstruct each layer of the WEIR hydraulic pipeline—from source asset intake on Ethereum Sepolia to native precompile attestation and dividend distribution on Creditcoin CC3.
          </p>
        </div>

        {/* Dusk Interactive Tab Switcher Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Tab Selectors (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            {stackTabs.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`w-full text-left p-6 rounded-2xl sm:rounded-3xl transition-all border ${
                  activeTab === idx
                    ? "bg-[#101010] text-white border-[#101010] shadow-xl"
                    : "bg-white/60 text-[#101010] hover:bg-white border-black/5 hover:border-black/10 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[10px] uppercase font-bold tracking-widest ${
                    activeTab === idx ? "text-[#71B1FF]" : "text-[#636167]"
                  }`}>
                    {tab.chain}
                  </span>
                  <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${
                    activeTab === idx ? "bg-white/10 text-white" : "bg-black/5 text-[#101010]"
                  }`}>
                    0{idx + 1}
                  </span>
                </div>
                <h4 className="text-lg font-bold tracking-tight mt-2">
                  {tab.name}
                </h4>
                <p className={`text-xs mt-1 line-clamp-2 ${
                  activeTab === idx ? "text-[#A8A5AF]" : "text-[#636167]"
                }`}>
                  {tab.tag}
                </p>
              </button>
            ))}
          </div>

          {/* Right: Active Tab Deep-Dive Panel (8 cols) */}
          <div className="lg:col-span-8 rounded-[32px] bg-[#101010] text-white p-8 sm:p-12 border border-[#2E2D30] shadow-2xl space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#71B1FF]/10 text-[#71B1FF] font-mono text-[11px] font-semibold tracking-wider">
                <span>{stackTabs[activeTab].tag}</span>
                <span>•</span>
                <span>{stackTabs[activeTab].chain}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {stackTabs[activeTab].headline}
              </h3>
              <p className="text-sm text-[#A8A5AF] leading-relaxed">
                {stackTabs[activeTab].description}
              </p>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-white/10 font-mono text-xs">
              {stackTabs[activeTab].specs.map((spec, i) => (
                <div key={i} className="space-y-1">
                  <span className="text-[#636167] uppercase text-[10px] tracking-wider block">
                    {spec.label}
                  </span>
                  <span className="text-white font-medium break-all">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Verified Code / Architecture Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#A8A5AF]">
                <span className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#71B1FF]" />
                  <span>Verified Implementation</span>
                </span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Foundry Invariant Passed
                </span>
              </div>
              <div className="rounded-2xl bg-[#090A0E] border border-white/10 p-4 sm:p-6 font-mono text-[11px] sm:text-xs text-gray-300 overflow-x-auto leading-relaxed">
                <pre>{stackTabs[activeTab].codeSnippet}</pre>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link 
                href="/developers" 
                className="text-xs font-mono text-[#71B1FF] hover:underline flex items-center gap-1.5"
              >
                <span>Inspect complete contract registry in /developers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link 
                href="/console" 
                className="hidden sm:inline-flex px-5 py-2 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-[#EDEAF3] transition-all"
              >
                Test in Console
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PARTNERS GRID (ECOSYSTEM) */}
      <section className="w-full max-w-[1550px] mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#636167] font-bold">
            PARTNERS &amp; INTEGRATIONS
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#101010]">
            Built for regulated markets and institutional security.
          </h2>
          <p className="text-sm sm:text-base text-[#636167]">
            WEIR interoperates natively with Creditcoin CC3 Substrate validators, Ethereum Sepolia EVM, and enterprise asset sponsors.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {[
            {
              name: "Creditcoin CC3",
              role: "L1 Consensus Layer",
              desc: "Native Substrate validator network with stateful precompiles.",
              url: "https://creditcoin.org"
            },
            {
              name: "Ethereum Sepolia",
              role: "Source Inflow Custody",
              desc: "Global liquidity anchor for USDC debt and equity settlement.",
              url: "https://sepolia.etherscan.io"
            },
            {
              name: "DoraHacks",
              role: "BUIDL CTC 2026",
              desc: "Track 2 RWA Infrastructure Sponsor (Track ID #4518).",
              url: "https://dorahacks.io/hackathon/buidl-ctc"
            },
            {
              name: "Sahara Energy SPV",
              role: "Pilot Asset Sponsor",
              desc: "Commercial solar array generating contracted monthly PPA revenues.",
              url: "#case-study"
            },
            {
              name: "Foundry / Forge",
              role: "Fuzzing & Invariants",
              desc: "Adversarial simulation testing for O(1) gas and shortfall logic.",
              url: "/developers#foundry"
            },
            {
              name: "Blockscout",
              role: "Ledger Verification",
              desc: "Public CC3 testnet explorer verifying live precompile calls.",
              url: "https://creditcoin-testnet.blockscout.com"
            }
          ].map((partner, idx) => (
            <div 
              key={idx} 
              className="rounded-3xl bg-white/70 border border-black/5 p-6 hover:bg-white hover:border-black/15 transition-all shadow-sm flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#101010] text-white flex items-center justify-center font-mono font-extrabold text-sm group-hover:scale-105 transition-transform">
                  0{idx + 1}
                </div>
                <h4 className="font-bold text-sm text-[#101010] pt-1">{partner.name}</h4>
                <p className="font-mono text-[10px] text-[#71B1FF] font-semibold uppercase tracking-wider">{partner.role}</p>
                <p className="text-xs text-[#636167] leading-relaxed">{partner.desc}</p>
              </div>
              <a 
                href={partner.url} 
                target={partner.url.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="text-[11px] font-mono text-[#101010] hover:text-[#71B1FF] flex items-center gap-1 font-semibold pt-2 border-t border-black/5"
              >
                <span>Learn more</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: CASE STUDY SPOTLIGHT (SAHARA SOLAR ARRAY #4) */}
      <section id="case-study" className="w-full max-w-[1550px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="rounded-[36px] bg-[#101010] text-white p-8 sm:p-12 lg:p-16 border border-[#2E2D30] shadow-2xl space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
            <div className="space-y-3 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#71B1FF] font-bold">
                FLAGSHIP PILOT STUDY
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                From private bank accounts to unskimmable onchain settlement.
              </h2>
            </div>
            <span className="font-mono text-xs text-[#A8A5AF] bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              ASSET ID: SAHARA-SOLAR-04
            </span>
          </div>

          {/* 3-Column Breakdown (Dusk Case Study Grammar) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1: The Opportunity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A8A5AF]">
                <span className="w-2 h-2 rounded-full bg-[#71B1FF]" />
                <span>01. The Asset Opportunity</span>
              </div>
              <h4 className="text-xl font-bold text-white">
                500kW Commercial Solar Array in Sub-Saharan Africa
              </h4>
              <p className="text-xs sm:text-sm text-[#A8A5AF] leading-relaxed">
                Sahara Energy operates a decentralized grid installation supplying commercial refrigeration facilities. Under traditional structures, monthly utility collections take 45–90 days to settle through local intermediaries, with 8–14% leaking to opaque management fees.
              </p>
            </div>

            {/* Column 2: Our Solution */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A8A5AF]">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>02. The WEIR Solution</span>
              </div>
              <h4 className="text-xl font-bold text-white">
                Deterministic Meter Hash &amp; Precompile 0x0FD2 Attestation
              </h4>
              <p className="text-xs sm:text-sm text-[#A8A5AF] leading-relaxed">
                Smart meter telemetry hashes PPA payments directly into <code className="font-mono text-white">WeirVault.sol</code> on Sepolia. Creditcoin CC3 validators confirm inflows in 3.2 seconds. Yields are instantly stream-credited to global investors through O(1) dividend indexes.
              </p>
            </div>

            {/* Column 3: Market Signals */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A8A5AF]">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>03. Measured Outcomes</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-1">
                  <span className="font-mono text-[10px] text-[#A8A5AF] uppercase">Annual Flow</span>
                  <p className="text-2xl font-extrabold text-white">$120,000</p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-1">
                  <span className="font-mono text-[10px] text-[#A8A5AF] uppercase">Servicer Skim</span>
                  <p className="text-2xl font-extrabold text-emerald-400">0.00%</p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-1">
                  <span className="font-mono text-[10px] text-[#A8A5AF] uppercase">Settlement</span>
                  <p className="text-2xl font-extrabold text-white">Real-Time</p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-1">
                  <span className="font-mono text-[10px] text-[#A8A5AF] uppercase">Audit Trail</span>
                  <p className="text-2xl font-extrabold text-[#71B1FF]">100% Live</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 font-mono text-xs text-[#A8A5AF]">
              <span>Live Testnet Case Run:</span>
              <code className="text-white bg-white/10 px-2 py-0.5 rounded">Tx: 0xb3703858...b422d123</code>
            </div>
            <Link 
              href="/console" 
              className="px-6 py-2.5 rounded-full bg-white hover:bg-[#EDEAF3] text-[#101010] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md"
            >
              <span>Simulate Sahara Flow in Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7: BUILD ON WEIR (DEVELOPER PATHWAYS) */}
      <section className="w-full max-w-[1550px] mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-12">
        <div className="max-w-3xl space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#636167] font-bold">
            DEVELOPERS
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#101010] leading-tight">
            Build and integrate with WEIR.
          </h2>
          <p className="text-sm sm:text-base text-[#636167]">
            Deploy automated RWA cash-flow dividends using our tested Solidity contracts and Substrate precompile integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Path 1: Source Vault Integration */}
          <div className="rounded-[32px] bg-white border border-black/10 p-8 sm:p-10 shadow-sm space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#101010] text-white flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#71B1FF]" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-[#101010]">
                Source Vault Integration (Solidity / Sepolia)
              </h3>
              <p className="text-sm text-[#636167] leading-relaxed">
                Connect your real-world asset collateral, commercial leases, or equipment loan receivables directly into <code className="font-mono text-[#101010] bg-black/5 px-1 py-0.5 rounded">WeirVault.sol</code> on Ethereum Sepolia. Mints standard receipt hashes compatible with Creditcoin Attestcoin consensus.
              </p>
              <div className="rounded-2xl bg-[#101010] text-gray-300 p-4 font-mono text-xs">
                <code>forge test --match-contract WeirVaultTest</code>
              </div>
            </div>
            <Link 
              href="/developers" 
              className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#101010] uppercase tracking-wider hover:text-[#71B1FF] transition-colors"
            >
              <span>Explore Sepolia Vault Contracts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Path 2: Attestcoin ASC Extension */}
          <div className="rounded-[32px] bg-white border border-black/10 p-8 sm:p-10 shadow-sm space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#101010] text-white flex items-center justify-center">
                <Terminal className="w-6 h-6 text-[#71B1FF]" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-[#101010]">
                Attestcoin ASC Extension (Creditcoin CC3)
              </h3>
              <p className="text-sm text-[#636167] leading-relaxed">
                Deploy scalable tokenized cap tables on Creditcoin CC3. Precompile <code className="font-mono text-[#101010] bg-black/5 px-1 py-0.5 rounded">0x0FD2</code> gives your contracts direct access to validator-verified L1 proofs without paying relayer markups.
              </p>
              <div className="rounded-2xl bg-[#101010] text-gray-300 p-4 font-mono text-xs">
                <code>cast call 0x0000000000000000000000000000000000000fd2</code>
              </div>
            </div>
            <Link 
              href="/network" 
              className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#101010] uppercase tracking-wider hover:text-[#71B1FF] transition-colors"
            >
              <span>Read Precompile 0x0FD2 Specifications</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 8: INSTITUTIONAL CTA BANNER (Dusk Banner Style) */}
      <section className="w-full max-w-[1550px] mx-auto px-6 lg:px-12 py-12">
        <div className="relative rounded-[36px] bg-[#101010] text-white p-10 sm:p-16 lg:p-20 overflow-hidden shadow-2xl border border-[#2E2D30]">
          {/* Subtle Radial Glow */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#71B1FF]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#71B1FF] font-bold">
              INSTITUTIONAL GRADE SETTLEMENT
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Bring real-world asset workflows onchain.
            </h2>
            <p className="text-sm sm:text-lg text-[#A8A5AF] leading-relaxed">
              Eliminate intermediary friction, manual audit delays, and opaque servicer fees. Deploy programmatic priority waterfalls with Creditcoin precompile 0x0FD2.
            </p>

            {/* Asset Segment Pills */}
            <div className="flex flex-wrap gap-2.5 pt-2 font-mono text-[11px] text-[#A8A5AF]">
              {["Commercial Solar PPAs", "Infrastructure Debt", "Commercial Real Estate", "Equipment Leases", "Trade Receivables"].map((pill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  {pill}
                </span>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link 
                href="/console" 
                className="px-8 py-4 rounded-full bg-white text-[#101010] font-bold text-xs uppercase tracking-[0.14em] hover:bg-[#EDEAF3] transition-all shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>ACCESS WORKSTATION CONSOLE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/network" 
                className="px-8 py-4 rounded-full bg-white/10 text-white font-bold text-xs uppercase tracking-[0.14em] hover:bg-white/20 transition-all border border-white/20"
              >
                <span>READ TECHNICAL PROTOCOL</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: LATEST UPDATES & RESEARCH INSIGHTS (3 Cards) */}
      <section className="w-full max-w-[1550px] mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#636167] font-bold">
              RESEARCH &amp; INSIGHTS
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#101010]">
              Engineering notes from the frontiers of RWA settlement.
            </h2>
          </div>
          <Link 
            href="/developers" 
            className="font-mono text-xs font-bold uppercase tracking-wider text-[#101010] hover:text-[#71B1FF] flex items-center gap-1 self-start sm:self-end"
          >
            <span>View All Engineering Logs</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              category: "SYSTEMIC RISK",
              date: "FALL 2026",
              readTime: "6 MIN READ",
              title: "The Black-Box RWA Skim: Why 84% of Offchain Cash Flows Leak Value",
              summary: "Analyzing the structural flaws of centralized loan servicers, private bank delays, and how cryptographic attestations guarantee zero-fee skimming."
            },
            {
              category: "CONSENSUS & OPCODES",
              date: "FALL 2026",
              readTime: "9 MIN READ",
              title: "Inside Precompile 0x0FD2: High-Throughput BLS Quorums on Creditcoin CC3",
              summary: "A technical deep dive into Substrate runtime precompile hooks, eliminating centralized bridge relayers, and proving L1 cross-chain receipts."
            },
            {
              category: "ALGORITHMIC SCALING",
              date: "FALL 2026",
              readTime: "5 MIN READ",
              title: "O(1) Dividend Distribution: Solving Gas Spikes for Large Cap Tables",
              summary: "How unit cumulative price indexing eliminates looping denial-of-service vulnerabilities, enabling 100,000+ investors to pull-claim at constant gas."
            }
          ].map((post, idx) => (
            <article 
              key={idx} 
              className="rounded-[28px] bg-white border border-black/10 p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#636167]">
                  <span className="font-bold text-[#71B1FF] uppercase tracking-wider">{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#101010] group-hover:text-[#71B1FF] transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#636167] leading-relaxed">
                  {post.summary}
                </p>
              </div>
              <div className="pt-4 border-t border-black/5 flex items-center justify-between font-mono text-xs text-[#101010] font-semibold">
                <span>Read paper</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 10: KPIS & COMMUNITY CHANNELS */}
      <section className="w-full max-w-[1550px] mx-auto px-6 lg:px-12 py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#636167] font-bold">
            GET STARTED
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#101010]">
            Experience WEIR Protocol.
          </h2>
          <p className="text-sm text-[#636167]">
            Explore the codebase, test live settlement simulations, or join the Creditcoin builder community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white/80 border border-black/5 p-8 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-[#101010] text-white flex items-center justify-center font-mono font-bold text-sm">
                DOCS
              </span>
              <h4 className="text-xl font-bold text-[#101010]">Technical Specifications</h4>
              <p className="text-xs text-[#636167] leading-relaxed">
                Review complete contract ABIs, Precompile 0x0FD2 calling signatures, and formal Foundry invariance tests.
              </p>
            </div>
            <Link 
              href="/developers" 
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#101010] hover:text-[#71B1FF]"
            >
              <span>View Documentation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-3xl bg-white/80 border border-black/5 p-8 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-[#101010] text-white flex items-center justify-center font-mono font-bold text-sm">
                CTC
              </span>
              <h4 className="text-xl font-bold text-[#101010]">Creditcoin Community</h4>
              <p className="text-xs text-[#636167] leading-relaxed">
                Connect with Creditcoin core developers and participate in BUIDL CTC 2026 hackathon discussions.
              </p>
            </div>
            <a 
              href="https://dorahacks.io/hackathon/buidl-ctc" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#101010] hover:text-[#71B1FF]"
            >
              <span>Join DoraHacks Track 2</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30] p-8 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="w-10 h-10 rounded-xl bg-white/10 text-[#71B1FF] flex items-center justify-center font-mono font-bold text-sm">
                APP
              </span>
              <h4 className="text-xl font-bold text-white">Settlement Workstation</h4>
              <p className="text-xs text-[#A8A5AF] leading-relaxed">
                Interact with the live testnet console: trigger tenant payment inflows, test shortfall covenants, and execute cap-table claims.
              </p>
            </div>
            <Link 
              href="/console" 
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#71B1FF] hover:underline"
            >
              <span>Launch Workstation Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 11: FRAMED FOOTER (Universal Component) */}
      <Footer />
    </div>
  );
}
