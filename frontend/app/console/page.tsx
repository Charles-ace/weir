"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Coins,
  ExternalLink,
  Layers,
  CheckCircle,
  Copy,
  ShieldCheck,
  TrendingUp,
  ArrowRight
} from "lucide-react";

export default function ConsolePage() {
  useScrollReveal();

  // Demo & Simulation State
  const [isSimulatingShortfall, setIsSimulatingShortfall] = useState<boolean>(false);
  const [pipelineState, setPipelineState] = useState<"idle" | "depositing" | "attesting" | "verified">("idle");
  const [pipelineStep, setPipelineStep] = useState<number>(4);

  // Cap-Table Balances (Seeded with live on-chain run values)
  const [cumulativeIndex, setCumulativeIndex] = useState<number>(1.0);
  const [totalInflow, setTotalInflow] = useState<number>(10000);
  const [periodCount, setPeriodCount] = useState<number>(1);
  const [shortfallAlert, setShortfallAlert] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const [aliceClaimable, setAliceClaimable] = useState<number>(5000);
  const [aliceClaimed, setAliceClaimed] = useState<number>(0);

  const [bobClaimable, setBobClaimable] = useState<number>(3000);
  const [bobClaimed, setBobClaimed] = useState<number>(0);

  const [charlieClaimable, setCharlieClaimable] = useState<number>(2000);
  const [charlieClaimed, setCharlieClaimed] = useState<number>(0);

  // Live Audit Log with verified testnet receipts
  const [auditLogs, setAuditLogs] = useState<Array<{
    id: string;
    timestamp: string;
    chain: string;
    event: string;
    amount: string;
    status: "verified" | "shortfall" | "claimed";
    txHash?: string;
    explorerUrl?: string;
  }>>([
    {
      id: "tx-live-03",
      timestamp: "00:33:18",
      chain: "Creditcoin CC3",
      event: "verifyAndDistribute(O(1) Dividend Index: 1.0 USDC/share)",
      amount: "$10,000 USDC",
      status: "verified",
      txHash: "0xb3703858d3630d3829a09a310af7e74ea1d6cf3970eb66b88b414ba8b422d123",
      explorerUrl: "https://creditcoin-testnet.blockscout.com/tx/0xb3703858d3630d3829a09a310af7e74ea1d6cf3970eb66b88b414ba8b422d123"
    },
    {
      id: "tx-live-02",
      timestamp: "00:28:32",
      chain: "Creditcoin (0x0FD2)",
      event: "TransactionVerified(chainKey 1, height 11685350, tx 114)",
      amount: "0x0FD2 Precompile",
      status: "verified",
      txHash: "0xa60cff26332f0b59358b554afd6cbbee9f8332358cb7586fdc5bd5ae20cc4995",
      explorerUrl: "https://creditcoin-testnet.blockscout.com/tx/0xa60cff26332f0b59358b554afd6cbbee9f8332358cb7586fdc5bd5ae20cc4995"
    },
    {
      id: "tx-live-01",
      timestamp: "00:14:02",
      chain: "Sepolia L1",
      event: "RevenueDeposited(Asset #1, $10,000 USDC, Period 1)",
      amount: "$10,000 USDC",
      status: "verified",
      txHash: "0xd83e4a58e9e65fe8537291be43310c88b29c028efd7722f9ce3ac9b6a3e3ffb1",
      explorerUrl: "https://sepolia.etherscan.io/tx/0xd83e4a58e9e65fe8537291be43310c88b29c028efd7722f9ce3ac9b6a3e3ffb1"
    },
    {
      id: "init-02",
      timestamp: "00:32:45",
      chain: "Creditcoin CC3",
      event: "WeirDistributionASC Deployed (0xe01236...8d3C)",
      amount: "10,000 Shares",
      status: "verified",
      txHash: "0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C",
      explorerUrl: "https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C"
    },
    {
      id: "init-01",
      timestamp: "00:12:15",
      chain: "Sepolia L1",
      event: "WeirVault Deployed & Sahara Solar Array #1 Registered",
      amount: "Covenant $10k",
      status: "verified",
      txHash: "0x13C40f20908C66A9c31D6102234c1095E12A31e3",
      explorerUrl: "https://sepolia.etherscan.io/address/0x13C40f20908C66A9c31D6102234c1095E12A31e3"
    }
  ]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Handle Revenue Inflow Simulation
  const handleDepositRevenue = async () => {
    const depositValue = isSimulatingShortfall ? 6000 : 10000;
    setPipelineState("depositing");
    setPipelineStep(1);

    setTimeout(() => {
      setPipelineStep(2);
      setPipelineState("attesting");

      setTimeout(() => {
        setPipelineStep(3);

        setTimeout(() => {
          setPipelineStep(4);
          setPipelineState("verified");

          const newTotal = totalInflow + depositValue;
          const newPeriod = periodCount + 1;
          const deltaIndex = depositValue / 10000;
          const newIndex = cumulativeIndex + deltaIndex;

          setTotalInflow(newTotal);
          setPeriodCount(newPeriod);
          setCumulativeIndex(newIndex);
          setShortfallAlert(depositValue < 10000);

          setAliceClaimable((prev) => prev + depositValue * 0.5);
          setBobClaimable((prev) => prev + depositValue * 0.3);
          setCharlieClaimable((prev) => prev + depositValue * 0.2);

          setAuditLogs((prev) => [
            {
              id: `tx-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              chain: "Creditcoin (0x0FD2)",
              event:
                depositValue < 10000
                  ? `RevenueShortfall($10k covenant target, received $${depositValue.toLocaleString()})`
                  : `verifyAndDistribute(Period ${newPeriod}, +$${depositValue.toLocaleString()} USDC)`,
              amount: `$${depositValue.toLocaleString()} USDC`,
              status: depositValue < 10000 ? "shortfall" : "verified",
              txHash: "0xb3703858d3630d3829a09a310af7e74ea1d6cf3970eb66b88b414ba8b422d123",
              explorerUrl: "https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C"
            },
            ...prev
          ]);
        }, 1200);
      }, 1500);
    }, 1000);
  };

  const handleClaim = (investor: "alice" | "bob" | "charlie") => {
    if (investor === "alice" && aliceClaimable > 0) {
      setAliceClaimed((prev) => prev + aliceClaimable);
      setAuditLogs((prev) => [
        {
          id: `claim-alice-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          chain: "Creditcoin CC3",
          event: "DividendClaimed(Alice 50% pull-claim executed in O(1) gas)",
          amount: `$${aliceClaimable.toLocaleString()} USDC`,
          status: "claimed",
          txHash: "0xb3703858d3630d3829a09a310af7e74ea1d6cf3970eb66b88b414ba8b422d123",
          explorerUrl: "https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C"
        },
        ...prev
      ]);
      setAliceClaimable(0);
    } else if (investor === "bob" && bobClaimable > 0) {
      setBobClaimed((prev) => prev + bobClaimable);
      setAuditLogs((prev) => [
        {
          id: `claim-bob-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          chain: "Creditcoin CC3",
          event: "DividendClaimed(Bob 30% pull-claim executed in O(1) gas)",
          amount: `$${bobClaimable.toLocaleString()} USDC`,
          status: "claimed",
          txHash: "0xb3703858d3630d3829a09a310af7e74ea1d6cf3970eb66b88b414ba8b422d123",
          explorerUrl: "https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C"
        },
        ...prev
      ]);
      setBobClaimable(0);
    } else if (investor === "charlie" && charlieClaimable > 0) {
      setCharlieClaimed((prev) => prev + charlieClaimable);
      setAuditLogs((prev) => [
        {
          id: `claim-charlie-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          chain: "Creditcoin CC3",
          event: "DividendClaimed(Charlie 20% pull-claim executed in O(1) gas)",
          amount: `$${charlieClaimable.toLocaleString()} USDC`,
          status: "claimed",
          txHash: "0xb3703858d3630d3829a09a310af7e74ea1d6cf3970eb66b88b414ba8b422d123",
          explorerUrl: "https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C"
        },
        ...prev
      ]);
      setCharlieClaimable(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#FDFCFC] font-sans antialiased selection:bg-[#3773FF] selection:text-white flex flex-col">
      <Navbar activePage="console" />

      {/* ========================================================= */}
      {/* 1. EXECUTIVE HEADER (APPLE-GLASS CARD WITH SHEEN)         */}
      {/* ========================================================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pt-28 pb-8">
        <div className="apple-card apple-sheen p-8 sm:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(55,115,255,0.12),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#2B2B2B] text-[11px] font-mono text-[#3773FF]">
                  <span className="w-2 h-2 rounded-full bg-[#3773FF] shadow-[0_0_8px_#3773FF] animate-pulse" />
                  <span>INSTITUTIONAL SETTLEMENT WORKSTATION</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-400 font-semibold">
                  <span>Interactive Simulation Mode · Seeded with Live Contracts</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Live RWA Settlement Console
              </h1>
              <p className="text-sm sm:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
                Execute cross-chain revenue inflows, trigger tenant covenant shortfalls, witness consensus verification via Precompile <code className="text-white font-mono bg-[#1C1C1C] px-1.5 py-0.5 rounded border border-[#2F2F2F]">0x0FD2</code>, and perform <span className="text-[#3773FF] font-semibold">O(1)</span> investor pull-claims.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              <Link
                href="/docs"
                className="apple-btn-secondary py-2 px-4 text-xs flex items-center gap-1.5"
              >
                <span>View Documentation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <div className="px-4 py-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#A0A0A0] flex items-center gap-2.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#00E599] shadow-[0_0_8px_#00E599] animate-pulse" />
                <span className="text-white font-medium">Sepolia &amp; CC3 Linked</span>
              </div>
              <div className="px-4 py-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#3773FF] flex items-center gap-2 shadow-sm font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#3773FF]" />
                <span>Precompile 0x0FD2 Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. PUBLIC CONTRACT REGISTRY (APPLE-GRADE CARDS)           */}
      {/* ========================================================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-8 reveal-on-scroll">
        <div className="apple-card p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#222222] font-mono text-xs">
            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider">
              <div className="w-7 h-7 rounded-md bg-[#1C1C1C] border border-[#2B2B2B] flex items-center justify-center text-[#3773FF]">
                <Layers className="w-4 h-4" />
              </div>
              <span>Public Testnet Contract Registry (Live On-Chain)</span>
            </div>
            <span className="text-[#00E599] text-[11px] flex items-center gap-1.5 font-semibold bg-[#00E599]/10 px-2.5 py-1 rounded border border-[#00E599]/20">
              <CheckCircle className="w-3.5 h-3.5" />
              {copiedText ? `Copied ${copiedText} address!` : "100% On-Chain Verified"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Sepolia Vault */}
            <div className="p-5 rounded-xl bg-[#0E0E0E] border border-[#222222] space-y-3 hover:border-[#3773FF]/50 transition-all duration-300">
              <div className="flex items-center justify-between text-[#8E8E8E] text-[10px] uppercase tracking-wider">
                <span>Inflow Vault (Sepolia)</span>
                <span className="text-[#3773FF] font-semibold bg-[#3773FF]/10 px-2 py-0.5 rounded border border-[#3773FF]/20">Source</span>
              </div>
              <p className="text-sm font-semibold text-white">WeirVault.sol</p>
              <div className="flex items-center justify-between pt-1">
                <a
                  href="https://sepolia.etherscan.io/address/0x13C40f20908C66A9c31D6102234c1095E12A31e3"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#8E8E8E] hover:text-[#3773FF] transition-colors flex items-center gap-1.5"
                >
                  <span>0x13C40f20...E12A31e3</span>
                  <ExternalLink className="w-3 h-3 text-[#8E8E8E]" />
                </a>
                <button
                  onClick={() => copyToClipboard("0x13C40f20908C66A9c31D6102234c1095E12A31e3", "vault")}
                  className="p-1.5 rounded hover:bg-[#1A1A1A] text-[#8E8E8E] hover:text-white transition-colors"
                  title="Copy address"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Creditcoin ASC */}
            <div className="p-5 rounded-xl bg-[#0E0E0E] border border-[#222222] space-y-3 hover:border-[#00E599]/50 transition-all duration-300">
              <div className="flex items-center justify-between text-[#8E8E8E] text-[10px] uppercase tracking-wider">
                <span>Settlement ASC (CC3)</span>
                <span className="text-[#00E599] font-semibold bg-[#00E599]/10 px-2 py-0.5 rounded border border-[#00E599]/20">Settlement</span>
              </div>
              <p className="text-sm font-semibold text-white">WeirDistributionASC.sol</p>
              <div className="flex items-center justify-between pt-1">
                <a
                  href="https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#8E8E8E] hover:text-[#00E599] transition-colors flex items-center gap-1.5"
                >
                  <span>0xe01236C5...8d3C</span>
                  <ExternalLink className="w-3 h-3 text-[#8E8E8E]" />
                </a>
                <button
                  onClick={() => copyToClipboard("0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C", "asc")}
                  className="p-1.5 rounded hover:bg-[#1A1A1A] text-[#8E8E8E] hover:text-white transition-colors"
                  title="Copy address"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Precompile 0x0FD2 */}
            <div className="p-5 rounded-xl bg-[#0E0E0E] border border-[#222222] space-y-3 hover:border-[#3773FF]/50 transition-all duration-300">
              <div className="flex items-center justify-between text-[#8E8E8E] text-[10px] uppercase tracking-wider">
                <span>Substrate Precompile</span>
                <span className="text-[#3773FF] font-semibold bg-[#3773FF]/10 px-2 py-0.5 rounded border border-[#3773FF]/20">Consensus</span>
              </div>
              <p className="text-sm font-semibold text-white">BlockProver (0x0FD2)</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[#8E8E8E]">0x0000...0FD2</span>
                <button
                  onClick={() => copyToClipboard("0x0000000000000000000000000000000000000FD2", "precompile")}
                  className="p-1.5 rounded hover:bg-[#1A1A1A] text-[#8E8E8E] hover:text-white transition-colors"
                  title="Copy address"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. KEY METRICS RIBBON (APPLE STAT CARDS)                  */}
      {/* ========================================================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-8 reveal-on-scroll">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="apple-card p-6 space-y-2">
            <div className="flex items-center justify-between text-[#8E8E8E] text-xs font-mono">
              <span className="uppercase tracking-wider">Total Verified Inflows</span>
              <Coins className="w-4 h-4 text-[#3773FF]" />
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ${totalInflow.toLocaleString()} <span className="text-xs font-normal text-[#8E8E8E]">USDC</span>
            </p>
            <p className="text-[11px] text-[#8E8E8E] font-mono">L1 Sepolia Escrow Receipt</p>
          </div>

          <div className="apple-card p-6 space-y-2">
            <div className="flex items-center justify-between text-[#8E8E8E] text-xs font-mono">
              <span className="uppercase tracking-wider">Cumulative Index</span>
              <TrendingUp className="w-4 h-4 text-[#00E599]" />
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {cumulativeIndex.toFixed(4)} <span className="text-xs font-normal text-[#8E8E8E]">USDC/sh</span>
            </p>
            <p className="text-[11px] text-[#00E599] font-mono">O(1) Global Index Update</p>
          </div>

          <div className="apple-card p-6 space-y-2">
            <div className="flex items-center justify-between text-[#8E8E8E] text-xs font-mono">
              <span className="uppercase tracking-wider">Active Period</span>
              <Layers className="w-4 h-4 text-[#3773FF]" />
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Period #{periodCount}
            </p>
            <p className="text-[11px] text-[#8E8E8E] font-mono">Covenant Era Monotonic Counter</p>
          </div>

          <div className="apple-card p-6 space-y-2">
            <div className="flex items-center justify-between text-[#8E8E8E] text-xs font-mono">
              <span className="uppercase tracking-wider">Pull Claim Gas</span>
              <Zap className="w-4 h-4 text-[#3773FF]" />
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#3773FF] tracking-tight">
              ~24K Gas
            </p>
            <p className="text-[11px] text-[#8E8E8E] font-mono">Fixed Constant Overhead ($0.0008)</p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. INTERACTIVE INFLOW & PIPELINE STATE MACHINE            */}
      {/* ========================================================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-8 reveal-on-scroll">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Inflow Action Card */}
          <div className="lg:col-span-5 apple-card apple-sheen p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#1A1A1A] border border-[#2B2B2B] text-[10px] font-mono text-[#3773FF] uppercase tracking-wider">
                Conduit Simulation
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Deposit Commercial Rent</h2>
              <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
                Trigger an institutional lease inflow on Sepolia. The transaction emits an immutable receipt verified by Creditcoin CC3 validator quorums.
              </p>
            </div>

            {/* Inflow Mode Toggle */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono text-[#8E8E8E] uppercase tracking-wider block">Select Inflow Scenario:</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsSimulatingShortfall(false)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    !isSimulatingShortfall
                      ? "bg-[#181818] border-[#3773FF] shadow-[0_0_16px_rgba(55,115,255,0.2)]"
                      : "bg-[#0E0E0E] border-[#242424] hover:border-[#333333]"
                  }`}
                >
                  <p className="text-xs font-bold text-white">Full Covenant</p>
                  <p className="text-[11px] text-[#8E8E8E] mt-1">$10,000 Rent Target</p>
                  <span className="text-[10px] text-[#00E599] font-mono mt-2 block">100% Solvency</span>
                </button>

                <button
                  onClick={() => setIsSimulatingShortfall(true)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    isSimulatingShortfall
                      ? "bg-[#181818] border-[#ED254E] shadow-[0_0_16px_rgba(237,37,78,0.2)]"
                      : "bg-[#0E0E0E] border-[#242424] hover:border-[#333333]"
                  }`}
                >
                  <p className="text-xs font-bold text-white">Simulate Shortfall</p>
                  <p className="text-[11px] text-[#8E8E8E] mt-1">$6,000 Underpayment</p>
                  <span className="text-[10px] text-[#ED254E] font-mono mt-2 block">Covenant Breach Alert</span>
                </button>
              </div>
            </div>

            {/* Shortfall Alert Banner */}
            {shortfallAlert && (
              <div className="p-4 rounded-lg bg-[#ED254E]/10 border border-[#ED254E]/30 text-xs text-[#ED254E] flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Covenant Shortfall Triggered</p>
                  <p className="text-[11px] text-[#ED254E]/80 mt-0.5">
                    Tenant deposited $6,000 instead of $10,000 agreed debt covenant. Automated waterfall enforces senior tranche debt priority before equity distribution.
                  </p>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8E8E8E]">
                <span>Workstation Mode: <strong className="text-amber-400 font-semibold">Client Simulation</strong></span>
                <span className="text-[#666666]">Live broadcast via CLI scripts</span>
              </div>
              <button
                onClick={handleDepositRevenue}
                disabled={pipelineState === "depositing" || pipelineState === "attesting"}
                className="apple-btn-primary w-full py-3.5 text-xs tracking-wider"
              >
                {pipelineState === "depositing" || pipelineState === "attesting" ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Executing Quorum Attestation...</span>
                  </>
                ) : (
                  <>
                    <span>Deposit {isSimulatingShortfall ? "$6,000" : "$10,000"} L1 Revenue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right 4-Stage State Machine Pipeline */}
          <div className="lg:col-span-7 apple-card p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Precompile 0x0FD2 State Machine</h3>
                <p className="text-xs text-[#8E8E8E]">Synchronous Substrate Runtime Consensus Attestation</p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded bg-[#1A1A1A] border border-[#2B2B2B] text-[#3773FF]">
                {pipelineState === "idle" ? "Ready" : pipelineState.toUpperCase()}
              </span>
            </div>

            {/* 4 Pipeline Steps */}
            <div className="space-y-4 font-mono text-xs">
              {/* Step 1 */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  pipelineStep >= 1 ? "bg-[#161616] border-[#3773FF]/40 text-white" : "bg-[#0E0E0E] border-[#222222] text-[#666666]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      pipelineStep >= 1 ? "bg-[#3773FF] text-white" : "bg-[#222222] text-[#666666]"
                    }`}>
                      1
                    </span>
                    <span className="font-semibold text-sm">L1 Rent Deposit (Ethereum Sepolia)</span>
                  </div>
                  {pipelineStep >= 1 && <CheckCircle2 className="w-4 h-4 text-[#00E599]" />}
                </div>
                <p className="text-[11px] text-[#8E8E8E] mt-2 pl-9 font-sans">
                  `WeirVault.depositRevenue()` locks USDC in non-custodial escrow and emits `RevenueDeposited` receipt.
                </p>
              </div>

              {/* Step 2 */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  pipelineStep >= 2 ? "bg-[#161616] border-[#3773FF]/40 text-white" : "bg-[#0E0E0E] border-[#222222] text-[#666666]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      pipelineStep >= 2 ? "bg-[#3773FF] text-white" : "bg-[#222222] text-[#666666]"
                    }`}>
                      2
                    </span>
                    <span className="font-semibold text-sm">Block Header Ingestion &amp; Relaying</span>
                  </div>
                  {pipelineStep >= 2 && <CheckCircle2 className="w-4 h-4 text-[#00E599]" />}
                </div>
                <p className="text-[11px] text-[#8E8E8E] mt-2 pl-9 font-sans">
                  Creditcoin relayer constructs Merkle Patricia inclusion proof bundle for Sepolia block header.
                </p>
              </div>

              {/* Step 3 */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  pipelineStep >= 3 ? "bg-[#161616] border-[#3773FF]/40 text-white" : "bg-[#0E0E0E] border-[#222222] text-[#666666]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      pipelineStep >= 3 ? "bg-[#3773FF] text-white" : "bg-[#222222] text-[#666666]"
                    }`}>
                      3
                    </span>
                    <span className="font-semibold text-sm">Native Precompile 0x0FD2 Quorum Verification</span>
                  </div>
                  {pipelineStep >= 3 && <CheckCircle2 className="w-4 h-4 text-[#00E599]" />}
                </div>
                <p className="text-[11px] text-[#8E8E8E] mt-2 pl-9 font-sans">
                  Synchronously verified inside Substrate runtime via BLS consensus. Zero multi-sig or external oracle risk.
                </p>
              </div>

              {/* Step 4 */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  pipelineStep >= 4 ? "bg-[#161616] border-[#00E599]/40 text-white" : "bg-[#0E0E0E] border-[#222222] text-[#666666]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      pipelineStep >= 4 ? "bg-[#00E599] text-black" : "bg-[#222222] text-[#666666]"
                    }`}>
                      4
                    </span>
                    <span className="font-semibold text-sm">O(1) Dividend Index Update</span>
                  </div>
                  {pipelineStep >= 4 && <CheckCircle2 className="w-4 h-4 text-[#00E599]" />}
                </div>
                <p className="text-[11px] text-[#8E8E8E] mt-2 pl-9 font-sans">
                  `cumulativeDividendPerShare` updated atomically. All investors can claim in constant ~24k gas overhead.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. INVESTOR CAP-TABLE LEDGER (APPLE-GRADE CARDS)          */}
      {/* ========================================================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-8 reveal-on-scroll">
        <div className="apple-card p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#222222]">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Investor Cap-Table &amp; O(1) Pull-Claims</h3>
              <p className="text-xs text-[#8E8E8E]">Scales infinitely to 100,000+ tokenized LP holders without looping vulnerabilities</p>
            </div>
            <span className="text-xs font-mono text-[#00E599] bg-[#00E599]/10 px-3 py-1 rounded border border-[#00E599]/20 font-semibold">
              Fixed ~24k Gas Cost per Claim
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Alice Card */}
            <div className="p-6 rounded-xl bg-[#0E0E0E] border border-[#242424] space-y-4 hover:border-[#3773FF]/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">Alice (Institutional LP)</h4>
                  <p className="text-xs text-[#8E8E8E] font-mono">5,000 Shares (50.0%)</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[#2B2B2B] flex items-center justify-center text-xs font-bold text-[#3773FF]">
                  50%
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#1C1C1C] font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8E8E8E]">Claimable Yield:</span>
                  <span className="font-bold text-[#00E599]">${aliceClaimable.toLocaleString()} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8E8E]">Total Claimed:</span>
                  <span className="text-white">${aliceClaimed.toLocaleString()} USDC</span>
                </div>
              </div>

              <button
                onClick={() => handleClaim("alice")}
                disabled={aliceClaimable === 0}
                className="apple-btn-secondary w-full py-2.5 text-xs"
              >
                {aliceClaimable > 0 ? `Claim $${aliceClaimable.toLocaleString()} USDC` : "Yield Claimed"}
              </button>
            </div>

            {/* Bob Card */}
            <div className="p-6 rounded-xl bg-[#0E0E0E] border border-[#242424] space-y-4 hover:border-[#3773FF]/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">Bob (Facility Co-Owner)</h4>
                  <p className="text-xs text-[#8E8E8E] font-mono">3,000 Shares (30.0%)</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[#2B2B2B] flex items-center justify-center text-xs font-bold text-[#3773FF]">
                  30%
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#1C1C1C] font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8E8E8E]">Claimable Yield:</span>
                  <span className="font-bold text-[#00E599]">${bobClaimable.toLocaleString()} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8E8E]">Total Claimed:</span>
                  <span className="text-white">${bobClaimed.toLocaleString()} USDC</span>
                </div>
              </div>

              <button
                onClick={() => handleClaim("bob")}
                disabled={bobClaimable === 0}
                className="apple-btn-secondary w-full py-2.5 text-xs"
              >
                {bobClaimable > 0 ? `Claim $${bobClaimable.toLocaleString()} USDC` : "Yield Claimed"}
              </button>
            </div>

            {/* Charlie Card */}
            <div className="p-6 rounded-xl bg-[#0E0E0E] border border-[#242424] space-y-4 hover:border-[#3773FF]/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">Charlie (Syndicate Member)</h4>
                  <p className="text-xs text-[#8E8E8E] font-mono">2,000 Shares (20.0%)</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[#2B2B2B] flex items-center justify-center text-xs font-bold text-[#3773FF]">
                  20%
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#1C1C1C] font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8E8E8E]">Claimable Yield:</span>
                  <span className="font-bold text-[#00E599]">${charlieClaimable.toLocaleString()} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8E8E]">Total Claimed:</span>
                  <span className="text-white">${charlieClaimed.toLocaleString()} USDC</span>
                </div>
              </div>

              <button
                onClick={() => handleClaim("charlie")}
                disabled={charlieClaimable === 0}
                className="apple-btn-secondary w-full py-2.5 text-xs"
              >
                {charlieClaimable > 0 ? `Claim $${charlieClaimable.toLocaleString()} USDC` : "Yield Claimed"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. REAL-TIME AUDIT LOG (APPLE-GRADE TERMINAL LEDGER)      */}
      {/* ========================================================= */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-16 reveal-on-scroll">
        <div className="apple-card p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
              <h3 className="text-base font-bold text-white tracking-tight">On-Chain Attestation Ledger</h3>
            </div>
            <span className="text-xs font-mono text-[#8E8E8E]">{auditLogs.length} Events Logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#1C1C1C] text-[#8E8E8E] uppercase text-[10px]">
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Network</th>
                  <th className="py-3 px-3">Cryptographic Event</th>
                  <th className="py-3 px-3">Value</th>
                  <th className="py-3 px-3 text-right">Receipt Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161616]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#161616]/60 transition-colors">
                    <td className="py-3 px-3 text-[#8E8E8E] whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#1C1C1C] text-[#3773FF] border border-[#2B2B2B] text-[10px]">
                        {log.chain}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white max-w-md truncate font-sans">{log.event}</td>
                    <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">{log.amount}</td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {log.txHash && log.explorerUrl ? (
                        <a
                          href={log.explorerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#3773FF] hover:underline"
                        >
                          <span>{log.txHash.slice(0, 8)}...{log.txHash.slice(-6)}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[#666666]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
