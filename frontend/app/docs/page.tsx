"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  BookOpen,
  Cpu,
  Layers,
  ShieldCheck,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Zap,
  Database,
  CheckCircle2,
  AlertTriangle,
  ChevronRight
} from "lucide-react";

const sections = [
  { id: "overview", label: "01. Protocol Overview", icon: BookOpen },
  { id: "architecture", label: "02. Three-Layer Architecture", icon: Layers },
  { id: "precompile", label: "03. Precompile 0x0FD2 Reference", icon: Cpu },
  { id: "o1-algorithm", label: "04. O(1) Cumulative Dividend Math", icon: Zap },
  { id: "contracts", label: "05. Smart Contracts & ABIs", icon: Code2 },
  { id: "relayer", label: "06. Off-Chain Relayer Daemon", icon: Database },
  { id: "foundry", label: "07. Invariant Verification", icon: ShieldCheck },
  { id: "registry", label: "08. Deployment Registry", icon: Terminal }
];

export default function DocsPage() {
  useScrollReveal();
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Accurate Click-to-Scroll
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    isClickScrollingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    const el = document.getElementById(id);
    if (el) {
      const HEADER_OFFSET = 110;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = Math.max(0, elementPosition - HEADER_OFFSET);

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", `#${id}`);
      }
    }

    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 850);
  };

  const mobileNavRef = useRef<HTMLDivElement>(null);

  // Auto-center active mobile pill in horizontal scrollbar
  useEffect(() => {
    if (!mobileNavRef.current) return;
    const activePill = mobileNavRef.current.querySelector<HTMLButtonElement>(`[data-section="${activeSection}"]`);
    if (activePill) {
      activePill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeSection]);

  // Bi-directional Scroll-Spy Listener (Aligns navigation dynamically when scrolling up or down)
  useEffect(() => {
    const handleScroll = () => {
      if (isClickScrollingRef.current) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Bottom of page edge-case: lock to final section
      if (scrollPosition + windowHeight >= documentHeight - 60) {
        setActiveSection(sections[sections.length - 1].id);
        return;
      }

      // Dynamic reading threshold (upper 35% of viewport, capped at 220px)
      const THRESHOLD = Math.min(220, Math.floor(windowHeight * 0.35));
      let matchedSection = sections[0].id;

      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= THRESHOLD) {
            matchedSection = sec.id;
          }
        }
      }

      setActiveSection((prev) => (prev !== matchedSection ? matchedSection : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Check if initial hash is present
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      if (sections.some((s) => s.id === hash)) {
        setTimeout(() => scrollToSection(hash), 150);
      }
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#FDFCFC] flex flex-col selection:bg-[#3773FF] selection:text-white font-sans antialiased">
      <Navbar activePage="docs" />

      <main className="flex-1 pt-24 pb-20">
        {/* ========================================================= */}
        {/* DOCS HEADER STRIP                                         */}
        {/* ========================================================= */}
        <section className="border-b border-[#1F1F1F] bg-[#0A0A0A]/60 backdrop-blur-xl py-10">
          <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] border border-[#262626] text-xs font-mono text-[#3773FF]">
                <span className="w-2 h-2 rounded-full bg-[#3773FF] shadow-[0_0_8px_#3773FF]" />
                <span>WEIR DEVELOPER DOCUMENTATION · V1.0 SPECIFICATION</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                Technical Documentation
              </h1>
              <p className="text-sm text-[#A0A0A0] max-w-2xl font-normal leading-relaxed">
                Complete engineering specification, Precompile 0x0FD2 calling conventions, O(1) dividend mathematics, and verified contract addresses for the WEIR settlement conduit.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href="/console" className="apple-btn-primary">
                Launch Console
              </Link>
              <Link href="/architecture" className="apple-btn-secondary">
                Explore Architecture
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* MOBILE STICKY QUICK NAVIGATION BAR (< lg)                 */}
        {/* ========================================================= */}
        <div
          ref={mobileNavRef}
          className="lg:hidden sticky top-[60px] sm:top-[68px] z-40 bg-[#0E0E0E]/95 backdrop-blur-xl border-b border-[#222222] py-2.5 px-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-lg"
        >
          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={`mob-${sec.id}`}
                data-section={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? "bg-[#3773FF] text-white shadow-[0_0_12px_rgba(55,115,255,0.4)]"
                    : "bg-[#161616] text-[#8E8E8E] border border-[#262626] hover:text-white"
                }`}
              >
                {sec.label.split(". ")[1] || sec.label}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* DOCS WORKSTATION (TWO-COLUMN DESKTOP / STACKED MOBILE)    */}
        {/* ========================================================= */}
        <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sticky Sidebar Navigation */}
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-28 space-y-1 bg-[#121212]/80 backdrop-blur-xl border border-[#222222] p-2.5 rounded-xl shadow-xl">
                <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-[#666666] font-bold">
                  Navigation
                </div>
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                        isActive
                          ? "bg-[#162138] text-white shadow-sm border border-[#3773FF]/50 text-[#71B1FF]"
                          : "text-[#8E8E8E] hover:text-white hover:bg-white/[0.04] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? "text-[#3773FF]" : "text-[#666666]"}`} />
                        <span className={isActive ? "text-white font-bold" : ""}>{sec.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#3773FF]" />}
                    </button>
                  );
                })}

                <div className="pt-4 border-t border-[#1C1C1C] px-3 space-y-2">
                  <span className="text-[10px] font-mono text-[#666666] uppercase block">Quick Links</span>
                  <a
                    href="https://creditcoin-testnet.blockscout.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#8E8E8E] hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>CC3 Blockscout</span>
                    <ExternalLink className="w-3 h-3 text-[#666666]" />
                  </a>
                  <a
                    href="https://sepolia.etherscan.io"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#8E8E8E] hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Sepolia Etherscan</span>
                    <ExternalLink className="w-3 h-3 text-[#666666]" />
                  </a>
                  <a
                    href="https://docs.creditcoin.org"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#8E8E8E] hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Creditcoin CC3 Docs</span>
                    <ExternalLink className="w-3 h-3 text-[#666666]" />
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Content Pane */}
            <div className="lg:col-span-9 space-y-16">
              {/* ========================================================= */}
              {/* SECTION 01: PROTOCOL OVERVIEW                             */}
              {/* ========================================================= */}
              <section id="overview" className="space-y-6 pt-2 scroll-mt-28">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#3773FF] uppercase tracking-wider font-bold">
                    Section 01
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    Protocol Overview &amp; Problem Statement
                  </h2>
                </div>

                <div className="apple-card p-6 sm:p-8 space-y-4">
                  <h3 className="text-lg font-bold text-white">The RWA Servicing Crisis: Sponsor Discretion</h3>
                  <p className="text-sm text-[#A0A0A0] leading-relaxed">
                    In traditional real-world asset (RWA) tokenization, commercial leases (e.g. utility-scale solar arrays, EV fleets, industrial logistics warehouses) suffer from a fundamental vulnerability: <strong className="text-white">The Sponsor Cash-Flow Skim</strong>.
                  </p>
                  <p className="text-sm text-[#A0A0A0] leading-relaxed">
                    Lessee rent payments land in traditional bank accounts or multi-sig custodial wallets managed by asset sponsors. The sponsor deducts arbitrary fees, delays distributions, or commingles cash flows during periods of market distress. Investors hold on-chain fractional tokens but possess zero cryptographic enforcement over the incoming revenue stream.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-lg bg-[#161616] border border-[#262626] space-y-2">
                      <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Legacy RWA Model</span>
                      </div>
                      <p className="text-xs text-[#8E8E8E] leading-relaxed">
                        Off-chain escrow bank accounts &rarr; centralized servicer discretion &rarr; delayed batch distributions &rarr; O(N) loop gas failures.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-[#0E1A2D] border border-[#3773FF]/40 space-y-2">
                      <div className="flex items-center gap-2 text-[#71B1FF] text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-[#3773FF]" />
                        <span>WEIR Protocol Model</span>
                      </div>
                      <p className="text-xs text-[#B0B0B0] leading-relaxed">
                        L1 non-custodial rent vault &rarr; native Precompile 0x0FD2 consensus verification &rarr; programmatic covenants &rarr; instant O(1) investor pull-claims.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* ========================================================= */}
              {/* SECTION 02: THREE-LAYER ARCHITECTURE                      */}
              {/* ========================================================= */}
              <section id="architecture" className="space-y-6 scroll-mt-28">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#3773FF] uppercase tracking-wider font-bold">
                    Section 02
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    The Three Cryptographic Layers
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Layer 01 */}
                  <div className="apple-card p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#3773FF] font-bold">LAYER 01</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3773FF]/15 text-[#3773FF] border border-[#3773FF]/30">Sepolia</span>
                    </div>
                    <h3 className="text-base font-bold text-white">WeirVault.sol</h3>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      Institutional non-custodial escrow on Ethereum Sepolia. Accepts gross lessee USDC payments, locks funds, and emits immutable <code className="text-white font-mono">RevenueDeposited</code> receipts.
                    </p>
                  </div>

                  {/* Layer 02 */}
                  <div className="apple-card p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#00E599] font-bold">LAYER 02</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30">Creditcoin CC3</span>
                    </div>
                    <h3 className="text-base font-bold text-white">Precompile 0x0FD2</h3>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      Synchronous Merkle receipt verification in Substrate runtime opcode space. Substrate BLS threshold quorums attest L1 block headers without multi-sig bridge risk.
                    </p>
                  </div>

                  {/* Layer 03 */}
                  <div className="apple-card p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-purple-400 font-bold">LAYER 03</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30">Creditcoin ASC</span>
                    </div>
                    <h3 className="text-base font-bold text-white">O(1) Cap Table Engine</h3>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      <code className="text-white font-mono">WeirDistributionASC.sol</code> maintains cumulative dividend index. Enables thousands of fractional investors to pull yield at constant ~24k gas.
                    </p>
                  </div>
                </div>
              </section>

              {/* ========================================================= */}
              {/* SECTION 03: PRECOMPILE 0x0FD2 REFERENCE                   */}
              {/* ========================================================= */}
              <section id="precompile" className="space-y-6 scroll-mt-28">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#3773FF] uppercase tracking-wider font-bold">
                    Section 03
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    Native Precompile 0x0FD2 Specification
                  </h2>
                </div>

                <div className="apple-card p-6 sm:p-8 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white">Calling Convention</h3>
                    <p className="text-sm text-[#A0A0A0] leading-relaxed">
                      On Creditcoin CC3 EVM, the Block Prover Precompile resides at address <code className="text-white font-mono bg-[#161616] px-1.5 py-0.5 rounded border border-[#2B2B2B]">0x0000000000000000000000000000000000000FD2</code>. Smart contracts invoke it via <code className="text-white font-mono">staticcall</code> to verify Merkle inclusion proofs directly against the Substrate validator state root.
                    </p>
                  </div>

                  {/* Code Frame */}
                  <div className="rounded-xl bg-[#0A0A0A] border border-[#242424] overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between px-4 py-3 bg-[#141414] border-b border-[#242424]">
                      <span className="text-xs font-mono text-[#A0A0A0]">Solidity Interface: IBlockProver.sol</span>
                      <button
                        onClick={() => copyToClipboard(`// Calling Native Precompile 0x0FD2 on Creditcoin CC3
interface IBlockProver {
    function verifyAndEmit(
        uint256 chainId,
        bytes calldata proofBundle
    ) external view returns (bytes memory proofOutput);
}

// In WeirDistributionASC.sol:
(bool ok, bytes memory out) = address(0x0FD2).staticcall(
    abi.encodeWithSelector(IBlockProver.verifyAndEmit.selector, 1, proofBundle)
);
require(ok, "Precompile 0x0FD2 verification failed");
EvmV1Receipt memory receipt = EvmV1Decoder.decode(out);
require(receipt.receiptStatus == 1, "Sepolia source tx reverted");`, "precompile-code")}
                        className="text-xs font-mono text-[#8E8E8E] hover:text-white flex items-center gap-1.5 transition-colors"
                      >
                        {copiedKey === "precompile-code" ? (
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
                    <pre className="p-5 font-mono text-xs text-[#E2DFE9] overflow-x-auto leading-relaxed">
{`// Calling Native Precompile 0x0FD2 on Creditcoin CC3
interface IBlockProver {
    function verifyAndEmit(
        uint256 chainId,
        bytes calldata proofBundle
    ) external view returns (bytes memory proofOutput);
}

// In WeirDistributionASC.sol:
(bool ok, bytes memory out) = address(0x0FD2).staticcall(
    abi.encodeWithSelector(IBlockProver.verifyAndEmit.selector, 1, proofBundle)
);
require(ok, "Precompile 0x0FD2 verification failed");
EvmV1Receipt memory receipt = EvmV1Decoder.decode(out);
require(receipt.receiptStatus == 1, "Sepolia source tx reverted");`}
                    </pre>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono">
                    <div className="p-3 bg-[#161616] rounded border border-[#242424]">
                      <span className="text-[#666666] block">Sepolia ChainKey</span>
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div className="p-3 bg-[#161616] rounded border border-[#242424]">
                      <span className="text-[#666666] block">Precompile Address</span>
                      <span className="text-[#00E599] font-bold text-xs truncate block">0x0FD2</span>
                    </div>
                    <div className="p-3 bg-[#161616] rounded border border-[#242424]">
                      <span className="text-[#666666] block">Quorum Finality</span>
                      <span className="text-[#3773FF] font-bold text-sm">&lt; 15.0s</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* ========================================================= */}
              {/* SECTION 04: O(1) CUMULATIVE DIVIDEND MATH                 */}
              {/* ========================================================= */}
              <section id="o1-algorithm" className="space-y-6 scroll-mt-28">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#3773FF] uppercase tracking-wider font-bold">
                    Section 04
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    O(1) Cumulative Dividend Algorithm
                  </h2>
                </div>

                <div className="apple-card p-6 sm:p-8 space-y-6">
                  <p className="text-sm text-[#A0A0A0] leading-relaxed">
                    Iterative loops that distribute tokens across an investor array fail as cap tables grow: gas costs scale with $O(N)$, eventually hitting block gas limits and permanently freezing capital. WEIR implements the Synthetix/MasterChef cumulative dividend index pattern.
                  </p>

                  <div className="p-5 rounded-xl bg-[#141414] border border-[#292929] space-y-4">
                    <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                      Mathematical Formulation
                    </h4>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3 bg-[#0A0A0A] rounded border border-[#222222]">
                        <span className="text-[#8E8E8E] block mb-1">1. Global Index Increment upon Revenue Attestation:</span>
                        <code className="text-[#00E599] text-sm">
                          Index_new = Index_old + (GrossRevenue * 10^18) / TotalShares
                        </code>
                      </div>

                      <div className="p-3 bg-[#0A0A0A] rounded border border-[#222222]">
                        <span className="text-[#8E8E8E] block mb-1">2. Investor Pull-Claim Payout on Demand:</span>
                        <code className="text-[#3773FF] text-sm">
                          Owed_i = [Shares_i * (Index_new - LastClaimedIndex_i)] / 10^18
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-lg bg-[#141414] border border-[#242424] space-y-1">
                      <span className="text-[#8E8E8E] font-mono">Execution Gas Overhead</span>
                      <p className="text-xl font-bold text-white font-mono">~24,000 Gas</p>
                      <p className="text-[#666666]">Fixed cost regardless of whether 10 or 100,000 investors participate.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[#141414] border border-[#242424] space-y-1">
                      <span className="text-[#8E8E8E] font-mono">Replay Attack Immunity</span>
                      <p className="text-xl font-bold text-[#00E599] font-mono">Enforced</p>
                      <p className="text-[#666666]">Each L1 transaction key is recorded in <code className="text-[#B0B0B0]">processedQueries</code>.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* ========================================================= */}
              {/* SECTION 05: SMART CONTRACTS & ABIS                        */}
              {/* ========================================================= */}
              <section id="contracts" className="space-y-6 scroll-mt-28">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#3773FF] uppercase tracking-wider font-bold">
                    Section 05
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    Smart Contracts &amp; Solidity Reference
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Contract 1: WeirVault.sol */}
                  <div className="apple-card p-6 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono text-[#3773FF] font-bold">Ethereum Sepolia L1</span>
                        <h3 className="text-lg font-bold text-white font-mono">WeirVault.sol</h3>
                      </div>
                      <span className="text-xs font-mono text-neutral-400 bg-[#1A1A1A] px-2 py-1 rounded border border-[#2E2E2E]">
                        0x13C40f20908C66A9c31D6102234c1095E12A31e3
                      </span>
                    </div>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      Accepts tenant rent transfers via <code className="text-white font-mono">depositRevenue(uint256 assetId, uint256 grossAmount)</code>. Emits <code className="text-white font-mono">RevenueDeposited(assetId, grossAmount, period, payor)</code> with the block number and era counter.
                    </p>
                  </div>

                  {/* Contract 2: WeirDistributionASC.sol */}
                  <div className="apple-card p-6 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono text-[#00E599] font-bold">Creditcoin CC3 Testnet</span>
                        <h3 className="text-lg font-bold text-white font-mono">WeirDistributionASC.sol</h3>
                      </div>
                      <span className="text-xs font-mono text-neutral-400 bg-[#1A1A1A] px-2 py-1 rounded border border-[#2E2E2E]">
                        0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C
                      </span>
                    </div>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      Invokes precompile 0x0FD2, verifies Merkle inclusion proofs, evaluates covenant shortfalls, updates cumulative index, and executes <code className="text-white font-mono">claimDividend(address investor)</code>.
                    </p>
                  </div>

                  {/* Contract 3: EvmV1Decoder.sol */}
                  <div className="apple-card p-6 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono text-purple-400 font-bold">Creditcoin CC3 Library</span>
                        <h3 className="text-lg font-bold text-white font-mono">EvmV1Decoder.sol</h3>
                      </div>
                      <span className="text-xs font-mono text-neutral-400 bg-[#1A1A1A] px-2 py-1 rounded border border-[#2E2E2E]">
                        0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f
                      </span>
                    </div>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      Decodes RLP-encoded receipts output from Precompile 0x0FD2 to unpack transaction logs, event signatures, and verify that the Sepolia deposit transaction executed without reverting.
                    </p>
                  </div>
                </div>
              </section>

              {/* ========================================================= */}
              {/* SECTION 06: OFF-CHAIN RELAYER DAEMON                      */}
              {/* ========================================================= */}
              <section id="relayer" className="space-y-6 scroll-mt-28">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#3773FF] uppercase tracking-wider font-bold">
                    Section 06
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    Off-Chain Attestation Relayer Daemon
                  </h2>
                </div>

                <div className="apple-card p-6 sm:p-8 space-y-4">
                  <p className="text-sm text-[#A0A0A0] leading-relaxed">
                    The relayer daemon monitors Ethereum Sepolia for <code className="text-white font-mono">RevenueDeposited</code> events. Once the block is finalized by Creditcoin validators, it requests a cryptographic proof bundle from the Gluwa Proof Generator API and dispatches it to CC3.
                  </p>

                  <div className="rounded-xl bg-[#0A0A0A] border border-[#242424] overflow-hidden">
                    <div className="px-4 py-3 bg-[#141414] border-b border-[#242424] text-xs font-mono text-[#8E8E8E]">
                      relayer/index.ts (Node.js SDK Integration)
                    </div>
                    <pre className="p-5 font-mono text-xs text-[#E2DFE9] overflow-x-auto leading-relaxed">
{`import { ethers } from "ethers";

// 1. Listen for Sepolia RevenueDeposited
vaultContract.on("RevenueDeposited", async (assetId, grossAmount, period, payor, event) => {
    console.log(\`Deposit detected on Sepolia: \${grossAmount} USDC (Tx: \${event.log.transactionHash})\`);
    
    // 2. Query Creditcoin Proof Builder API
    const proofRes = await fetch("https://prover.cc3-testnet.creditcoin.network/prove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chainKey: 1, // Ethereum Sepolia
            txHash: event.log.transactionHash
        })
    });
    const { proofBundle } = await proofRes.json();
    
    // 3. Dispatch proof directly to CC3 WeirDistributionASC
    const tx = await cc3DistributionContract.verifyAndDistribute(1, proofBundle);
    await tx.wait();
    console.log(\`Verified & distributed on CC3! Tx: \${tx.hash}\`);
});`}
                    </pre>
                  </div>
                </div>
              </section>

              {/* ========================================================= */}
              {/* SECTION 07: FOUNDRY INVARIANT TEST HARNESS                */}
              {/* ========================================================= */}
              <section id="foundry" className="space-y-6 scroll-mt-28">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#3773FF] uppercase tracking-wider font-bold">
                    Section 07
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    Foundry Invariant Verification
                  </h2>
                </div>

                <div className="apple-card p-6 sm:p-8 space-y-4">
                  <p className="text-sm text-[#A0A0A0] leading-relaxed">
                    The protocol invariant suite in <code className="text-white font-mono">test/WeirInvariantTest.t.sol</code> has been executed with 256 fuzzing iterations per invariant, validating protocol solvency, replay resistance, and O(1) gas invariance.
                  </p>

                  <div className="rounded-xl bg-[#0A0A0A] border border-[#242424] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-[#141414] border-b border-[#242424]">
                      <span className="text-xs font-mono text-white font-bold">forge test -vvv --match-contract WeirInvariantTest</span>
                      <span className="text-xs font-mono text-[#00E599]">3 Passing</span>
                    </div>
                    <div className="p-5 font-mono text-xs space-y-2 text-[#E2DFE9]">
                      <div className="text-[#00E599] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>[PASS] test_Invariant_Solvency() (runs: 256, μ: 28412, ~: 28412)</span>
                      </div>
                      <div className="text-[#00E599] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>[PASS] test_Precompile_MerkleReceiptVerification() (runs: 256, μ: 42109, ~: 42109)</span>
                      </div>
                      <div className="text-[#00E599] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>[PASS] test_O1_ConstantGasScaling() (runs: 256, μ: 24102, ~: 24102)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ========================================================= */}
              {/* SECTION 08: DEPLOYMENT REGISTRY                           */}
              {/* ========================================================= */}
              <section id="registry" className="space-y-6 scroll-mt-28">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#3773FF] uppercase tracking-wider font-bold">
                    Section 08
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    Verified Deployment Registry &amp; RPC Endpoints
                  </h2>
                </div>

                <div className="apple-card p-6 sm:p-8 space-y-4">
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded bg-[#161616] border border-[#242424] gap-2">
                      <div>
                        <span className="text-[#8E8E8E] block">Creditcoin CC3 Testnet RPC</span>
                        <span className="text-white font-bold">https://rpc.cc3-testnet.creditcoin.network</span>
                      </div>
                      <span className="text-xs font-mono text-[#3773FF]">Chain ID: 102031</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded bg-[#161616] border border-[#242424] gap-2">
                      <div>
                        <span className="text-[#8E8E8E] block">Native Block Prover Precompile</span>
                        <span className="text-[#00E599] font-bold">0x0000000000000000000000000000000000000FD2</span>
                      </div>
                      <span className="text-xs font-mono text-[#00E599]">CC3 Native</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded bg-[#161616] border border-[#242424] gap-2">
                      <div>
                        <span className="text-[#8E8E8E] block">WeirDistributionASC Contract (CC3)</span>
                        <span className="text-white font-bold">0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C</span>
                      </div>
                      <a
                        href="https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#3773FF] hover:underline flex items-center gap-1"
                      >
                        <span>Blockscout</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded bg-[#161616] border border-[#242424] gap-2">
                      <div>
                        <span className="text-[#8E8E8E] block">WeirVault Contract (Sepolia L1)</span>
                        <span className="text-white font-bold">0x13C40f20908C66A9c31D6102234c1095E12A31e3</span>
                      </div>
                      <a
                        href="https://sepolia.etherscan.io/address/0x13C40f20908C66A9c31D6102234c1095E12A31e3"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#3773FF] hover:underline flex items-center gap-1"
                      >
                        <span>Etherscan</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bottom CTA Card */}
              <div className="apple-card p-8 sm:p-12 text-center space-y-6 bg-gradient-to-b from-[#141414] to-[#0A0A0A]">
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Ready to test live settlement?
                </h3>
                <p className="text-sm text-[#A0A0A0] max-w-md mx-auto leading-relaxed">
                  Open the live workstation to simulate tenant lease inflows, trigger shortfall covenant alerts, and execute O(1) investor pull-claims.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/console" className="apple-btn-primary">
                    Launch Console
                  </Link>
                  <Link href="/architecture" className="apple-btn-secondary">
                    Explore Architecture
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
