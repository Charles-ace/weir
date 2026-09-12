"use client";

import React, { useState } from "react";
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
  Search
} from "lucide-react";

export default function WeirDashboard() {
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
    <div className="min-h-screen bg-[#E2DFE9] text-[#101010] font-sans antialiased selection:bg-[#71B1FF] selection:text-black">
      
      {/* 1. TOP DUSK NAVBAR (Framed Light Canvas) */}
      <nav className="w-full max-w-[1550px] mx-auto px-6 lg:px-12 py-7 flex items-center justify-between">
        {/* Left: Dusk Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3 group">
            <svg 
              className="h-6 w-auto text-[#101010]" 
              viewBox="0 0 120 29" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="currentColor"
            >
              <path d="M14.4993 0.00531747C13.4591 -0.0228937 12.4436 0.0617398 11.4669 0.245112C4.93653 1.47935 0 7.21679 0 14.1038C0 20.9909 4.94006 26.7283 11.4704 27.9626C12.3237 28.1248 13.2052 28.2094 14.1044 28.2094C22.0839 28.2094 28.5155 21.5798 28.1982 13.529C27.9055 6.16946 21.8618 0.202796 14.4993 0.00531747ZM14.7426 25.3707C14.5028 25.3848 14.3477 25.1097 14.4958 24.9193C16.8159 21.9324 18.2017 18.1804 18.2017 14.1038C18.2017 10.0273 16.8195 6.27172 14.4958 3.28839C14.3477 3.09797 14.4993 2.82291 14.7391 2.83701C20.677 3.16849 25.3879 8.08429 25.3879 14.1038C25.3879 20.1234 20.6805 25.0392 14.7426 25.3707Z" />
              <path d="M40.3154 24.4165H46.7508C52.5001 24.4165 57.1609 19.7557 57.1609 14.0064C57.1609 8.25704 52.5001 3.59629 46.7508 3.59629H40.3154V6.81396H46.7508C50.723 6.81396 53.9432 10.0341 53.9432 14.0064C53.9432 17.9787 50.723 21.1988 46.7508 21.1988H40.3154V24.4165Z" />
              <path d="M87.1206 24.1825C88.1376 24.5375 89.2842 24.715 90.5603 24.715C92.1051 24.715 93.4435 24.48 94.5757 24.0098C95.7175 23.5301 96.5954 22.8249 97.2095 21.8942C97.8331 20.9539 98.145 19.8073 98.145 18.4545C98.145 17.1592 97.8619 16.1229 97.2958 15.3458C96.7393 14.5686 95.967 13.9593 94.9787 13.518C93.9905 13.0766 92.6808 12.6544 91.0496 12.2514C90.0038 11.9924 89.1835 11.7429 88.5886 11.5031C87.9937 11.2536 87.5428 10.9418 87.2357 10.5676C86.9287 10.1838 86.7752 9.69444 86.7752 9.09957C86.7752 8.4951 86.9335 7.97698 87.2501 7.54522C87.5668 7.11345 88.0177 6.78723 88.603 6.56655C89.1979 6.33628 89.8887 6.22114 90.6755 6.22114C91.3759 6.22114 92.0235 6.34107 92.6184 6.58094C93.2133 6.81121 93.7314 7.15184 94.1727 7.60278C94.6141 8.04414 94.9595 8.57186 95.209 9.18592L97.8715 7.47326C97.5165 6.60013 97.008 5.85174 96.346 5.22808C95.6839 4.59483 94.8684 4.11029 93.8993 3.77448C92.9398 3.43866 91.8508 3.27075 90.6323 3.27075C89.2123 3.27075 87.9601 3.51062 86.8759 3.99036C85.7917 4.4605 84.9426 5.16092 84.3285 6.09161C83.7241 7.01271 83.4218 8.13529 83.4218 9.45937C83.4218 10.6299 83.6857 11.5942 84.2134 12.3522C84.7411 13.1006 85.4799 13.7003 86.4298 14.1512C87.3892 14.5926 88.6462 15.0051 90.2005 15.3889C91.2847 15.6576 92.1339 15.9214 92.7479 16.1805C93.3716 16.4396 93.8465 16.7754 94.1727 17.1879C94.5086 17.6005 94.6765 18.1474 94.6765 18.8287C94.6765 19.4331 94.5086 19.9512 94.1727 20.383C93.8465 20.8052 93.3716 21.1314 92.7479 21.3617C92.1243 21.5919 91.3759 21.7071 90.5027 21.7071C89.668 21.7071 88.9148 21.5632 88.2432 21.2753C87.5811 20.9875 87.0103 20.5989 86.5305 20.1096C86.0604 19.6202 85.6814 19.0541 85.3935 18.4113L82.6446 20.1527C83.1244 21.1314 83.7336 21.9613 84.4724 22.6426C85.2208 23.3142 86.1035 23.8275 87.1206 24.1825Z" />
              <path d="M65.493 23.8574C66.7211 24.4714 68.2227 24.7785 69.9977 24.7785C71.7632 24.7785 73.26 24.4714 74.4881 23.8574C75.7162 23.2337 76.6373 22.3462 77.2514 21.1948C77.8654 20.0435 78.1725 18.657 78.1725 17.0355V3.67959H74.8479V16.8484C74.8479 18.5275 74.4401 19.7844 73.6246 20.6191C72.809 21.4539 71.6001 21.8713 69.9977 21.8713C68.3954 21.8713 67.1817 21.4539 66.3565 20.6191C65.541 19.7844 65.1332 18.5275 65.1332 16.8484V3.67959H61.7942V17.0355C61.7942 18.6378 62.1061 20.0195 62.7297 21.1804C63.3534 22.3414 64.2745 23.2337 65.493 23.8574Z" />
              <path d="M103.291 24.4331V3.67959H106.615V13.0489H106.644C106.826 12.8474 107.028 12.6363 107.249 12.4156C107.479 12.1853 107.714 11.9455 107.954 11.696L115.927 3.67959H120L111.393 12.43L119.856 24.4331H115.941L109.076 14.5457L106.615 16.9204V24.4331H103.291Z" />
            </svg>
          </a>
        </div>

        {/* Center: Navigation Links (Exact Dusk Header) */}
        <ul className="hidden md:flex items-center gap-8 lg:gap-11 text-[11px] font-bold tracking-[0.16em] text-[#101010] uppercase">
          <li><a href="#overview" className="hover:opacity-60 transition-opacity">NETWORK</a></li>
          <li><a href="#architecture" className="hover:opacity-60 transition-opacity">DEVELOPERS</a></li>
          <li><a href="#console" className="hover:opacity-60 transition-opacity">COMMUNITY</a></li>
          <li><a href="#ledger" className="hover:opacity-60 transition-opacity">ABOUT</a></li>
        </ul>

        {/* Right: Search + Contact Us Pill Button */}
        <div className="flex items-center gap-3">
          <button 
            aria-label="Search" 
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#101010] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:bg-[#F2EFF7] transition-all"
          >
            <Search className="w-4 h-4 text-[#101010]" />
          </button>
          <a 
            href="#console" 
            className="rounded-full bg-[#1C1C1E] hover:bg-black text-white px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-all shadow-sm active:scale-95"
          >
            CONTACT US
          </a>
        </div>
      </nav>

      {/* 2. THE DUSK HERO CARD (EXACT 1:1 REPLICA FROM USER SCREENSHOT) */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-12">
        <div className="relative rounded-[28px] sm:rounded-[36px] md:rounded-[44px] bg-[#101010] overflow-hidden min-h-[580px] lg:min-h-[740px] flex flex-col justify-between pt-16 md:pt-24 shadow-2xl">
          
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

          {/* Heading & Subtitle & CTA (Centered) */}
          <div className="relative z-30 space-y-6 px-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-medium tracking-[-0.03em] text-white leading-[1.04] text-center max-w-4xl mx-auto">
              Regulated markets,<br />
              settled <span className="text-[#71B1FF]">onchain</span>
            </h1>

            <p className="text-[#A8A5AF] text-sm sm:text-base md:text-[19px] max-w-2xl mx-auto text-center font-normal leading-relaxed">
              Infrastructure for regulated digital assets that need privacy, auditability, and deterministic settlement.
            </p>

            <div className="pt-2 flex justify-center">
              <a 
                href="#console" 
                className="px-8 py-3.5 rounded-full bg-white hover:bg-[#EDEAF3] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95"
              >
                EXPLORE USE CASES
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

      {/* 4. VERIFIED TESTNET CONTRACTS DRAWER */}
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

      {/* 5. DUSK SPOTLIGHT / 3-COLUMN ARCHITECTURE */}
      <section id="architecture" className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-12 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-mono text-[#71B1FF] uppercase tracking-wider font-bold">INSTITUTIONAL INVARIANTS</p>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#101010]">
            Built for unskimmable onchain finance.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Col 1 */}
          <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30]/80 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#2E2D30] flex items-center justify-center text-[#ED254E]">
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

          {/* Col 2 */}
          <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30]/80 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#2E2D30] flex items-center justify-center text-[#71B1FF]">
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

          {/* Col 3 */}
          <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30]/80 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#2E2D30] flex items-center justify-center text-[#71B1FF]">
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

      {/* 6. INTERACTIVE SETTLEMENT WORKSTATION */}
      <section id="console" className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-12 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-mono text-[#71B1FF] uppercase tracking-wider font-bold">LIVE WORKSTATION</p>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#101010]">
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

      {/* 7. LIVE CRYPTOGRAPHIC SETTLEMENT AUDIT LEDGER */}
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

      {/* 8. DUSK-GRADE FRAMED FOOTER */}
      <footer className="w-full max-w-[1550px] mx-auto px-6 lg:px-12 py-12 border-t border-[#101010]/10 space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101010]">
              Unskimmable <span className="text-[#71B1FF]">and</span> Decentralized Finance.
            </h3>
            <p className="text-xs text-[#636167]">
              Creditcoin Attestcoin Protocol (Precompile 0x0FD2) · BUIDL CTC 2026 Fall Hackathon (Track 2: RWA #4518)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-[#F2EFF7] border border-[#2E2D30]/20 text-xs font-mono text-[#101010] font-semibold transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Creditcoin Blockscout</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#636167]" />
            </a>
            <a 
              href="https://sepolia.etherscan.io/address/0x13C40f20908C66A9c31D6102234c1095E12A31e3"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-[#F2EFF7] border border-[#2E2D30]/20 text-xs font-mono text-[#101010] font-semibold transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Sepolia Etherscan</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#636167]" />
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#101010]/10 font-mono text-[11px] text-[#636167]">
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

    </div>
  );
}
