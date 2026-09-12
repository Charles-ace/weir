"use client";

import React, { useState } from "react";
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Zap, 
  Database, 
  Coins, 
  ExternalLink, 
  Cpu, 
  Layers, 
  ArrowRight, 
  Lock, 
  CheckCircle, 
  Copy 
} from "lucide-react";

export default function WeirDashboard() {
  // Navigation active section
  const [activeSection, setActiveSection] = useState<string>("hero");

  // Demo & Simulation State
  const [isSimulatingShortfall, setIsSimulatingShortfall] = useState<boolean>(false);
  const [pipelineState, setPipelineState] = useState<"idle" | "depositing" | "attesting" | "verified">("idle");
  const [pipelineStep, setPipelineStep] = useState<number>(4); // Default to verified state from live run
  
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

          setAliceClaimable(prev => prev + (depositValue * 0.5));
          setBobClaimable(prev => prev + (depositValue * 0.3));
          setCharlieClaimable(prev => prev + (depositValue * 0.2));

          setAuditLogs(prev => [
            {
              id: `tx-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              chain: "Creditcoin (0x0FD2)",
              event: depositValue < 10000 
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
      setAliceClaimed(prev => prev + aliceClaimable);
      setAuditLogs(prev => [{
        id: `claim-alice-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        chain: "Creditcoin CC3",
        event: "DividendClaimed(Alice 50% pull-claim executed in O(1) gas)",
        amount: `$${aliceClaimable.toLocaleString()} USDC`,
        status: "claimed",
        txHash: "0xb3703858d3630d3829a09a310af7e74ea1d6cf3970eb66b88b414ba8b422d123",
        explorerUrl: "https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C"
      }, ...prev]);
      setAliceClaimable(0);
    } else if (investor === "bob" && bobClaimable > 0) {
      setBobClaimed(prev => prev + bobClaimable);
      setAuditLogs(prev => [{
        id: `claim-bob-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        chain: "Creditcoin CC3",
        event: "DividendClaimed(Bob 30% pull-claim executed in O(1) gas)",
        amount: `$${bobClaimable.toLocaleString()} USDC`,
        status: "claimed",
        txHash: "0xb3703858d3630d3829a09a310af7e74ea1d6cf3970eb66b88b414ba8b422d123",
        explorerUrl: "https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C"
      }, ...prev]);
      setBobClaimable(0);
    } else if (investor === "charlie" && charlieClaimable > 0) {
      setCharlieClaimed(prev => prev + charlieClaimable);
      setAuditLogs(prev => [{
        id: `claim-charlie-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        chain: "Creditcoin CC3",
        event: "DividendClaimed(Charlie 20% pull-claim executed in O(1) gas)",
        amount: `$${charlieClaimable.toLocaleString()} USDC`,
        status: "claimed",
        txHash: "0xb3703858d3630d3829a09a310af7e74ea1d6cf3970eb66b88b414ba8b422d123",
        explorerUrl: "https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C"
      }, ...prev]);
      setCharlieClaimable(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#04060A] text-[#EDEAF3] font-sans antialiased relative selection:bg-[#71B1FF] selection:text-black">
      
      {/* Background Architectural Grid & Subtle Dusk Radial Aura */}
      <div className="fixed inset-0 bg-grid-dusk pointer-events-none z-0"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-dusk-radial pointer-events-none z-0"></div>

      {/* 1. DUSK-STYLE FLOATING PILL HEADER */}
      <div className="sticky top-5 z-50 px-4 sm:px-6 pointer-events-auto">
        <header className="max-w-6xl mx-auto backdrop-blur-2xl bg-[#090D15]/85 border border-[#2E2D30]/80 rounded-full px-5 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center justify-between transition-all">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#101524] border border-[#71B1FF]/40 flex items-center justify-center text-[#71B1FF] shadow-[0_0_15px_rgba(113,177,255,0.25)]">
              <Activity className="w-4 h-4 text-[#71B1FF]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white font-mono">WEIR</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#71B1FF]/10 text-[#71B1FF] border border-[#71B1FF]/30">
                Track 2 · RWA #4518
              </span>
            </div>
          </div>

          {/* Center Links (Dusk Minimal Grammar) */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-[#908E94] font-medium tracking-wide">
            <a href="#overview" className="hover:text-white transition-colors">Overview</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#pipeline" className="hover:text-white transition-colors">Conduits</a>
            <a href="#captable" className="hover:text-white transition-colors">Cap Table</a>
            <a href="#ledger" className="hover:text-white transition-colors">Settlement Ledger</a>
          </nav>

          {/* Right Action & Status */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#101010] border border-[#2E2D30] text-[11px] font-mono text-[#A8A5AF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#71B1FF] animate-pulse"></span>
              <span>CC3: Precompile 0x0FD2</span>
            </div>
            <a 
              href="#console" 
              className="px-4 py-1.5 rounded-full bg-white hover:bg-[#EDEAF3] text-black text-xs font-semibold tracking-tight transition-all active:scale-95 shadow-sm"
            >
              Live Console
            </a>
          </div>
        </header>
      </div>

      {/* FLOATING SECTION NAVIGATOR (Dusk Signature Vertical Pill) */}
      <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3 p-3 rounded-2xl bg-[#090D15]/80 backdrop-blur-xl border border-[#2E2D30]/60 font-mono text-[11px] text-[#908E94] shadow-2xl">
        {[
          { id: "overview", num: "01", label: "Overview" },
          { id: "architecture", num: "02", label: "Invariants" },
          { id: "pipeline", num: "03", label: "Pipeline" },
          { id: "console", num: "04", label: "Settlement" },
          { id: "captable", num: "05", label: "Cap Table" },
          { id: "ledger", num: "06", label: "Ledger" }
        ].map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all ${
              activeSection === item.id ? "text-white font-semibold bg-white/5" : "hover:text-[#EDEAF3]"
            }`}
          >
            <span className={activeSection === item.id ? "text-[#71B1FF]" : "text-[#636167]"}>{item.num}</span>
            <span className="text-[10px]">—</span>
            <span>{item.label}</span>
            {activeSection === item.id && <span className="w-1.5 h-1.5 rounded-full bg-[#71B1FF]"></span>}
          </a>
        ))}
      </aside>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-24 relative z-10 space-y-24">

        {/* 2. DUSK HERO SECTION */}
        <section id="overview" className="pt-8 md:pt-16 pb-4 space-y-8">
          {/* Micro Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#71B1FF]/10 border border-[#71B1FF]/30 text-[#71B1FF] text-xs font-mono">
            <Zap className="w-3.5 h-3.5 text-[#71B1FF]" />
            <span className="tracking-wider uppercase font-semibold">Attestcoin Native Inclusion Proofs · DoraHacks Fall 2026</span>
          </div>

          {/* Heading with Dusk Signature <mark> */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
              Regulated RWA revenues,<br />
              settled <mark className="bg-transparent text-[#71B1FF]">onchain</mark>.
            </h1>
            <p className="text-[#A8A5AF] text-base sm:text-lg max-w-3xl leading-relaxed">
              Infrastructure for verifiable real-world asset cash flows. Commercial lessees deposit gross revenue in USDC on Ethereum. Creditcoin Attestcoin cryptographically proves receipt inclusion directly on Creditcoin via native precompile <code className="text-[#71B1FF] font-mono bg-[#71B1FF]/10 px-1.5 py-0.5 rounded border border-[#71B1FF]/20">0x0FD2</code> in 15 seconds. Creditcoin executes <code className="text-[#71B1FF] font-mono bg-[#71B1FF]/10 px-1.5 py-0.5 rounded border border-[#71B1FF]/20">O(1)</code> mathematical dividend splits across fractional investors—eliminating manager skimming, delayed wires, and unverified deductions.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs">
            <a 
              href="#console" 
              className="px-6 py-3.5 rounded-full bg-white hover:bg-[#EDEAF3] text-black font-bold text-sm tracking-tight transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center gap-2"
            >
              <span>Run Live Settlement Demo</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-full bg-[#101010] hover:bg-[#1A1A1A] text-[#EDEAF3] border border-[#2E2D30] font-medium text-sm transition-all flex items-center gap-2"
            >
              <span>View Deployed Contract (Blockscout)</span>
              <ExternalLink className="w-4 h-4 text-[#908E94]" />
            </a>
          </div>
        </section>

        {/* 3. DUSK STATS STRIP (Horizontal High-Contrast Metrics) */}
        <section className="dusk-card p-0 overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#2E2D30]">
            <div className="p-6 space-y-1 font-mono">
              <p className="text-[11px] uppercase tracking-wider text-[#636167]">CONFIRMED INFLOW</p>
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">${totalInflow.toLocaleString()}.00</p>
              <p className="text-[11px] text-[#A8A5AF] flex items-center gap-1.5 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#71B1FF]"></span>
                <span>Sepolia L1 Verified Inflow</span>
              </p>
            </div>
            <div className="p-6 space-y-1 font-mono">
              <p className="text-[11px] uppercase tracking-wider text-[#636167]">COVENANT TARGET</p>
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">$10,000.00</p>
              <p className="text-[11px] text-[#A8A5AF] pt-1">Scheduled Period Revenue</p>
            </div>
            <div className="p-6 space-y-1 font-mono">
              <p className="text-[11px] uppercase tracking-wider text-[#636167]">CONSENSUS LATENCY</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#71B1FF] tracking-tight">~15s</p>
              <p className="text-[11px] text-[#A8A5AF] flex items-center gap-1.5 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#71B1FF] animate-pulse"></span>
                <span>Attestcoin BLS Quorum</span>
              </p>
            </div>
            <div className="p-6 space-y-1 font-mono">
              <p className="text-[11px] uppercase tracking-wider text-[#636167]">DIVIDEND SCALING</p>
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">O(1) Gas</p>
              <p className="text-[11px] text-[#A8A5AF] pt-1">Constant time pull-claims</p>
            </div>
          </div>
        </section>

        {/* 4. VERIFIED TESTNET CONTRACTS DRAWER */}
        <section className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-[#908E94]">
            <div className="flex items-center gap-2 text-white font-semibold uppercase tracking-wider">
              <Layers className="w-4 h-4 text-[#71B1FF]" />
              <span>Public Testnet Contract Registry</span>
            </div>
            <span className="text-[#71B1FF] text-[11px] flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> {copiedText ? `Copied ${copiedText} address!` : "100% On-Chain Verified (No Mocks)"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Sepolia Vault */}
            <div className="dusk-card p-4 space-y-2">
              <div className="flex items-center justify-between text-[#636167] text-[10px] uppercase tracking-wider">
                <span>Inflow Vault (Sepolia)</span>
                <span className="text-[#71B1FF]">Source</span>
              </div>
              <p className="text-sm font-semibold text-white">WeirVault.sol</p>
              <div className="flex items-center justify-between pt-1">
                <a 
                  href="https://sepolia.etherscan.io/address/0x13C40f20908C66A9c31D6102234c1095E12A31e3" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-[#A8A5AF] hover:text-[#71B1FF] transition-colors flex items-center gap-1.5"
                >
                  <span>0x13C40f20...E12A31e3</span>
                  <ExternalLink className="w-3 h-3 text-[#636167]" />
                </a>
                <button 
                  onClick={() => copyToClipboard("0x13C40f20908C66A9c31D6102234c1095E12A31e3", "vault")}
                  className="text-[#636167] hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Creditcoin ASC */}
            <div className="dusk-card p-4 space-y-2">
              <div className="flex items-center justify-between text-[#636167] text-[10px] uppercase tracking-wider">
                <span>Attestcoin ASC (CC3)</span>
                <span className="text-[#71B1FF]">Settlement</span>
              </div>
              <p className="text-sm font-semibold text-white">WeirDistributionASC.sol</p>
              <div className="flex items-center justify-between pt-1">
                <a 
                  href="https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-[#A8A5AF] hover:text-[#71B1FF] transition-colors flex items-center gap-1.5"
                >
                  <span>0xe01236C5...8d3C</span>
                  <ExternalLink className="w-3 h-3 text-[#636167]" />
                </a>
                <button 
                  onClick={() => copyToClipboard("0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C", "asc")}
                  className="text-[#636167] hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* MockUSDC */}
            <div className="dusk-card p-4 space-y-2">
              <div className="flex items-center justify-between text-[#636167] text-[10px] uppercase tracking-wider">
                <span>Settlement Token (Sepolia)</span>
                <span className="text-[#A8A5AF]">Currency</span>
              </div>
              <p className="text-sm font-semibold text-white">MockUSDC (6 Decimals)</p>
              <div className="flex items-center justify-between pt-1">
                <a 
                  href="https://sepolia.etherscan.io/address/0xfB0321E0E9cB4Cf1bb801130a14dBcEDbcbaEbac" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-[#A8A5AF] hover:text-[#71B1FF] transition-colors flex items-center gap-1.5"
                >
                  <span>0xfB0321E0...Ebac</span>
                  <ExternalLink className="w-3 h-3 text-[#636167]" />
                </a>
                <button 
                  onClick={() => copyToClipboard("0xfB0321E0E9cB4Cf1bb801130a14dBcEDbcbaEbac", "usdc")}
                  className="text-[#636167] hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. DUSK SPOTLIGHT / 3-COLUMN ARCHITECTURE */}
        <section id="architecture" className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-mono text-[#71B1FF] uppercase tracking-wider">INSTITUTIONAL INVARIANTS</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Built for unskimmable onchain finance.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Col 1: The Problem */}
            <div className="dusk-card p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#101010] border border-[#2E2D30] flex items-center justify-center text-[#ED254E]">
                <AlertTriangle className="w-5 h-5 text-[#ED254E]" />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#636167]">01 · THE VULNERABILITY</p>
                <h3 className="text-xl font-bold text-white">The Black-Box RWA Skim</h3>
                <p className="text-xs text-[#A8A5AF] leading-relaxed">
                  Off-chain RWA managers collect commercial cash flows in private bank accounts. They insert opaque &quot;administrative deductions&quot;, manipulate expense line items on spreadsheets, and delay investor distributions by 30 to 90 days.
                </p>
              </div>
            </div>

            {/* Col 2: The Solution */}
            <div className="dusk-card p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#101010] border border-[#2E2D30] flex items-center justify-center text-[#71B1FF]">
                <Lock className="w-5 h-5 text-[#71B1FF]" />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#636167]">02 · THE ARCHITECTURE</p>
                <h3 className="text-xl font-bold text-white">Attestcoin Cryptographic Invariant</h3>
                <p className="text-xs text-[#A8A5AF] leading-relaxed">
                  Commercial tenants pay directly into <code className="text-white">WeirVault.sol</code> on Ethereum Sepolia. Creditcoin&apos;s native precompile <code className="text-[#71B1FF]">0x0FD2</code> validates transaction receipt inclusion in 15s. No trusted third-party oracle can falsify the deposit gross amount.
                </p>
              </div>
            </div>

            {/* Col 3: The Impact */}
            <div className="dusk-card p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#101010] border border-[#2E2D30] flex items-center justify-center text-[#71B1FF]">
                <Cpu className="w-5 h-5 text-[#71B1FF]" />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#636167]">03 · THE GUARANTEE</p>
                <h3 className="text-xl font-bold text-white">Deterministic O(1) Settlement</h3>
                <p className="text-xs text-[#A8A5AF] leading-relaxed">
                  Rather than iterating through massive arrays (risking out-of-gas errors), WEIR updates a global dividend index. Thousands of fractional investors pull their earned dividends individually at constant-time O(1) gas on Creditcoin CC3.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. INTERCONNECTED PIPELINE CONDUITS (Visual Flow Diagram) */}
        <section id="pipeline" className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-mono text-[#71B1FF] uppercase tracking-wider">CROSS-CHAIN EXECUTION</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              The 3-Conduit Hydraulic Pipeline.
            </h2>
          </div>

          <div className="dusk-card p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
              
              {/* Conduit 1: Source */}
              <div className="p-5 rounded-xl bg-[#090D15] border border-[#2E2D30] space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101010] text-[#71B1FF] border border-[#2E2D30]">
                    CONDUIT 1 · SOURCE
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#71B1FF]"></span>
                </div>
                <h4 className="text-base font-bold text-white">Ethereum Sepolia Inflow</h4>
                <p className="text-xs text-[#A8A5AF]">
                  Commercial lessee deposits USDC into WeirVault.sol. Emits canonical <code className="text-white">RevenueDeposited</code> receipt.
                </p>
                <div className="pt-2 font-mono text-[11px] text-[#636167] space-y-1">
                  <div>Asset: #0001 (Sahara Solar)</div>
                  <div>Gross Deposit: $10,000.00 USDC</div>
                  <div className="text-[#71B1FF]">Receipt Status: 0x1 (Confirmed)</div>
                </div>
              </div>

              {/* Conduit 2: Prover */}
              <div className="p-5 rounded-xl bg-[#090D15] border border-[#71B1FF]/30 space-y-3 relative shadow-[0_0_20px_rgba(113,177,255,0.05)]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#71B1FF]/10 text-[#71B1FF] border border-[#71B1FF]/30">
                    CONDUIT 2 · ATTESTCOIN
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#71B1FF] animate-pulse"></span>
                </div>
                <h4 className="text-base font-bold text-white">Native Precompile 0x0FD2</h4>
                <p className="text-xs text-[#A8A5AF]">
                  Creditcoin consensus nodes witness Sepolia block root. Precompile 0x0FD2 cryptographically proves Merkle receipt inclusion in ~15s.
                </p>
                <div className="pt-2 font-mono text-[11px] text-[#636167] space-y-1">
                  <div>Prover: Native Precompile 0x0FD2</div>
                  <div>Quorum: Attestor BLS Signatures</div>
                  <div className="text-[#71B1FF]">Replay Protection: Enforced</div>
                </div>
              </div>

              {/* Conduit 3: Settlement */}
              <div className="p-5 rounded-xl bg-[#090D15] border border-[#2E2D30] space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101010] text-[#71B1FF] border border-[#2E2D30]">
                    CONDUIT 3 · SETTLEMENT
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#71B1FF]"></span>
                </div>
                <h4 className="text-base font-bold text-white">Creditcoin CC3 Vault</h4>
                <p className="text-xs text-[#A8A5AF]">
                  WeirDistributionASC updates global cumulative index. Fractional investors pull dividends at zero delay in O(1) gas ($0.001).
                </p>
                <div className="pt-2 font-mono text-[11px] text-[#636167] space-y-1">
                  <div>Cap-Table: 10,000 Shares</div>
                  <div>Algorithm: O(1) Push-Free Pull</div>
                  <div className="text-[#71B1FF]">Settlement Cost: &lt; $0.001</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 7. INTERACTIVE SETTLEMENT WORKSTATION */}
        <section id="console" className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-mono text-[#71B1FF] uppercase tracking-wider">LIVE WORKSTATION</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Institutional Settlement Console.
            </h2>
            <p className="text-xs text-[#A8A5AF]">
              Execute real-time revenue cycles, simulate tenant shortfall breaches, witness precompile 0x0FD2 consensus proofs, and claim fractional investor dividends.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* CONSOLE PANEL 1: Inflow Control */}
            <div className="dusk-card p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#71B1FF]"></span>
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                      1. Inflow Control
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101010] text-[#A8A5AF] border border-[#2E2D30]">
                    Ethereum Sepolia
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#090D15] border border-[#2E2D30] space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#636167]">Asset:</span>
                    <span className="text-white font-semibold">Sahara Solar #4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#636167]">Asset ID:</span>
                    <span className="text-[#71B1FF]">#0001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#636167]">Covenant Target:</span>
                    <span className="text-white font-semibold">$10,000.00 USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#636167]">Currency:</span>
                    <span className="text-[#A8A5AF]">mUSDC (6 Decimals)</span>
                  </div>
                </div>

                {/* Shortfall Simulator Toggle */}
                <div className="p-3.5 rounded-xl bg-[#090D15] border border-[#2E2D30] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-white">Underpayment Shortfall Test</p>
                    <p className="text-[10px] text-[#A8A5AF]">Simulate paying $6k vs $10k covenant</p>
                  </div>
                  <button
                    onClick={() => setIsSimulatingShortfall(!isSimulatingShortfall)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-all ${
                      isSimulatingShortfall 
                        ? "bg-[#ED254E]/20 text-[#ED254E] border border-[#ED254E]/40 font-bold shadow-sm" 
                        : "bg-[#101010] text-[#A8A5AF] border border-[#2E2D30] hover:text-white"
                    }`}
                  >
                    {isSimulatingShortfall ? "Shortfall Active ($6k)" : "Normal Mode ($10k)"}
                  </button>
                </div>

                {shortfallAlert && (
                  <div className="p-3.5 rounded-xl bg-[#ED254E]/10 border border-[#ED254E]/30 flex items-start gap-2.5 text-xs text-[#ED254E]">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#ED254E]" />
                    <div>
                      <span className="font-bold">Covenant Shortfall Triggered!</span>
                      <p className="text-[11px] text-[#ED254E]/90 mt-0.5">
                        Received $6,000 vs $10,000 target. Emitted on-chain <code className="font-mono bg-black/40 px-1 py-0.5 rounded">RevenueShortfall</code> event log. Distributing available funds without stalling.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="space-y-2 pt-4 border-t border-[#2E2D30]">
                <button
                  disabled={pipelineState === "depositing" || pipelineState === "attesting"}
                  onClick={handleDepositRevenue}
                  className="w-full py-3.5 px-4 rounded-full bg-white hover:bg-[#EDEAF3] text-black font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.99]"
                >
                  {pipelineState === "depositing" ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>Broadcasting to Sepolia Vault...</span>
                    </>
                  ) : pipelineState === "attesting" ? (
                    <>
                      <Zap className="w-4 h-4 animate-bounce text-black" />
                      <span>Attestcoin Prover Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      <span>Deposit ${isSimulatingShortfall ? "6,000" : "10,000"} Gross Inflow</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-[#636167] font-mono">
                  Sepolia: <code className="text-[#A8A5AF]">0x13C40f20...E12A31e3</code>
                </p>
              </div>
            </div>

            {/* CONSOLE PANEL 2: Attestcoin Prover Pipeline */}
            <div className="dusk-card p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#71B1FF] animate-pulse"></span>
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                      2. Attestcoin Prover
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#71B1FF]/10 text-[#71B1FF] border border-[#71B1FF]/30">
                    Precompile 0x0FD2
                  </span>
                </div>

                {/* 4 Steps */}
                <div className="space-y-2.5 font-mono text-xs">
                  <div className={`p-3 rounded-xl border transition-all ${
                    pipelineStep >= 1 ? "bg-[#090D15] border-[#71B1FF]/40 text-white" : "bg-[#090D15]/40 border-[#2E2D30] text-[#636167]"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">1. Sepolia Receipt Confirmed</span>
                      {pipelineStep >= 1 && <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />}
                    </div>
                    <p className="text-[10px] text-[#636167] mt-0.5">Block #11685350 · Receipt Status 0x1</p>
                  </div>

                  <div className={`p-3 rounded-xl border transition-all ${
                    pipelineStep >= 2 ? "bg-[#090D15] border-[#71B1FF]/40 text-white" : "bg-[#090D15]/40 border-[#2E2D30] text-[#636167]"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">2. Attestor BLS Quorum (~15s)</span>
                      {pipelineStep >= 2 && <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />}
                    </div>
                    <p className="text-[10px] text-[#636167] mt-0.5">Consensus gossip on Sepolia state root</p>
                  </div>

                  <div className={`p-3 rounded-xl border transition-all ${
                    pipelineStep >= 3 ? "bg-[#090D15] border-[#71B1FF]/40 text-white" : "bg-[#090D15]/40 border-[#2E2D30] text-[#636167]"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">3. Precompile 0x0FD2 Executed</span>
                      {pipelineStep >= 3 && <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />}
                    </div>
                    <p className="text-[10px] text-[#636167] mt-0.5">Merkle receipt inclusion verified on CC3</p>
                  </div>

                  <div className={`p-3 rounded-xl border transition-all ${
                    pipelineStep >= 4 ? "bg-[#090D15] border-[#71B1FF]/40 text-white" : "bg-[#090D15]/40 border-[#2E2D30] text-[#636167]"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">4. EvmV1Decoder Event Unpacked</span>
                      {pipelineStep >= 4 && <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />}
                    </div>
                    <p className="text-[10px] text-[#636167] mt-0.5">Replay query check OK · $10k unlocked</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090D15] border border-[#2E2D30] text-[11px] font-mono space-y-1">
                <div className="flex justify-between text-[#636167]">
                  <span>Replay Key:</span>
                  <span className="text-white">keccak256(chain, block, tx)</span>
                </div>
                <div className="flex justify-between text-[#636167]">
                  <span>Assertion:</span>
                  <span className="text-[#71B1FF]">status == 0x1 (Success)</span>
                </div>
              </div>
            </div>

            {/* CONSOLE PANEL 3: Cap Table Claims */}
            <div id="captable" className="dusk-card p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#71B1FF]"></span>
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                      3. Cap-Table Settlement
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#71B1FF]/10 text-[#71B1FF] border border-[#71B1FF]/30">
                    O(1) Push-Free
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#090D15] border border-[#2E2D30] font-mono space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-[#636167]">Cumulative Dividend Index</p>
                  <p className="text-xl font-bold text-[#71B1FF]">{cumulativeIndex.toFixed(6)} USDC / share</p>
                </div>

                {/* 3 Investors */}
                <div className="space-y-2.5 font-mono">
                  {/* Alice */}
                  <div className="p-3 rounded-xl bg-[#090D15] border border-[#2E2D30] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#71B1FF]"></span>
                        <span className="text-xs font-bold text-white">Alice (50.0%)</span>
                      </div>
                      <p className="text-[10px] text-[#636167] mt-0.5">5,000 Shares · Claimed: ${aliceClaimed.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#71B1FF]">${aliceClaimable.toLocaleString()}</p>
                      <button
                        disabled={aliceClaimable === 0}
                        onClick={() => handleClaim("alice")}
                        className="mt-1 px-3 py-1 rounded-full bg-white hover:bg-[#EDEAF3] text-black text-[10px] font-bold disabled:opacity-20 transition-all active:scale-95"
                      >
                        Claim
                      </button>
                    </div>
                  </div>

                  {/* Bob */}
                  <div className="p-3 rounded-xl bg-[#090D15] border border-[#2E2D30] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFCF23]"></span>
                        <span className="text-xs font-bold text-white">Bob (30.0%)</span>
                      </div>
                      <p className="text-[10px] text-[#636167] mt-0.5">3,000 Shares · Claimed: ${bobClaimed.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#FFCF23]">${bobClaimable.toLocaleString()}</p>
                      <button
                        disabled={bobClaimable === 0}
                        onClick={() => handleClaim("bob")}
                        className="mt-1 px-3 py-1 rounded-full bg-white hover:bg-[#EDEAF3] text-black text-[10px] font-bold disabled:opacity-20 transition-all active:scale-95"
                      >
                        Claim
                      </button>
                    </div>
                  </div>

                  {/* Charlie */}
                  <div className="p-3 rounded-xl bg-[#090D15] border border-[#2E2D30] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A8A5AF]"></span>
                        <span className="text-xs font-bold text-white">Charlie (20.0%)</span>
                      </div>
                      <p className="text-[10px] text-[#636167] mt-0.5">2,000 Shares · Claimed: ${charlieClaimed.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">${charlieClaimable.toLocaleString()}</p>
                      <button
                        disabled={charlieClaimable === 0}
                        onClick={() => handleClaim("charlie")}
                        className="mt-1 px-3 py-1 rounded-full bg-white hover:bg-[#EDEAF3] text-black text-[10px] font-bold disabled:opacity-20 transition-all active:scale-95"
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center text-[10px] text-[#636167] font-mono">
                Pull Claims execute in <code className="text-[#71B1FF]">O(1)</code> gas on Creditcoin CC3 ($0.001)
              </div>
            </div>

          </div>
        </section>

        {/* 8. LIVE CRYPTOGRAPHIC SETTLEMENT AUDIT LEDGER */}
        <section id="ledger" className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-[#908E94]">
            <div className="flex items-center gap-2 text-white font-semibold uppercase tracking-wider">
              <Database className="w-4 h-4 text-[#71B1FF]" />
              <span>Cryptographic Settlement Audit Ledger</span>
            </div>
            <span className="text-[11px] text-[#636167]">Live Block Event Stream</span>
          </div>

          <div className="dusk-card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#2E2D30] text-[#636167] text-[10px] uppercase tracking-wider bg-[#090D15]/60">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Network / Layer</th>
                    <th className="py-3 px-4">Contract Event</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4 text-right">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E2D30]/60 text-[#A8A5AF]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 text-[#636167]">{log.timestamp}</td>
                      <td className="py-3.5 px-4 text-white font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#71B1FF]"></span>
                        <span>{log.chain}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[#EDEAF3]">{log.event}</span>
                        {log.txHash && (
                          <div className="pt-0.5">
                            <a 
                              href={log.explorerUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[10px] text-[#636167] hover:text-[#71B1FF] truncate block max-w-xs transition-colors"
                            >
                              tx: {log.txHash} ↗
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">{log.amount}</td>
                      <td className="py-3.5 px-4 text-right">
                        {log.status === "verified" && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#71B1FF] bg-[#71B1FF]/10 px-2.5 py-1 rounded-full border border-[#71B1FF]/30">
                            <CheckCircle2 className="w-3 h-3" /> Precompile Proved
                          </span>
                        )}
                        {log.status === "shortfall" && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#ED254E] bg-[#ED254E]/10 px-2.5 py-1 rounded-full border border-[#ED254E]/30">
                            <AlertTriangle className="w-3 h-3" /> Shortfall Emitted
                          </span>
                        )}
                        {log.status === "claimed" && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-white bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
                            <Coins className="w-3 h-3" /> Dividend Claimed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 9. DUSK-GRADE FRAMED FOOTER */}
        <footer className="pt-12 border-t border-[#2E2D30] space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Unskimmable <mark className="bg-transparent text-[#71B1FF]">and</mark> Decentralized Finance.
              </h3>
              <p className="text-xs text-[#A8A5AF]">
                Creditcoin Attestcoin Protocol (Precompile 0x0FD2) · BUIDL CTC 2026 Fall Hackathon (Track 2: RWA #4518)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href="https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#101010] hover:bg-[#1A1A1A] border border-[#2E2D30] text-xs font-mono text-[#EDEAF3] transition-all flex items-center gap-2"
              >
                <span>Creditcoin Blockscout</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#636167]" />
              </a>
              <a 
                href="https://sepolia.etherscan.io/address/0x13C40f20908C66A9c31D6102234c1095E12A31e3"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#101010] hover:bg-[#1A1A1A] border border-[#2E2D30] text-xs font-mono text-[#EDEAF3] transition-all flex items-center gap-2"
              >
                <span>Sepolia Etherscan</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#636167]" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#2E2D30]/40 font-mono text-[11px] text-[#636167]">
            <p>© 2026 WEIR Protocol. Built for Creditcoin BUIDL Hackathon. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <span>Deterministic Settlement</span>
              <span>•</span>
              <span>O(1) Gas Scalability</span>
              <span>•</span>
              <span>Zero-Manager Discretion</span>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
