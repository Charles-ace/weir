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
  Coins
} from "lucide-react";

export default function WeirDashboard() {
  // Demo State
  const [isSimulatingShortfall, setIsSimulatingShortfall] = useState<boolean>(false);
  const [pipelineState, setPipelineState] = useState<"idle" | "depositing" | "attesting" | "verified">("idle");
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  
  // Cap-Table Balances
  const [cumulativeIndex, setCumulativeIndex] = useState<number>(0);
  const [totalInflow, setTotalInflow] = useState<number>(0);
  const [periodCount, setPeriodCount] = useState<number>(0);
  const [shortfallAlert, setShortfallAlert] = useState<boolean>(false);

  const [aliceClaimable, setAliceClaimable] = useState<number>(0);
  const [aliceClaimed, setAliceClaimed] = useState<number>(0);

  const [bobClaimable, setBobClaimable] = useState<number>(0);
  const [bobClaimed, setBobClaimed] = useState<number>(0);

  const [charlieClaimable, setCharlieClaimable] = useState<number>(0);
  const [charlieClaimed, setCharlieClaimed] = useState<number>(0);

  // Live Audit Log
  const [auditLogs, setAuditLogs] = useState<Array<{
    id: string;
    timestamp: string;
    chain: string;
    event: string;
    amount: string;
    status: "verified" | "shortfall" | "claimed";
  }>>([
    {
      id: "init-01",
      timestamp: "12:00:00",
      chain: "Creditcoin CC3",
      event: "CapTableInitialized(Alice 50%, Bob 30%, Charlie 20%)",
      amount: "10,000 Shares",
      status: "verified"
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
        event: "DividendClaimed(Alice 50%)",
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
        event: "DividendClaimed(Bob 30%)",
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
        event: "DividendClaimed(Charlie 20%)",
        amount: `$${charlieClaimable.toLocaleString()} USDC`,
        status: "claimed"
      }, ...prev]);
      setCharlieClaimable(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* 1. Header / Navigation (dusk.network style sticky glass header) */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#080B11]/80 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-bold tracking-tight text-white">WEIR</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  RWA Track
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">HYDRAULIC CASH-FLOW SETTLEMENT</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>CC3 Testnet (102031)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Sepolia (11155111)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Precompile 0x0FD2: Online</span>
            </div>
            <div className="px-3 py-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold">
              Sandbox Live
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* 2. Hero Section (dusk.network high-contrast data display) */}
        <section className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-b from-slate-900/80 to-[#0F1523]/90 border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-cyan-400 text-xs font-mono">
              <Zap className="w-3.5 h-3.5" />
              <span>Attestcoin Cross-Chain Readability Invariant</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl">
              Unskimmable RWA Cash-Flow & Dividend Settlement.
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl">
              Commercial lessees deposit revenue in USDC on Ethereum. Attestcoin cryptographically proves gross inflows via native precompile <code className="text-cyan-300 font-mono">0x0FD2</code> in 15 seconds. Creditcoin executes <code className="text-emerald-300 font-mono">O(1)</code> mathematical dividend splits across fractional investors without managerial skimming.
            </p>
          </div>

          {/* Metric Bar (dusk.network style telemetry stats) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80 font-mono">
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Gross Inflows Verified</p>
              <p className="text-2xl font-bold text-white mt-1">${totalInflow.toLocaleString()}.00</p>
              <span className="text-[10px] text-cyan-400">Sepolia Inflows</span>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Covenant Target</p>
              <p className="text-2xl font-bold text-white mt-1">$10,000.00</p>
              <span className="text-[10px] text-slate-500">Per Period Covenant</span>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Cap-Table Units</p>
              <p className="text-2xl font-bold text-white mt-1">10,000 Shares</p>
              <span className="text-[10px] text-emerald-400">3 Registered Holders</span>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Verification Latency</p>
              <p className="text-2xl font-bold text-white mt-1">~15s</p>
              <span className="text-[10px] text-emerald-400">BLS Consensus Finality</span>
            </div>
          </div>
        </section>

        {/* 3. Three-Conduit Command Center */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CONDUIT 1: Sponsor Inflow (Sepolia) */}
          <div className="rounded-xl bg-[#0E131F] border border-slate-800/80 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-slate-200">
                    1. Inflow Conduit
                  </h2>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Sepolia L1
                </span>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Asset:</span>
                  <span className="font-semibold text-slate-200">Sahara Solar Array #4</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Asset ID:</span>
                  <span className="font-mono text-cyan-300">#0001</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Covenant Inflow:</span>
                  <span className="font-mono text-emerald-400 font-semibold">$10,000 mUSDC</span>
                </div>
              </div>

              {/* Shortfall Simulation Toggle */}
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-slate-300">Test Underpayment Shortfall</p>
                  <p className="text-[10px] text-slate-500">Simulate paying $6,000 instead of $10,000</p>
                </div>
                <button
                  onClick={() => setIsSimulatingShortfall(!isSimulatingShortfall)}
                  className={`px-3 py-1 rounded text-[11px] font-mono transition-colors ${
                    isSimulatingShortfall 
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold" 
                      : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
                  }`}
                >
                  {isSimulatingShortfall ? "Shortfall Mode (ON)" : "Normal Mode ($10k)"}
                </button>
              </div>

              {shortfallAlert && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-300">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Covenant Shortfall Detected!</span>
                    <p className="text-[11px] text-amber-400/90 mt-0.5">
                      Received $6,000 vs $10,000 target. Emitted <code className="font-mono">RevenueShortfall</code> event. Distributing actual $6,000 pro-rata without stalling.
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
                className="w-full py-3 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
              >
                {pipelineState === "depositing" ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Broadcasting to Sepolia...</span>
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4" />
                    <span>Deposit ${isSimulatingShortfall ? "6,000" : "10,000"} Revenue</span>
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-slate-500 font-mono">
                Emits <code className="text-slate-400">RevenueDeposited(1, amount, period, payor)</code>
              </p>
            </div>
          </div>

          {/* CONDUIT 2: Attestcoin Telemetry (Cross-Chain Proof Pipeline) */}
          <div className="rounded-xl bg-[#0E131F] border border-slate-800/80 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-slate-200">
                    2. Attestcoin Prover
                  </h2>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Precompile 0x0FD2
                </span>
              </div>

              {/* 4-Stage State Indicator */}
              <div className="space-y-3 py-2">
                <div className={`p-3 rounded-lg border transition-all ${
                  pipelineStep >= 1 ? "bg-slate-900 border-cyan-500/40 text-slate-200" : "bg-slate-900/30 border-slate-800/60 text-slate-500"
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">1. Sepolia Receipt Logged</span>
                    {pipelineStep >= 1 && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Block #11,685,012 · Receipt Status 0x1</p>
                </div>

                <div className={`p-3 rounded-lg border transition-all ${
                  pipelineStep >= 2 ? "bg-slate-900 border-amber-500/40 text-slate-200" : "bg-slate-900/30 border-slate-800/60 text-slate-500"
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">2. Attestor BLS Quorum (~15s)</span>
                    {pipelineStep >= 2 && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Gossip consensus on Sepolia state root</p>
                </div>

                <div className={`p-3 rounded-lg border transition-all ${
                  pipelineStep >= 3 ? "bg-slate-900 border-emerald-500/40 text-slate-200" : "bg-slate-900/30 border-slate-800/60 text-slate-500"
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">3. Precompile 0x0FD2 Proved</span>
                    {pipelineStep >= 3 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Merkle inclusion + continuity check</p>
                </div>

                <div className={`p-3 rounded-lg border transition-all ${
                  pipelineStep >= 4 ? "bg-slate-900 border-emerald-500/40 text-slate-200" : "bg-slate-900/30 border-slate-800/60 text-slate-500"
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">4. EvmV1Decoder Unpacked</span>
                    {pipelineStep >= 4 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Replay check OK · Event payload decoded</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Replay Protection:</span>
                <span className="text-emerald-400 font-bold">Enforced (txKey)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Receipt Status Assertion:</span>
                <span className="text-emerald-400 font-bold">status == 0x1</span>
              </div>
            </div>
          </div>

          {/* CONDUIT 3: Creditcoin Settlement & Claims (O(1) Cap-Table) */}
          <div className="rounded-xl bg-[#0E131F] border border-slate-800/80 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-slate-200">
                    3. Cap-Table Settlement
                  </h2>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  O(1) Index Math
                </span>
              </div>

              {/* Index Banner */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1 font-mono">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Cumulative Dividend Per Share</p>
                <p className="text-lg font-bold text-emerald-400">{cumulativeIndex.toFixed(6)} USDC</p>
              </div>

              {/* 3 Investor Cards */}
              <div className="space-y-3 font-mono">
                {/* Alice (50%) */}
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/90 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span className="text-xs font-bold text-white">Alice (50.0%)</span>
                    </div>
                    <p className="text-[10px] text-slate-400">5,000 Shares · Claimed: ${aliceClaimed.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-cyan-400">${aliceClaimable.toLocaleString()}</p>
                    <button
                      disabled={aliceClaimable === 0}
                      onClick={() => handleClaim("alice")}
                      className="mt-1 px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] hover:bg-cyan-500/30 disabled:opacity-30"
                    >
                      Claim
                    </button>
                  </div>
                </div>

                {/* Bob (30%) */}
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/90 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span className="text-xs font-bold text-white">Bob (30.0%)</span>
                    </div>
                    <p className="text-[10px] text-slate-400">3,000 Shares · Claimed: ${bobClaimed.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-400">${bobClaimable.toLocaleString()}</p>
                    <button
                      disabled={bobClaimable === 0}
                      onClick={() => handleClaim("bob")}
                      className="mt-1 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] hover:bg-amber-500/30 disabled:opacity-30"
                    >
                      Claim
                    </button>
                  </div>
                </div>

                {/* Charlie (20%) */}
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/90 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      <span className="text-xs font-bold text-white">Charlie (20.0%)</span>
                    </div>
                    <p className="text-[10px] text-slate-400">2,000 Shares · Claimed: ${charlieClaimed.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-purple-400">${charlieClaimable.toLocaleString()}</p>
                    <button
                      disabled={charlieClaimable === 0}
                      onClick={() => handleClaim("charlie")}
                      className="mt-1 px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] hover:bg-purple-500/30 disabled:opacity-30"
                    >
                      Claim
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-500 font-mono">
              Pull Claims execute in <code className="text-emerald-400">O(1)</code> gas on Creditcoin CC3
            </div>
          </div>
        </section>

        {/* 4. Live Verification Audit Trail */}
        <section className="rounded-xl bg-[#0E131F] border border-slate-800/80 p-6 space-y-4">
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
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Network / Layer</th>
                  <th className="py-2.5 px-3">Contract Event</th>
                  <th className="py-2.5 px-3">Value</th>
                  <th className="py-2.5 px-3 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400">{log.timestamp}</td>
                    <td className="py-2.5 px-3 text-cyan-300">{log.chain}</td>
                    <td className="py-2.5 px-3">{log.event}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{log.amount}</td>
                    <td className="py-2.5 px-3 text-right">
                      {log.status === "verified" && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Precompile Verified
                        </span>
                      )}
                      {log.status === "shortfall" && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3" /> Shortfall Emitted
                        </span>
                      )}
                      {log.status === "claimed" && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
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

      </main>
    </div>
  );
}
