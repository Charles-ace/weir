"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function UseCasesPage() {
  const cases = [
    {
      id: "solar",
      category: "RENEWABLE ENERGY PPA",
      title: "Sahara Commercial Solar Array #4",
      covenant: "$10,000 / month",
      tenor: "10-Year Off-Take",
      inflowChain: "Ethereum Sepolia",
      settlementChain: "Creditcoin CC3",
      problem: "Off-taker electric utility wired payments to a regional intermediary SPV account. The manager held cash for 45 days, deducted 8% arbitrary management overhead, and paid tokenized investors on spreadsheets.",
      solution: "The power purchase agreement mandates direct USDC deposit into WeirVault.sol on Ethereum Sepolia. In 15 seconds, Creditcoin's Precompile 0x0FD2 proves deposit receipt inclusion and unlocks dividend claims instantly.",
      stat1: "$120,000",
      label1: "Annual Revenue Flow",
      stat2: "0%",
      label2: "Manager Interception",
      stat3: "15s",
      label3: "Cross-Chain Finality"
    },
    {
      id: "commercial",
      category: "COMMERCIAL REAL ESTATE",
      title: "Manhattan Triple-Net Office Lease",
      covenant: "$25,000 / month",
      tenor: "5-Year Corporate Lease",
      inflowChain: "Ethereum L1",
      settlementChain: "Creditcoin CC3",
      problem: "Corporate tenant rent payments are frequently commingled with property manager operating cash flow, delaying quarterly dividend distributions and creating accounting reconciliation blind spots.",
      solution: "Corporate rent wires settle into a dedicated WeirVault. Tenant lease payments are instantly split between senior bondholders, property maintenance reserves, and equity yield in O(1) gas.",
      stat1: "$300,000",
      label1: "Contractual Rent",
      stat2: "100%",
      label2: "On-Chain Audit Trail",
      stat3: "O(1)",
      label3: "Multi-Tier Split Gas"
    },
    {
      id: "debt",
      category: "PRIVATE CREDIT",
      title: "Fintech Merchant Equipment Facility",
      covenant: "$15,000 / bi-weekly",
      tenor: "24-Month Amortization",
      inflowChain: "Ethereum L1",
      settlementChain: "Creditcoin CC3",
      problem: "Borrower debt repayments are susceptible to partial underpayments. Traditional multi-sigs either halt payments entirely or require expensive manual audits before distributing remaining capital.",
      solution: "WEIR's Hydraulic Shortfall Guard detects any inflow under the $15k covenant schedule, triggers an automated on-chain grace period counter, and immediately releases pro-rata cash flow without stalling.",
      stat1: "$360,000",
      label1: "Annual Debt Servicing",
      stat2: "Instant",
      label2: "Breach Event Emission",
      stat3: "0 Delay",
      label3: "Pro-Rata Payouts"
    }
  ];

  return (
    <div className="min-h-screen bg-[#E2DFE9] text-[#101010] font-sans antialiased selection:bg-[#71B1FF] selection:text-black">
      <Navbar activePage="use-cases" />

      {/* Hero Header */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pt-6 pb-12">
        <div className="relative rounded-[28px] sm:rounded-[36px] md:rounded-[44px] bg-[#101010] text-white overflow-hidden p-8 sm:p-16 lg:p-20 shadow-2xl">
          <div 
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage: "url('/hero-lines.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          ></div>

          <div className="relative z-10 max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#71B1FF]">
              <span className="w-5 h-[1px] bg-[#71B1FF]"></span>
              <span>REAL-WORLD ASSET BLUEPRINTS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.05]">
              Real-world yields.<br />
              <span className="text-[#71B1FF]">Zero manager skim</span>.
            </h1>

            <p className="text-[#A8A5AF] text-base sm:text-xl font-normal leading-relaxed max-w-3xl">
              From commercial solar arrays to triple-net real estate and private debt facilities, discover how WEIR replaces trusted human accountants with deterministic cryptographic flow dividers.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 font-mono text-xs">
              <Link 
                href="/#console" 
                className="px-6 py-3 rounded-full bg-white hover:bg-[#EDEAF3] text-black font-bold uppercase tracking-wider transition-all"
              >
                SIMULATE RWA FLOWS
              </Link>
              <Link 
                href="/developers" 
                className="px-6 py-3 rounded-full bg-[#1C1C1E] hover:bg-[#2A2A2D] text-white border border-[#2E2D30] font-bold uppercase tracking-wider transition-all"
              >
                INTEGRATION SPECS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Detailed Grid */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-16 space-y-10">
        {cases.map((cs) => (
          <div key={cs.id} className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30] p-8 sm:p-12 shadow-2xl space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2E2D30]">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#71B1FF]">
                  {cs.category}
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                  {cs.title}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                <span className="px-3 py-1 rounded-full bg-[#1C1C1E] border border-[#2E2D30] text-[#A8A5AF]">
                  Covenant: <strong className="text-white">{cs.covenant}</strong>
                </span>
                <span className="px-3 py-1 rounded-full bg-[#1C1C1E] border border-[#2E2D30] text-[#A8A5AF]">
                  Tenor: <strong className="text-white">{cs.tenor}</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Problem & Solution */}
              <div className="lg:col-span-8 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-mono uppercase tracking-wider text-[#ED254E] font-bold">
                    The Vulnerability (Traditional Black-Box RWA)
                  </p>
                  <p className="text-sm text-[#A8A5AF] leading-relaxed">
                    {cs.problem}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-mono uppercase tracking-wider text-[#71B1FF] font-bold">
                    The WEIR Solution (Attestcoin Precompile 0x0FD2)
                  </p>
                  <p className="text-sm text-white leading-relaxed">
                    {cs.solution}
                  </p>
                </div>
              </div>

              {/* Metrics Column */}
              <div className="lg:col-span-4 rounded-2xl bg-[#090D15] border border-[#2E2D30] p-6 space-y-6 font-mono">
                <div className="space-y-1 border-b border-[#2E2D30] pb-4">
                  <p className="text-2xl font-bold text-white">{cs.stat1}</p>
                  <p className="text-[11px] text-[#636167] uppercase">{cs.label1}</p>
                </div>
                <div className="space-y-1 border-b border-[#2E2D30] pb-4">
                  <p className="text-2xl font-bold text-[#71B1FF]">{cs.stat2}</p>
                  <p className="text-[11px] text-[#636167] uppercase">{cs.label2}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-white">{cs.stat3}</p>
                  <p className="text-[11px] text-[#636167] uppercase">{cs.label3}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
