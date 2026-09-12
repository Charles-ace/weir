"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#E2DFE9] text-[#101010] font-sans antialiased selection:bg-[#71B1FF] selection:text-black">
      <Navbar activePage="about" />

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
              <span>MISSION &amp; GENESIS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.05]">
              Built for <span className="text-[#71B1FF]">unskimmable</span><br />
              real-world finance.
            </h1>

            <p className="text-[#A8A5AF] text-base sm:text-xl font-normal leading-relaxed max-w-3xl">
              WEIR was born out of a stark realization: bringing real-world assets on-chain is meaningless if the cash flows are still captured, skimmed, and delayed by off-chain humans.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 font-mono text-xs">
              <a 
                href="https://dorahacks.io/hackathon/buidl-ctc" 
                target="_blank" 
                rel="noreferrer"
                className="px-6 py-3 rounded-full bg-white hover:bg-[#EDEAF3] text-black font-bold uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>DORAHACKS BUIDL CTC 2026</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <Link 
                href="/#console" 
                className="px-6 py-3 rounded-full bg-[#1C1C1E] hover:bg-[#2A2A2D] text-white border border-[#2E2D30] font-bold uppercase tracking-wider transition-all"
              >
                LIVE SIMULATION CONSOLE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Origin: What is a WEIR? */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-16 space-y-10">
        <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30] p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#71B1FF]">
              THE ETYMOLOGY &amp; ANALOGY
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold">
              What is a Weir? (/wɪər/)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm text-[#A8A5AF] leading-relaxed">
            <p>
              In civil and hydraulic engineering, a <strong>weir</strong> is a physical barrier placed across a river designed to alter flow characteristics, measure volumetric discharge rate, and divide water evenly without mechanical pumps or human valves. Water flows over the crest in pure accordance with gravitational physics.
            </p>
            <p>
              <strong>WEIR Protocol</strong> functions as a cryptographic hydraulic divider for commercial cash flows. It sits directly between the external revenue source (Ethereum Sepolia) and fractional cap-table investors (Creditcoin CC3). It measures gross inflows, proves inclusion via Precompile 0x0FD2, and distributes yield deterministically.
            </p>
          </div>
        </div>

        {/* The Black-Box RWA Skim */}
        <div className="rounded-3xl bg-white text-[#101010] border border-black/10 p-8 sm:p-12 shadow-lg space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ED254E]">
              SYSTEMIC INDUSTRY FAILURE
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              The Black-Box RWA Skim ($12B+ Vulnerability)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-6 rounded-2xl bg-[#EDEAF3] space-y-3">
              <h3 className="text-base font-bold text-[#101010]">1. Opaque Bank Accounts</h3>
              <p className="text-[#636167] leading-relaxed">
                RWA platforms tokenize properties on EVM, but collect tenant rents into private corporate LLC accounts. Investors have zero visibility into actual gross receipts.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#EDEAF3] space-y-3">
              <h3 className="text-base font-bold text-[#101010]">2. Arbitrary Fee Padding</h3>
              <p className="text-[#636167] leading-relaxed">
                Asset managers routinely invent post-hoc expense line items (&quot;operational adjustments&quot;, &quot;administrative reserves&quot;) to skim 5-12% of gross yield before publishing spreadsheet summaries.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#EDEAF3] space-y-3">
              <h3 className="text-base font-bold text-[#101010]">3. 60-Day Payout Latency</h3>
              <p className="text-[#636167] leading-relaxed">
                Capital is held in off-chain accounts earning yield for the intermediary instead of reaching investors. Distributions take 30 to 90 days to settle.
              </p>
            </div>
          </div>
        </div>

        {/* Hackathon Attribution Banner */}
        <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30] p-8 sm:p-12 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2D30] pb-6 font-mono text-xs">
            <span className="text-[#71B1FF] font-bold uppercase tracking-wider">
              BUIDL CTC 2026 Fall Hackathon
            </span>
            <span className="text-[#A8A5AF]">
              Track 2: Real-World Assets (RWA #4518)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="space-y-1">
              <p className="text-[#636167] uppercase">TARGET ECOSYSTEM</p>
              <p className="text-base font-bold text-white">Creditcoin CC3 EVM</p>
            </div>
            <div className="space-y-1">
              <p className="text-[#636167] uppercase">SPONSOR TECHNOLOGY</p>
              <p className="text-base font-bold text-[#71B1FF]">Attestcoin (0x0FD2)</p>
            </div>
            <div className="space-y-1">
              <p className="text-[#636167] uppercase">TESTNET CONTRACTS</p>
              <p className="text-base font-bold text-white">Sepolia &amp; CC3 Live</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
