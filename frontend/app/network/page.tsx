"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function NetworkPage() {
  const [activeStep, setActiveStep] = useState(2);

  return (
    <div className="min-h-screen bg-[#E2DFE9] text-[#101010] font-sans antialiased selection:bg-[#71B1FF] selection:text-black">
      <Navbar activePage="network" />

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
              <span>ATTESTCOIN CONSENSUS LAYER</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.05]">
              Precompile <span className="text-[#71B1FF]">0x0FD2</span>.<br />
              Oracle-free verification.
            </h1>

            <p className="text-[#A8A5AF] text-base sm:text-xl font-normal leading-relaxed max-w-3xl">
              Creditcoin CC3 introduces native EVM precompile <code className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">0x0FD2</code>, enabling smart contracts to prove Ethereum Sepolia transaction receipt inclusion in ~15 seconds without trusted relayers or third-party oracle networks.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 font-mono text-xs">
              <div className="px-4 py-2 rounded-2xl bg-[#090D15] border border-[#2E2D30] text-[#A8A5AF]">
                Precompile Address: <span className="text-[#71B1FF] font-bold">0x0000...0FD2</span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-[#090D15] border border-[#2E2D30] text-[#A8A5AF]">
                Proof Model: <span className="text-white font-bold">Merkle-Patricia Receipt</span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-[#090D15] border border-[#2E2D30] text-[#A8A5AF]">
                Verification Time: <span className="text-[#71B1FF] font-bold">~15 Seconds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep-Dive Architectural Flow */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-16 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#71B1FF]">
            <span className="w-5 h-[1px] bg-[#71B1FF]"></span>
            <span>CROSS-CHAIN INCLUSION PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#101010]">
            How Merkle Receipt Verification Works.
          </h2>
          <p className="text-sm text-[#636167] max-w-3xl">
            Unlike traditional bridges that rely on optimistic multi-sig signers or centralized keepers, Attestcoin nodes independently observe external chains and reach Byzantine consensus on state roots.
          </p>
        </div>

        {/* 4 Interactive Pipeline Stages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            onClick={() => setActiveStep(1)}
            className={`cursor-pointer rounded-3xl p-6 transition-all border ${
              activeStep === 1 
                ? "bg-[#101010] text-white border-[#71B1FF] shadow-xl" 
                : "bg-white text-[#101010] border-black/10 hover:border-black/30"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[#71B1FF]">STAGE 01</span>
                <span className="text-[10px] uppercase opacity-70">Ethereum Sepolia</span>
              </div>
              <h3 className="text-xl font-bold">Gross Payment Deposited</h3>
              <p className={`text-xs leading-relaxed ${activeStep === 1 ? "text-[#A8A5AF]" : "text-[#636167]"}`}>
                Tenant transfers USDC into <code className="font-semibold">WeirVault.sol</code>. An EVM receipt containing <code className="font-mono">RevenueDeposited</code> is mined into block #11685350 with status 0x1.
              </p>
            </div>
          </div>

          <div 
            onClick={() => setActiveStep(2)}
            className={`cursor-pointer rounded-3xl p-6 transition-all border ${
              activeStep === 2 
                ? "bg-[#101010] text-white border-[#71B1FF] shadow-xl" 
                : "bg-white text-[#101010] border-black/10 hover:border-black/30"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[#71B1FF]">STAGE 02</span>
                <span className="text-[10px] uppercase opacity-70">Creditcoin Quorum</span>
              </div>
              <h3 className="text-xl font-bold">BLS Gossip Attestation</h3>
              <p className={`text-xs leading-relaxed ${activeStep === 2 ? "text-[#A8A5AF]" : "text-[#636167]"}`}>
                Attestor nodes validate Sepolia finality, gossiping signed BLS threshold shares on the block header and Merkle-Patricia receipt trie root.
              </p>
            </div>
          </div>

          <div 
            onClick={() => setActiveStep(3)}
            className={`cursor-pointer rounded-3xl p-6 transition-all border ${
              activeStep === 3 
                ? "bg-[#101010] text-white border-[#71B1FF] shadow-xl" 
                : "bg-white text-[#101010] border-black/10 hover:border-black/30"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[#71B1FF]">STAGE 03</span>
                <span className="text-[10px] uppercase opacity-70">Precompile 0x0FD2</span>
              </div>
              <h3 className="text-xl font-bold">Consensus Verification</h3>
              <p className={`text-xs leading-relaxed ${activeStep === 3 ? "text-[#A8A5AF]" : "text-[#636167]"}`}>
                <code className="font-semibold">WeirDistributionASC</code> invokes precompile 0x0FD2 with the proof payload. The precompile validates Merkle inclusion and asserts receipt status == 0x1.
              </p>
            </div>
          </div>

          <div 
            onClick={() => setActiveStep(4)}
            className={`cursor-pointer rounded-3xl p-6 transition-all border ${
              activeStep === 4 
                ? "bg-[#101010] text-white border-[#71B1FF] shadow-xl" 
                : "bg-white text-[#101010] border-black/10 hover:border-black/30"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[#71B1FF]">STAGE 04</span>
                <span className="text-[10px] uppercase opacity-70">O(1) Settlement</span>
              </div>
              <h3 className="text-xl font-bold">Dividend Index Updated</h3>
              <p className={`text-xs leading-relaxed ${activeStep === 4 ? "text-[#A8A5AF]" : "text-[#636167]"}`}>
                Global index increments in constant time. All fractional cap-table investors can immediately execute pull-claims with zero re-entrancy vulnerability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications Strip */}
      <section className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-16">
        <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30] p-8 sm:p-12 shadow-xl space-y-8">
          <h3 className="text-2xl sm:text-3xl font-bold">Attestcoin Cryptographic Invariants</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-6 rounded-2xl bg-[#090D15] border border-[#2E2D30] space-y-3">
              <div className="text-[#71B1FF] font-bold text-sm">Invariant 1: Replay Immunity</div>
              <p className="text-[#A8A5AF] leading-relaxed">
                Every verified receipt computes a unique nullifier: <code className="text-white">keccak256(chainKey, blockNumber, txIndex)</code>. Double-spending or replaying past deposit receipts is mathematically blocked.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#090D15] border border-[#2E2D30] space-y-3">
              <div className="text-[#71B1FF] font-bold text-sm">Invariant 2: Status 0x1 Enforcement</div>
              <p className="text-[#A8A5AF] leading-relaxed">
                Precompile 0x0FD2 decodes RLP receipts and verifies status byte 0x1 (Success). Reverted or out-of-gas source transactions are immediately rejected at the consensus layer.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#090D15] border border-[#2E2D30] space-y-3">
              <div className="text-[#71B1FF] font-bold text-sm">Invariant 3: Constant-Time Pull Gas</div>
              <p className="text-[#A8A5AF] leading-relaxed">
                Cap table payouts do not loop over investor arrays. Claim gas is strictly bounded to ~35,000 gas, regardless of whether there are 3 investors or 300,000 fractional token holders.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
