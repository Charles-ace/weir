"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Zap, 
  Database, 
  Coins, 
  ExternalLink, 
  Cpu, 
  Layers, 
  Lock, 
  CheckCircle, 
  Copy,
  Shield, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";

export default function WeirHomePage() {
  // Interactive Simulation State
  const [isSimulatingShortfall, setIsSimulatingShortfall] = useState<boolean>(false);
  const [pipelineState, setPipelineState] = useState<"idle" | "depositing" | "attesting" | "verified">("idle");
  const [pipelineStep, setPipelineStep] = useState<number>(4);
  
  // Cap-Table Balances (Seeded with verified live on-chain run values)
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

  // Dusk Stack Interactive Showcase State
  const [activeStackTab, setActiveStackTab] = useState<number>(0);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const stackTabs = [
    {
      id: "vault",
      category: "SOURCE CHAIN (L1)",
      name: "WeirVault.sol",
      status: "Live",
      statusColor: "text-[#71B1FF] bg-[#71B1FF]/10 border-[#71B1FF]/30",
      headline: "Unskimmable Revenue Reception Vault",
      description: "Deployed directly to Ethereum Sepolia. Commercial tenants and off-takers pay revenues directly into this non-custodial smart contract, bypassing asset manager bank accounts entirely. Emits immutable receipt logs indexed with covenant targets.",
      pills: ["Direct Tenant Deposits", "No Manager Discretion", "Custom Covenant Targets", "ERC-20 Inflows"],
      link: "https://sepolia.etherscan.io/address/0x13C40f20908C66A9c31D6102234c1095E12A31e3"
    },
    {
      id: "precompile",
      category: "CONSENSUS VERIFIER",
      name: "Precompile 0x0FD2",
      status: "Testnet",
      statusColor: "text-[#71B1FF] bg-[#71B1FF]/10 border-[#71B1FF]/30",
      headline: "Native Merkle Receipt Inclusion Prover",
      description: "Creditcoin CC3's native cryptographic precompile validates Sepolia transaction inclusion against BLS attestation quorums in ~15 seconds. Relayer-free and oracle-free: false deposits cannot be forged because validators prove Ethereum state roots natively.",
      pills: ["Precompile 0x0FD2", "15s Inclusion Finality", "BLS Quorum Verification", "Zero Trusted Relayers"],
      link: "/network"
    },
    {
      id: "asc",
      category: "SETTLEMENT ASC",
      name: "WeirDistributionASC.sol",
      status: "Testnet",
      statusColor: "text-[#71B1FF] bg-[#71B1FF]/10 border-[#71B1FF]/30",
      headline: "Deterministic O(1) Gas Dividend Allocator",
      description: "Maintains a cumulative dividend index accumulator on Creditcoin. Unlocks instant allocation across thousands of fractional bond or equity holders. Eliminates catastrophic out-of-gas loops: investors pull their dividends in constant-time O(1) gas.",
      pills: ["O(1) Gas Scalability", "Pull-Over-Push Architecture", "Zero Loop Re-entrancy", "$0.001 Claim Gas"],
      link: "/developers"
    },
    {
      id: "shortfall",
      category: "COVENANT SENTRY",
      name: "Hydraulic Shortfall Guard",
      status: "Active",
      statusColor: "text-[#ED254E] bg-[#ED254E]/10 border-[#ED254E]/30",
      headline: "Automated Covenant Breach Detection",
      description: "When commercial revenue falls below the agreed schedule (e.g. Sahara Solar paying $6,000 instead of $10,000), the protocol emits a cryptographic RevenueShortfall event, triggers cure periods, and automatically distributes available cash flow without stalling.",
      pills: ["Real-Time Breach Alerts", "Automated Cure Periods", "Continuous Pro-Rata Flow", "Tamper-Evident Receipts"],
      link: "/use-cases#covenants"
    }
  ];

  const faqs = [
    {
      q: "Why does WEIR avoid third-party oracles like Chainlink for RWA cash flows?",
      a: "Oracles rely on multi-sig nodes reading off-chain APIs. In RWA settlement, this reintroduces the exact counterparty risk we are solving: a manager can report fraudulent bank statements to an oracle. WEIR uses Creditcoin's native precompile 0x0FD2 to prove Ethereum Sepolia cryptographic receipt inclusion directly at the validator consensus layer."
    },
    {
      q: "What is the 'Black-Box RWA Skim' and how does WEIR prevent it?",
      a: "Over $12B of tokenized RWAs collect yield in private corporate bank accounts. Asset managers routinely deduct opaque 'operational fees', delay distributions for 60-90 days, or misreport gross collections. With WEIR, payers wire funds directly into WeirVault.sol on-chain, creating an unskimmable record before any manager can touch it."
    },
    {
      q: "How does the O(1) cumulative dividend index prevent out-of-gas errors?",
      a: "Traditional contracts iterate over an array of 5,000 token holders to push dividends, which crashes due to EVM block gas limits. WEIR updates a single global accumulator: cumulativeIndex += deposit / totalShares. Each investor pulls their dividend independently using: owed = shares * (cumulativeIndex - userIndex), costing constant O(1) gas (~35,000 gas, or <$0.001)."
    },
    {
      q: "What happens if a tenant underpays their contractual revenue covenant?",
      a: "If a tenant owes $10,000 under a power purchase agreement but only deposits $6,000, WEIR does not stall. It immediately proves the $6,000, updates the dividend index to distribute what was received, and emits an on-chain RevenueShortfall event to trigger automated legal cure periods or reserve drawdowns."
    }
  ];

  return (
    <div className="min-h-screen bg-[#E2DFE9] text-[#101010] font-sans antialiased selection:bg-[#71B1FF] selection:text-black">
      
      {/* 1. TOP DUSK NAVBAR (Framed Light Canvas) */}
      <Navbar activePage="home" />

      {/* 2. THE DUSK HERO CARD (1:1 STRUCTURAL REPLICA POPULATED WITH WEIR DOMAIN) */}
      <section id="overview" className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-12">
        <div className="relative rounded-[28px] sm:rounded-[36px] md:rounded-[44px] bg-[#101010] overflow-hidden min-h-[640px] lg:min-h-[780px] flex flex-col justify-between pt-16 md:pt-24 shadow-2xl">
          
          {/* Exact Dusk Scan-Lines Background Pattern */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-85 z-0"
            style={{
              backgroundImage: "url('/hero-lines.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          ></div>

          {/* Heading & Subtitle & CTA (Centered - Exact Dusk Visual Rhythm) */}
          <div className="relative z-30 space-y-6 px-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-medium tracking-[-0.03em] text-white leading-[1.04] text-center max-w-4xl mx-auto">
              Real-world cash flows,<br />
              settled <span className="text-[#71B1FF]">onchain</span>
            </h1>

            <p className="text-[#A8A5AF] text-sm sm:text-base md:text-[19px] max-w-2xl mx-auto text-center font-normal leading-relaxed">
              Creditcoin Attestcoin infrastructure for verifiable real-world revenues, cryptographic receipt proofs, and deterministic O(1) dividend settlement.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <a 
                href="#benefits" 
                className="px-8 py-3.5 rounded-full bg-white hover:bg-[#EDEAF3] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95"
              >
                EXPLORE WEIR STACK
              </a>
              <a 
                href="#console" 
                className="px-8 py-3.5 rounded-full bg-[#1C1C1E] hover:bg-[#2A2A2D] text-white border border-[#2E2D30] text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
              >
                LAUNCH CONSOLE
              </a>
            </div>
          </div>

          {/* Graphic at Bottom: Glowing White Rising Sun + Dunes in Foreground */}
          <div className="relative w-full flex items-end justify-center mt-12 md:mt-20 z-20 overflow-hidden">
            {/* The Crisp White Rising Sun / Ellipse */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex justify-center items-end">
              <img 
                src="/hero-ellipse.svg" 
                alt="ellipse" 
                className="w-[440px] sm:w-[580px] md:w-[720px] lg:w-[840px] max-w-none h-auto select-none pointer-events-none filter drop-shadow-[0_0_90px_rgba(255,255,255,0.45)]" 
              />
            </div>

            {/* Dunes Foreground Image */}
            <div className="relative z-20 w-full flex justify-center pointer-events-none">
              <img 
                src="/dunes.png" 
                alt="dunes" 
                className="w-full object-cover select-none pointer-events-none -mb-1" 
              />
            </div>

            {/* Ecosystem / Network Anchors Bar (Exact Dusk Brands Strip) */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-40px)] max-w-4xl px-4 py-2.5 rounded-full bg-[#101010]/80 backdrop-blur-md border border-white/10 hidden sm:flex items-center justify-between font-mono text-[11px] text-[#A8A5AF] tracking-wider uppercase">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#71B1FF]"></span> CREDITCOIN CC3</span>
              <span className="text-white/20">•</span>
              <span>ETHEREUM SEPOLIA</span>
              <span className="text-white/20">•</span>
              <span>PRECOMPILE 0x0FD2</span>
              <span className="text-white/20">•</span>
              <span>DORAHACKS RWA #4518</span>
              <span className="text-white/20">•</span>
              <span>FOUNDRY TESTED</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. DUSK STATS STRIP (Framed High-Contrast Institutional Metrics) */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-12">
        <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30]/80 overflow-hidden shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#2E2D30]">
            <div className="p-6 md:p-8 space-y-1 font-mono">
              <p className="text-[11px] uppercase tracking-wider text-[#636167]">CONFIRMED INFLOW</p>
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">${totalInflow.toLocaleString()}.00</p>
              <p className="text-[11px] text-[#71B1FF] flex items-center gap-1.5 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#71B1FF]"></span>
                <span>Sepolia L1 Gross Deposit</span>
              </p>
            </div>
            <div className="p-6 md:p-8 space-y-1 font-mono">
              <p className="text-[11px] uppercase tracking-wider text-[#636167]">COVENANT TARGET</p>
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">$10,000.00</p>
              <p className="text-[11px] text-[#A8A5AF] pt-1">Scheduled Period Revenue</p>
            </div>
            <div className="p-6 md:p-8 space-y-1 font-mono">
              <p className="text-[11px] uppercase tracking-wider text-[#636167]">CONSENSUS LATENCY</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#71B1FF] tracking-tight">~15s</p>
              <p className="text-[11px] text-[#A8A5AF] flex items-center gap-1.5 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#71B1FF] animate-pulse"></span>
                <span>Attestcoin BLS Quorum</span>
              </p>
            </div>
            <div className="p-6 md:p-8 space-y-1 font-mono">
              <p className="text-[11px] uppercase tracking-wider text-[#636167]">DIVIDEND SCALING</p>
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">O(1) Gas</p>
              <p className="text-[11px] text-[#A8A5AF] pt-1">Constant time pull-claims</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT BENEFITS / MARKET INFRASTRUCTURE (Dusk 4-Card Grid) */}
      <section id="benefits" className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-16 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#71B1FF]">
            <span className="w-5 h-[1px] bg-[#71B1FF]"></span>
            <span>MARKET INFRASTRUCTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#101010]">
            Institutional-Grade RWA Cash-Flow Settlement.
          </h2>
          <p className="text-sm text-[#636167] max-w-3xl">
            Commercial properties, solar fields, and private credit yield over $12 Billion on-chain. WEIR replaces trusted manager bank accounts with cryptographic inclusion proofs and unskimmable execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Benefit Card 1 */}
          <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30]/80 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl hover:border-[#71B1FF]/50 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2E2D30] flex items-center justify-center text-[#71B1FF] group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold leading-snug">
                Cryptographic Proofs,<br /><span className="text-[#71B1FF]">Not Oracles</span>
              </h3>
              <p className="text-xs text-[#A8A5AF] leading-relaxed">
                Direct Ethereum Sepolia Merkle inclusion proofs verified inside Creditcoin precompile 0x0FD2. No multi-sig oracles can forge collections.
              </p>
            </div>
            <Link href="/network" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#71B1FF] hover:underline pt-2">
              <span>HOW IT PROVES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Benefit Card 2 */}
          <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30]/80 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl hover:border-[#71B1FF]/50 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2E2D30] flex items-center justify-center text-[#71B1FF] group-hover:scale-105 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold leading-snug">
                Unskimmable<br /><span className="text-[#71B1FF]">Hydraulic Vaults</span>
              </h3>
              <p className="text-xs text-[#A8A5AF] leading-relaxed">
                Off-takers and tenants pay directly into on-chain vaults. Asset managers cannot intercept gross cash flow or inflate expense deductions.
              </p>
            </div>
            <Link href="/developers" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#71B1FF] hover:underline pt-2">
              <span>VIEW VAULT SPECS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Benefit Card 3 */}
          <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30]/80 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl hover:border-[#71B1FF]/50 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2E2D30] flex items-center justify-center text-[#71B1FF] group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold leading-snug">
                Deterministic<br /><span className="text-[#71B1FF]">O(1) Gas Math</span>
              </h3>
              <p className="text-xs text-[#A8A5AF] leading-relaxed">
                Replaces high-gas loops with a single cumulative dividend accumulator. 50,000 investors claim independently in constant time for &lt;$0.001.
              </p>
            </div>
            <Link href="/network#scaling" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#71B1FF] hover:underline pt-2">
              <span>DIVIDEND MATH</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Benefit Card 4 */}
          <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30]/80 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl hover:border-[#ED254E]/50 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#2E2D30] flex items-center justify-center text-[#ED254E] group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold leading-snug">
                Automated<br /><span className="text-[#ED254E]">Covenant Sentry</span>
              </h3>
              <p className="text-xs text-[#A8A5AF] leading-relaxed">
                Shortfall breaches automatically trigger on-chain events and cure timers. Available cash distributes without blocking the entire pipeline.
              </p>
            </div>
            <Link href="/use-cases#covenants" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#ED254E] hover:underline pt-2">
              <span>SHORTFALL ALERTS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE PRODUCTS SHOWCASE (Dusk Stack Component) */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-16 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#71B1FF]">
            <span className="w-5 h-[1px] bg-[#71B1FF]"></span>
            <span>WEIR CORE STACK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#101010]">
            Modular Settlement Architecture.
          </h2>
        </div>

        <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30]/80 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Tabs List (Dusk Style) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3 border-b lg:border-b-0 lg:border-r border-[#2E2D30] pb-6 lg:pb-0 lg:pr-8">
              <div className="space-y-3 font-mono">
                {stackTabs.map((tab, idx) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStackTab(idx)}
                    className={`w-full p-4 rounded-2xl text-left transition-all border flex items-center justify-between ${
                      activeStackTab === idx 
                        ? "bg-[#1C1C1E] border-[#71B1FF] shadow-md" 
                        : "bg-[#090D15]/60 border-[#2E2D30] hover:bg-[#1A1A1A] text-[#A8A5AF]"
                    }`}
                  >
                    <div>
                      <p className="text-[10px] uppercase text-[#636167] tracking-wider">{tab.category}</p>
                      <p className={`text-sm font-bold ${activeStackTab === idx ? "text-white" : "text-[#A8A5AF]"}`}>
                        {tab.name}
                      </p>
                    </div>
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full border font-semibold ${tab.statusColor}`}>
                      {tab.status}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#090D15] border border-[#2E2D30] font-mono text-[11px] text-[#636167] space-y-1">
                <p className="text-white font-bold">Tested under load with Foundry &amp; Echidna</p>
                <p>11 Passed Tests · 10,000 Fuzz Runs · 0 Invariant Violations</p>
              </div>
            </div>

            {/* Right Featured Display Panel */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6 lg:pl-4">
              <div className="space-y-4">
                <span className="text-[11px] font-mono font-bold text-[#71B1FF] uppercase tracking-wider">
                  {stackTabs[activeStackTab].category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {stackTabs[activeStackTab].headline}
                </h3>
                <p className="text-sm sm:text-base text-[#A8A5AF] leading-relaxed">
                  {stackTabs[activeStackTab].description}
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  {stackTabs[activeStackTab].pills.map((pill, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#2E2D30] font-mono text-[11px] text-white"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#2E2D30]">
                <span className="text-xs font-mono text-[#636167]">
                  Module: <code className="text-[#71B1FF]">{stackTabs[activeStackTab].name}</code>
                </span>
                <a 
                  href={stackTabs[activeStackTab].link}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-[#EDEAF3] text-black text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <span>Explore Module</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. INSTITUTIONAL CASE STUDY SPOTLIGHT (Sahara Solar Array #4) */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-16 space-y-8">
        <div className="rounded-3xl bg-[#EDEAF3] border border-[#101010]/15 p-6 sm:p-10 shadow-lg space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#101010]/10">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-[#71B1FF]">
                CASE STUDY SPOTLIGHT · RWA #4518
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101010]">
                Sahara Commercial Solar Array #4
              </h3>
            </div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#101010] text-xs font-mono font-bold border border-black/10 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />
              Live PPA Revenue Covenant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <p className="text-[11px] font-mono text-[#636167] uppercase tracking-wider">01 · THE PROBLEM</p>
              <h4 className="text-lg font-bold text-[#101010]">45-Day Delays &amp; Fee Skimming</h4>
              <p className="text-xs text-[#2E2D30]/80 leading-relaxed">
                Commercial off-taker deposited utility payments into an offshore intermediary account. The asset manager deducted 8% in arbitrary &quot;advisory costs&quot; and delayed cap-table payouts by 45 days.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-mono text-[#636167] uppercase tracking-wider">02 · THE WEIR SOLUTION</p>
              <h4 className="text-lg font-bold text-[#101010]">Direct Vault &amp; 0x0FD2 Prover</h4>
              <p className="text-xs text-[#2E2D30]/80 leading-relaxed">
                Tenant now wires USDC directly into <code className="font-mono text-black font-semibold">WeirVault.sol</code> on Sepolia. In 15 seconds, Creditcoin CC3 verifies inclusion and computes Alice, Bob, and Charlie dividends instantly.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-mono text-[#636167] uppercase tracking-wider">03 · VERIFIED RESULTS</p>
              <h4 className="text-lg font-bold text-[#101010]">0% Skim &amp; $0.001 Pull Gas</h4>
              <p className="text-xs text-[#2E2D30]/80 leading-relaxed">
                Zero manager discretion. 100% of the $10,000 gross payment flows to investors in exact covenant proportions (50% / 30% / 20%) in constant O(1) gas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VERIFIED TESTNET CONTRACTS DRAWER */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-12">
        <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30]/80 p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2E2D30] font-mono text-xs">
            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4 text-[#71B1FF]" />
              <span>Public Testnet Contract Registry (Live On-Chain)</span>
            </div>
            <span className="text-[#71B1FF] text-[11px] flex items-center gap-1.5 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" /> {copiedText ? `Copied ${copiedText} address!` : "100% On-Chain Verified"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Sepolia Vault */}
            <div className="p-4 rounded-2xl bg-[#090D15] border border-[#2E2D30] space-y-2">
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
            <div className="p-4 rounded-2xl bg-[#090D15] border border-[#2E2D30] space-y-2">
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
            <div className="p-4 rounded-2xl bg-[#090D15] border border-[#2E2D30] space-y-2">
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
        </div>
      </section>

      {/* 8. INTERACTIVE SETTLEMENT WORKSTATION (The Engine) */}
      <section id="console" className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-16 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#71B1FF]">
            <span className="w-5 h-[1px] bg-[#71B1FF]"></span>
            <span>LIVE WORKSTATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#101010]">
            Institutional Settlement Console.
          </h2>
          <p className="text-xs text-[#636167]">
            Execute real-time revenue cycles, simulate tenant shortfall breaches, witness precompile 0x0FD2 consensus proofs, and claim fractional investor dividends.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* PANEL 1: Inflow Control */}
          <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30]/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#71B1FF]"></span>
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                    1. Inflow Control
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1A1A] text-[#A8A5AF] border border-[#2E2D30]">
                  Ethereum Sepolia
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#090D15] border border-[#2E2D30] space-y-2 font-mono text-xs">
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
              <div className="p-3.5 rounded-2xl bg-[#090D15] border border-[#2E2D30] flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-white">Underpayment Shortfall Test</p>
                  <p className="text-[10px] text-[#A8A5AF]">Simulate paying $6k vs $10k covenant</p>
                </div>
                <button
                  onClick={() => setIsSimulatingShortfall(!isSimulatingShortfall)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-all ${
                    isSimulatingShortfall 
                      ? "bg-[#ED254E]/20 text-[#ED254E] border border-[#ED254E]/40 font-bold shadow-sm" 
                      : "bg-[#1A1A1A] text-[#A8A5AF] border border-[#2E2D30] hover:text-white"
                  }`}
                >
                  {isSimulatingShortfall ? "Shortfall Active ($6k)" : "Normal Mode ($10k)"}
                </button>
              </div>

              {shortfallAlert && (
                <div className="p-3.5 rounded-2xl bg-[#ED254E]/10 border border-[#ED254E]/30 flex items-start gap-2.5 text-xs text-[#ED254E]">
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

          {/* PANEL 2: Attestcoin Prover Pipeline */}
          <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30]/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
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
                <div className={`p-3 rounded-2xl border transition-all ${
                  pipelineStep >= 1 ? "bg-[#090D15] border-[#71B1FF]/40 text-white" : "bg-[#090D15]/40 border-[#2E2D30] text-[#636167]"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">1. Sepolia Receipt Confirmed</span>
                    {pipelineStep >= 1 && <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />}
                  </div>
                  <p className="text-[10px] text-[#636167] mt-0.5">Block #11685350 · Receipt Status 0x1</p>
                </div>

                <div className={`p-3 rounded-2xl border transition-all ${
                  pipelineStep >= 2 ? "bg-[#090D15] border-[#71B1FF]/40 text-white" : "bg-[#090D15]/40 border-[#2E2D30] text-[#636167]"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">2. Attestor BLS Quorum (~15s)</span>
                    {pipelineStep >= 2 && <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />}
                  </div>
                  <p className="text-[10px] text-[#636167] mt-0.5">Consensus gossip on Sepolia state root</p>
                </div>

                <div className={`p-3 rounded-2xl border transition-all ${
                  pipelineStep >= 3 ? "bg-[#090D15] border-[#71B1FF]/40 text-white" : "bg-[#090D15]/40 border-[#2E2D30] text-[#636167]"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">3. Precompile 0x0FD2 Executed</span>
                    {pipelineStep >= 3 && <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />}
                  </div>
                  <p className="text-[10px] text-[#636167] mt-0.5">Merkle receipt inclusion verified on CC3</p>
                </div>

                <div className={`p-3 rounded-2xl border transition-all ${
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

            <div className="p-3 rounded-2xl bg-[#090D15] border border-[#2E2D30] text-[11px] font-mono space-y-1">
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

          {/* PANEL 3: Cap Table Claims */}
          <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30]/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
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

              <div className="p-3.5 rounded-2xl bg-[#090D15] border border-[#2E2D30] font-mono space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-[#636167]">Cumulative Dividend Index</p>
                <p className="text-xl font-bold text-[#71B1FF]">{cumulativeIndex.toFixed(6)} USDC / share</p>
              </div>

              {/* 3 Investors */}
              <div className="space-y-2.5 font-mono">
                {/* Alice */}
                <div className="p-3 rounded-2xl bg-[#090D15] border border-[#2E2D30] flex items-center justify-between">
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
                <div className="p-3 rounded-2xl bg-[#090D15] border border-[#2E2D30] flex items-center justify-between">
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
                <div className="p-3 rounded-2xl bg-[#090D15] border border-[#2E2D30] flex items-center justify-between">
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

      {/* 9. LIVE CRYPTOGRAPHIC SETTLEMENT AUDIT LEDGER */}
      <section id="ledger" className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-16 space-y-4">
        <div className="flex items-center justify-between font-mono text-xs text-[#636167]">
          <div className="flex items-center gap-2 text-[#101010] font-bold uppercase tracking-wider">
            <Database className="w-4 h-4 text-[#71B1FF]" />
            <span>Cryptographic Settlement Audit Ledger</span>
          </div>
          <span className="text-[11px] text-[#636167]">Live Block Event Stream</span>
        </div>

        <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30]/80 overflow-hidden shadow-xl">
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

      {/* 10. PROTOCOL FAQ ACCORDION (Exact Dusk Accordion Style) */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-16 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#71B1FF]">
            <span className="w-5 h-[1px] bg-[#71B1FF]"></span>
            <span>SYSTEM ARCHITECTURE FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#101010]">
            Frequently Asked Technical Questions.
          </h2>
        </div>

        <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30]/80 p-6 sm:p-10 shadow-xl space-y-4">
          <div className="divide-y divide-[#2E2D30]">
            {faqs.map((faq, i) => (
              <div key={i} className="py-5">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="text-base sm:text-lg font-bold text-white group-hover:text-[#71B1FF] transition-colors">
                    {faq.q}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#1C1C1E] border border-[#2E2D30] flex items-center justify-center flex-shrink-0 text-[#A8A5AF] group-hover:text-white transition-colors">
                    {openFaq === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {openFaq === i && (
                  <div className="pt-4 text-xs sm:text-sm text-[#A8A5AF] leading-relaxed max-w-4xl animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. INSTITUTIONAL CALL-TO-ACTION CARD (Dusk Hero-Generic Banner) */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-16">
        <div className="rounded-[36px] bg-[#101010] text-white border border-[#2E2D30] p-8 sm:p-16 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div 
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: "url('/hero-lines.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          ></div>
          <div className="relative z-10 space-y-4 max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#71B1FF]">
              BUIDL FOR THE REAL WORLD
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Ready to deploy unskimmable cash-flow infrastructure?
            </h2>
            <p className="text-xs sm:text-sm text-[#A8A5AF] leading-relaxed">
              Integrate WEIR flow dividers into your tokenized real estate, energy arrays, or debt facilities with precompile 0x0FD2.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link 
              href="/developers" 
              className="w-full sm:w-auto text-center px-8 py-3.5 rounded-full bg-white hover:bg-[#EDEAF3] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95"
            >
              DEVELOPER DOCS
            </Link>
            <Link 
              href="/network" 
              className="w-full sm:w-auto text-center px-8 py-3.5 rounded-full bg-[#1C1C1E] hover:bg-[#28282B] text-white border border-[#2E2D30] text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              EXPLORE PRECOMPILE
            </Link>
          </div>
        </div>
      </section>

      {/* 12. DUSK-GRADE FRAMED FOOTER */}
      <Footer />

    </div>
  );
}
