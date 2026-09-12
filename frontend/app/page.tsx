"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
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
  Check
} from "lucide-react";

export default function WeirDashboard() {
  // Demo State
  const [isSimulatingShortfall, setIsSimulatingShortfall] = useState<boolean>(false);
  const [pipelineState, setPipelineState] = useState<"idle" | "depositing" | "attesting" | "verified">("idle");
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  
  // Cap-Table Balances
  const [cumulativeIndex, setCumulativeIndex] = useState<number>(0);
  const [totalInflow, setTotalInflow] = useState<number>(10000);
  const [periodCount, setPeriodCount] = useState<number>(1);
  const [shortfallAlert, setShortfallAlert] = useState<boolean>(false);

  const [aliceClaimable, setAliceClaimable] = useState<number>(5000);
  const [aliceClaimed, setAliceClaimed] = useState<number>(0);

  const [bobClaimable, setBobClaimable] = useState<number>(3000);
  const [bobClaimed, setBobClaimed] = useState<number>(0);

  const [charlieClaimable, setCharlieClaimable] = useState<number>(2000);
  const [charlieClaimed, setCharlieClaimed] = useState<number>(0);

  // Live Audit Log
  const [auditLogs, setAuditLogs] = useState<Array<{
    id: string;
    timestamp: string;
    chain: string;
    event: string;
    amount: string;
    status: "verified" | "shortfall" | "claimed";
    txHash?: string;
  }>>([
    {
      id: "tx-live-03",
      timestamp: "00:33:18",
      chain: "Creditcoin CC3",
      event: "verifyAndDistribute(O(1) Dividend Index: 1.0 USDC/share)",
      amount: "$10,000 USDC",
      status: "verified",
      txHash: "0xb3703858d3630d3829a09a310af7e74ea1d6cf3970eb66b88b414ba8b422d123"
    },
    {
      id: "tx-live-02",
      timestamp: "00:28:32",
      chain: "Creditcoin (0x0FD2)",
      event: "TransactionVerified(chainKey 1, height 11685350, tx 114)",
      amount: "Precompile Verified",
      status: "verified",
      txHash: "0xa60cff26332f0b59358b554afd6cbbee9f8332358cb7586fdc5bd5ae20cc4995"
    },
    {
      id: "tx-live-01",
      timestamp: "00:14:02",
      chain: "Sepolia L1",
      event: "RevenueDeposited(Asset #1, $10,000, Period 1)",
      amount: "$10,000 USDC",
      status: "verified",
      txHash: "0xd83e4a58e9e65fe8537291be43310c88b29c028efd7722f9ce3ac9b6a3e3ffb1"
    },
    {
      id: "init-02",
      timestamp: "00:32:45",
      chain: "Creditcoin CC3",
      event: "WeirDistributionASC Deployed & CapTable Initialized",
      amount: "10,000 Shares",
      status: "verified",
      txHash: "0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C"
    },
    {
      id: "init-01",
      timestamp: "00:12:15",
      chain: "Sepolia L1",
      event: "WeirVault Deployed & Asset #1 Registered",
      amount: "Covenant $10k",
      status: "verified",
      txHash: "0x13C40f20908C66A9c31D6102234c1095E12A31e3"
    }
  ]);

  // Handle Revenue Inflow Simulation
  const handleDepositRevenue = async () => {
    const depositValue = isSimulatingShortfall ? 6000 : 10000;
    setPipelineState("depositing");
    setPipelineStep(1);

    // Step 1: Sepolia Deposit Simulation
    setTimeout(() => {
      setPipelineStep(2);
      setPipelineState("attesting");

      // Step 2: Attestcoin Attestation wait (~1.5s in demo)
      setTimeout(() => {
        setPipelineStep(3);

        // Step 3: Precompile 0x0FD2 Proof Verification
        setTimeout(() => {
          setPipelineStep(4);
          setPipelineState("verified");

          // Execute O(1) Math
          const newTotal = totalInflow + depositValue;
          const newPeriod = periodCount + 1;
          const deltaIndex = depositValue / 10000; // per share
          const newIndex = cumulativeIndex + deltaIndex;

          setTotalInflow(newTotal);
          setPeriodCount(newPeriod);
          setCumulativeIndex(newIndex);

          if (depositValue < 10000) {
            setShortfallAlert(true);
          } else {
            setShortfallAlert(false);
          }

          // Update claimable balances (50% / 30% / 20%)
          setAliceClaimable(prev => prev + (depositValue * 0.5));
          setBobClaimable(prev => prev + (depositValue * 0.3));
          setCharlieClaimable(prev => prev + (depositValue * 0.2));

          // Log to audit trail
          setAuditLogs(prev => [
            {
              id: `tx-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              chain: "Creditcoin (0x0FD2)",
              event: depositValue < 10000 ? `RevenueShortfall($10k target, received $${depositValue})` : `DividendsCalculated(+$${depositValue.toLocaleString()})`,
              amount: `$${depositValue.toLocaleString()} USDC`,
              status: depositValue < 10000 ? "shortfall" : "verified"
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
        event: "DividendClaimed(Alice 50% pull-claim)",
        amount: `$${aliceClaimable.toLocaleString()} USDC`,
        status: "claimed"
      }, ...prev]);
      setAliceClaimable(0);
    } else if (investor === "bob" && bobClaimable > 0) {
      setBobClaimed(prev => prev + bobClaimable);
      setAuditLogs(prev => [{
        id: `claim-bob-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        chain: "Creditcoin CC3",
        event: "DividendClaimed(Bob 30% pull-claim)",
        amount: `$${bobClaimable.toLocaleString()} USDC`,
        status: "claimed"
      }, ...prev]);
      setBobClaimable(0);
    } else if (investor === "charlie" && charlieClaimable > 0) {
      setCharlieClaimed(prev => prev + charlieClaimable);
      setAuditLogs(prev => [{
        id: `claim-charlie-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        chain: "Creditcoin CC3",
        event: "DividendClaimed(Charlie 20% pull-claim)",
        amount: `$${charlieClaimable.toLocaleString()} USDC`,
        status: "claimed"
      }, ...prev]);
      setCharlieClaimable(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 selection:bg-cyan-500 selection:text-black font-sans antialiased">
      {/* 1. Dusk-Inspired Sticky Frosted Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080B11]/85 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold shadow-lg shadow-cyan-500/10">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-black tracking-tight text-white">WEIR</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Track 2: RWA #4518
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-wide">UNSKIMMABLE CROSS-CHAIN SETTLEMENT</p>
            </div>
          </div>

          {/* Real-Time Telemetry Badges */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0E131F] border border-slate-800 text-slate-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Creditcoin CC3 (102031)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0E131F] border border-slate-800 text-slate-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Ethereum Sepolia (11155111)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Precompile 0x0FD2: Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* 2. Dusk-Style Institutional Hero Section */}
        <section className="relative overflow-hidden rounded-2xl p-8 md:p-10 bg-gradient-to-b from-[#0F1523] via-[#0B0F18] to-[#080B11] border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Powered by Creditcoin Attestcoin Protocol (Precompile 0x0FD2)</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
              Unskimmable RWA Cash-Flow & Dividend Settlement.
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-3xl leading-relaxed">
              Commercial lessees deposit gross revenue in USDC on Ethereum. Attestcoin cryptographically proves transaction inclusion directly on Creditcoin via native precompile <code className="text-cyan-300 font-mono bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">0x0FD2</code> in 15 seconds. Creditcoin executes <code className="text-emerald-300 font-mono bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">O(1)</code> mathematical dividend splits across fractional investors—eliminating manager skimming, fraudulent deductions, and delayed bank wires.
            </p>
          </div>

          {/* High-Contrast Telemetry Metric Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-6 border-t border-slate-800 font-mono">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Gross Inflows Verified</p>
              <p className="text-2xl md:text-3xl font-bold text-white mt-1.5">${totalInflow.toLocaleString()}.00</p>
              <span className="text-[10px] text-cyan-400 flex items-center gap-1 mt-1">
                <Check className="w-3 h-3" /> Live Sepolia Inflows
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Covenant Target</p>
              <p className="text-2xl md:text-3xl font-bold text-white mt-1.5">$10,000.00</p>
              <span className="text-[10px] text-slate-500 mt-1 block">Scheduled Period Revenue</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Cap-Table Units</p>
              <p className="text-2xl md:text-3xl font-bold text-white mt-1.5">10,000 Shares</p>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                <Check className="w-3 h-3" /> 3 Fractional Investors
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Consensus Latency</p>
              <p className="text-2xl md:text-3xl font-bold text-emerald-400 mt-1.5">~15s</p>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                <Zap className="w-3 h-3" /> Attestcoin BLS Quorum
              </span>
            </div>
          </div>
        </section>

        {/* 3. Verified Live Testnet Deployments Banner */}
        <section className="rounded-xl bg-[#0E131F]/90 border border-slate-800 p-4 md:p-5 font-mono text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white uppercase tracking-wider">Verified On-Chain Contract Registry</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-400">Public Testnets Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
            {/* Sepolia Vault */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>WeirVault.sol (Sepolia)</span>
                <span className="text-cyan-400">Source</span>
              </div>
              <a 
                href="https://sepolia.etherscan.io/address/0x13C40f20908C66A9c31D6102234c1095E12A31e3" 
                target="_blank" 
                rel="noreferrer"
                className="text-slate-200 hover:text-cyan-300 text-[11px] truncate flex items-center gap-1.5 font-semibold group"
              >
                <span>0x13C40f20...E12A31e3</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-300" />
              </a>
            </div>

            {/* Creditcoin ASC */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>WeirDistributionASC.sol (CC3)</span>
                <span className="text-emerald-400">Settlement</span>
              </div>
              <a 
                href="https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C" 
                target="_blank" 
                rel="noreferrer"
                className="text-slate-200 hover:text-emerald-300 text-[11px] truncate flex items-center gap-1.5 font-semibold group"
              >
                <span>0xe01236C5...8d3C</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-300" />
              </a>
            </div>

            {/* Live Tx */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>Latest Deposit Tx (Sepolia)</span>
                <span className="text-amber-400">Block 11685350</span>
              </div>
              <a 
                href="https://sepolia.etherscan.io/tx/0xd83e4a58e9e65fe8537291be43310c88b29c028efd7722f9ce3ac9b6a3e3ffb1" 
                target="_blank" 
                rel="noreferrer"
                className="text-slate-200 hover:text-amber-300 text-[11px] truncate flex items-center gap-1.5 font-semibold group"
              >
                <span>0xd83e4a58...a3e3ffb1</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-300" />
              </a>
            </div>
          </div>
        </section>

        {/* 4. Three-Conduit Industrial Workstation */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CONDUIT 1: Commercial Inflow Conduit (Sepolia) */}
          <div className="rounded-xl bg-[#0E131F] border border-slate-800 p-6 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></span>
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-slate-200">
                    1. Commercial Inflow
                  </h2>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  Ethereum Sepolia
                </span>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Commercial Asset:</span>
                  <span className="font-semibold text-slate-200">Sahara Solar Array #4</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Asset Identifier:</span>
                  <span className="font-mono text-cyan-300">#0001</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Scheduled Inflow:</span>
                  <span className="font-mono text-emerald-400 font-semibold">$10,000.00 mUSDC</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Payment Currency:</span>
                  <span className="font-mono text-slate-300">mUSDC (6 Decimals)</span>
                </div>
              </div>

              {/* Shortfall Simulation Switch */}
              <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-slate-200">Underpayment Shortfall Test</p>
                  <p className="text-[10px] text-slate-400">Simulate paying $6,000 vs $10,000 covenant</p>
                </div>
                <button
                  onClick={() => setIsSimulatingShortfall(!isSimulatingShortfall)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-mono transition-all ${
                    isSimulatingShortfall 
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-md shadow-amber-500/10" 
                      : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
                  }`}
                >
                  {isSimulatingShortfall ? "Shortfall Active ($6k)" : "Normal Mode ($10k)"}
                </button>
              </div>

              {shortfallAlert && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300 animate-in fade-in duration-200">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <span className="font-bold">Covenant Revenue Shortfall Alert!</span>
                    <p className="text-[11px] text-amber-400/90 mt-0.5">
                      Received $6,000 vs $10,000 target. Emitted <code className="font-mono bg-amber-950/60 px-1 py-0.5 rounded">RevenueShortfall</code> event log. Distributing actual $6,000 pro-rata without stalling.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <button
                disabled={pipelineState === "depositing" || pipelineState === "attesting"}
                onClick={handleDepositRevenue}
                className="w-full py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/25 active:scale-[0.99]"
              >
                {pipelineState === "depositing" ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Broadcasting to Sepolia Vault...</span>
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4" />
                    <span>Deposit ${isSimulatingShortfall ? "6,000" : "10,000"} Gross Revenue</span>
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-slate-500 font-mono">
                Emits <code className="text-slate-400">RevenueDeposited(1, grossAmount, period, payor)</code>
              </p>
            </div>
          </div>

          {/* CONDUIT 2: Attestcoin Telemetry (Cross-Chain Proof Pipeline) */}
          <div className="rounded-xl bg-[#0E131F] border border-slate-800 p-6 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"></span>
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-slate-200">
                    2. Attestcoin Prover
                  </h2>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Precompile 0x0FD2
                </span>
              </div>

              {/* 4-Stage State Indicator */}
              <div className="space-y-3 py-1">
                <div className={`p-3 rounded-lg border transition-all ${
                  pipelineStep >= 1 ? "bg-slate-900 border-cyan-500/40 text-slate-200 shadow-sm" : "bg-slate-900/30 border-slate-800/60 text-slate-500"
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">1. Sepolia Receipt Logged</span>
                    {pipelineStep >= 1 && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Block #11685350 · Receipt Status 0x1</p>
                </div>

                <div className={`p-3 rounded-lg border transition-all ${
                  pipelineStep >= 2 ? "bg-slate-900 border-amber-500/40 text-slate-200 shadow-sm" : "bg-slate-900/30 border-slate-800/60 text-slate-500"
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">2. Attestor BLS Quorum (~15s)</span>
                    {pipelineStep >= 2 && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Gossip consensus on Sepolia state root</p>
                </div>

                <div className={`p-3 rounded-lg border transition-all ${
                  pipelineStep >= 3 ? "bg-slate-900 border-emerald-500/40 text-slate-200 shadow-sm" : "bg-slate-900/30 border-slate-800/60 text-slate-500"
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">3. Precompile 0x0FD2 Proved</span>
                    {pipelineStep >= 3 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Synchronous Merkle + continuity check</p>
                </div>

                <div className={`p-3 rounded-lg border transition-all ${
                  pipelineStep >= 4 ? "bg-slate-900 border-emerald-500/40 text-slate-200 shadow-sm" : "bg-slate-900/30 border-slate-800/60 text-slate-500"
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">4. EvmV1Decoder Unpacked</span>
                    {pipelineStep >= 4 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Replay check OK · Event payload verified</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Replay Protection:</span>
                <span className="text-emerald-400 font-bold">Enforced (processedQueries)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Receipt Status Assertion:</span>
                <span className="text-emerald-400 font-bold">receipt.status == 0x1</span>
              </div>
            </div>
          </div>

          {/* CONDUIT 3: Creditcoin Settlement & Claims (O(1) Cap-Table) */}
          <div className="rounded-xl bg-[#0E131F] border border-slate-800 p-6 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-slate-200">
                    3. Cap-Table Settlement
                  </h2>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  O(1) Scalability
                </span>
              </div>

              {/* Index Banner */}
              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1 font-mono">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Cumulative Dividend Per Share</p>
                <p className="text-xl font-bold text-emerald-400">{cumulativeIndex.toFixed(6)} USDC</p>
              </div>

              {/* 3 Investor Cards */}
              <div className="space-y-3 font-mono">
                {/* Alice (50%) */}
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/90 flex items-center justify-between hover:border-slate-700 transition-colors">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span className="text-xs font-bold text-white">Alice (50.0%)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">5,000 Shares · Claimed: ${aliceClaimed.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-cyan-400">${aliceClaimable.toLocaleString()}</p>
                    <button
                      disabled={aliceClaimable === 0}
                      onClick={() => handleClaim("alice")}
                      className="mt-1 px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-semibold hover:bg-cyan-500/30 disabled:opacity-30 transition-colors"
                    >
                      Claim
                    </button>
                  </div>
                </div>

                {/* Bob (30%) */}
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/90 flex items-center justify-between hover:border-slate-700 transition-colors">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span className="text-xs font-bold text-white">Bob (30.0%)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">3,000 Shares · Claimed: ${bobClaimed.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-400">${bobClaimable.toLocaleString()}</p>
                    <button
                      disabled={bobClaimable === 0}
                      onClick={() => handleClaim("bob")}
                      className="mt-1 px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-semibold hover:bg-amber-500/30 disabled:opacity-30 transition-colors"
                    >
                      Claim
                    </button>
                  </div>
                </div>

                {/* Charlie (20%) */}
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/90 flex items-center justify-between hover:border-slate-700 transition-colors">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      <span className="text-xs font-bold text-white">Charlie (20.0%)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">2,000 Shares · Claimed: ${charlieClaimed.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-purple-400">${charlieClaimable.toLocaleString()}</p>
                    <button
                      disabled={charlieClaimable === 0}
                      onClick={() => handleClaim("charlie")}
                      className="mt-1 px-3 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-semibold hover:bg-purple-500/30 disabled:opacity-30 transition-colors"
                    >
                      Claim
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-500 font-mono">
              Pull Claims execute in <code className="text-emerald-400">O(1)</code> gas on Creditcoin CC3 ($0.001)
            </div>
          </div>
        </section>

        {/* 5. Live Cryptographic Settlement Audit Ledger */}
        <section className="rounded-xl bg-[#0E131F] border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
                Cryptographic Settlement Audit Ledger
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Live Block Event Stream</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Network / Layer</th>
                  <th className="py-3 px-3">Contract Event</th>
                  <th className="py-3 px-3">Value</th>
                  <th className="py-3 px-3 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3 text-slate-400">{log.timestamp}</td>
                    <td className="py-3 px-3 text-cyan-300 font-semibold">{log.chain}</td>
                    <td className="py-3 px-3">
                      <span>{log.event}</span>
                      {log.txHash && (
                        <span className="block text-[10px] text-slate-500 truncate max-w-xs">
                          tx: {log.txHash}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">{log.amount}</td>
                    <td className="py-3 px-3 text-right">
                      {log.status === "verified" && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Precompile Verified
                        </span>
                      )}
                      {log.status === "shortfall" && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3" /> Shortfall Emitted
                        </span>
                      )}
                      {log.status === "claimed" && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/30">
                          <Coins className="w-3 h-3" /> Claim Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. Architecture Invariants Reference Drawer */}
        <section className="rounded-xl bg-[#0E131F]/60 border border-slate-800/80 p-6 space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-white uppercase tracking-wider">Hardline Systems Invariants</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
              <p className="text-cyan-400 font-bold mb-1">1. Anti-Skimming Invariant</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Gross inflow amount is cryptographically bound to the Ethereum receipt log. Sponsors cannot alter or intercept cash flows.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
              <p className="text-emerald-400 font-bold mb-1">2. O(1) Scalability Invariant</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Updates a single cumulative index upon revenue receipt. Pull-claims scale to 100,000+ investors with zero loops.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
              <p className="text-amber-400 font-bold mb-1">3. Replay Protection</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Enforced via <code className="text-slate-300">processedQueries[keccak256(chainKey, block, txIndex)]</code>. Duplicate submissions revert.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
              <p className="text-purple-400 font-bold mb-1">4. Receipt Status Assertion</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Contract asserts <code className="text-slate-300">receipt.receiptStatus == 1</code>. Failed or reverted source transactions are rejected.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
