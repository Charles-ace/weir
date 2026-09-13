"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Cpu,
  Layers,
  Coins,
  Zap
} from "lucide-react";

export default function WeirArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = [
    {
      id: "vault",
      title: "WeirVault.sol",
      tag: "Sepolia",
      tagColor: "bg-[#3773FF]/15 text-[#3773FF] border-[#3773FF]/30",
      subtitle: "Institutional Rent Custody",
      desc: "Non-custodial escrow accepting USDC lease inflows from commercial originators and emitting tamper-evident cryptographic receipts.",
      spec: "0x13C4...E12A31e3",
      explorer: "https://sepolia.etherscan.io/address/0x13C40f20908C66A9c31D6102234c1095E12A31e3"
    },
    {
      id: "precompile",
      title: "Precompile 0x0FD2",
      tag: "CC3",
      tagColor: "bg-[#00E599]/15 text-[#00E599] border-[#00E599]/30",
      subtitle: "Consensus Quorum Verifier",
      desc: "Synchronously verifies Ethereum Sepolia block header continuity and Merkle inclusion proofs in Substrate runtime opcode space.",
      spec: "0x0FD2 Precompile",
      explorer: "https://creditcoin-testnet.blockscout.com"
    },
    {
      id: "captable",
      title: "O(1) Cap Table",
      tag: "ASC",
      tagColor: "bg-[#3773FF]/15 text-[#71B1FF] border-[#71B1FF]/30",
      subtitle: "WeirDistributionASC.sol",
      desc: "Scales to 100,000+ fractional investors at constant ~24,000 gas overhead using Synthetix-style cumulative index accounting.",
      spec: "0xe012...8d3C",
      explorer: "https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C"
    },
    {
      id: "lessees",
      title: "Commercial Lessees",
      tag: "PPA",
      tagColor: "bg-[#F38600]/15 text-[#F38600] border-[#F38600]/30",
      subtitle: "Rent Cash Flow Originators",
      desc: "Tenants of tokenized infrastructure assets (Sahara Solar, NYC EV Fleet) depositing recurring lease cash flows under strict covenants.",
      spec: "Asset Facility #1 ($10k/mo)",
      explorer: "/console"
    }
  ];

  return (
    <div className="w-full space-y-4">
      {/* 3D Isometric View with Apple-Grade Precision Badges */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#0A0D14] border border-[#1E2330] shadow-[0_20px_60px_rgba(0,0,0,0.85)] group/canvas">
        {/* Pristine 3D Isometric Base (Octane-rendered for WEIR Protocol) */}
        <Image
          src="/images/protocol/weir-architecture-3d.jpg"
          alt="WEIR Protocol Architecture Diagram"
          fill
          className="object-contain pointer-events-none select-none filter contrast-105 brightness-100"
          priority
        />

        {/* Ambient Vignette Gradient */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0A0D14]/60 via-transparent to-transparent" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0A0D14]/40 via-transparent to-[#0A0D14]/40" />

        {/* ========================================================= */}
        {/* HOLOGRAPHIC HUD NODE PINS & LABELS                        */}
        {/* ========================================================= */}

        {/* Node 1: Top Platform - O(1) Cap Table Engine */}
        <div
          onMouseEnter={() => setActiveNode("captable")}
          onMouseLeave={() => setActiveNode(null)}
          className="absolute top-[25%] left-[64%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
        >
          {/* Radar Pulse Pin */}
          <div className="relative flex items-center justify-center">
            <span className={`absolute w-8 h-8 rounded-full bg-[#3773FF]/30 transition-all duration-500 ${activeNode === "captable" ? "scale-150 animate-ping opacity-75" : "scale-100 animate-pulse opacity-40"}`} />
            <span className="w-3 h-3 rounded-full bg-[#71B1FF] border-2 border-white shadow-[0_0_12px_#3773FF]" />
          </div>

          {/* Floating Glassmorphic HUD Badge */}
          <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 transition-all duration-300 pointer-events-none ${activeNode === "captable" ? "scale-105 -translate-y-1" : "scale-100"}`}>
            <div className="px-3 py-1.5 rounded-lg border border-[#3773FF]/50 bg-[#091224]/85 backdrop-blur-md shadow-[0_4px_24px_rgba(55,115,255,0.35)] flex items-center gap-2.5 whitespace-nowrap">
              <div className="w-6 h-6 rounded bg-[#3773FF]/20 border border-[#3773FF]/40 flex items-center justify-center text-[#71B1FF] shrink-0">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold text-[11px] sm:text-xs tracking-tight">O(1) Cap Table</span>
                  <span className="text-[8px] font-mono px-1 py-0.2 bg-[#3773FF]/20 text-[#71B1FF] border border-[#3773FF]/30 rounded">ASC</span>
                </div>
                <p className="text-[9px] font-mono text-[#8E8E8E]">WeirDistributionASC.sol</p>
              </div>
            </div>
            {/* Pointer Stem */}
            <div className="w-0.5 h-2 bg-[#3773FF]/60 mx-auto" />
          </div>
        </div>

        {/* Node 2: Bottom-Left Platform - WeirVault.sol */}
        <div
          onMouseEnter={() => setActiveNode("vault")}
          onMouseLeave={() => setActiveNode(null)}
          className="absolute top-[67%] left-[47%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
        >
          {/* Radar Pulse Pin */}
          <div className="relative flex items-center justify-center">
            <span className={`absolute w-8 h-8 rounded-full bg-[#3773FF]/30 transition-all duration-500 ${activeNode === "vault" ? "scale-150 animate-ping opacity-75" : "scale-100 animate-pulse opacity-40"}`} />
            <span className="w-3 h-3 rounded-full bg-[#3773FF] border-2 border-white shadow-[0_0_12px_#3773FF]" />
          </div>

          {/* Floating Glassmorphic HUD Badge */}
          <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2.5 transition-all duration-300 pointer-events-none ${activeNode === "vault" ? "scale-105 translate-y-1" : "scale-100"}`}>
            {/* Pointer Stem */}
            <div className="w-0.5 h-2 bg-[#3773FF]/60 mx-auto" />
            <div className="px-3 py-1.5 rounded-lg border border-[#3773FF]/50 bg-[#091224]/85 backdrop-blur-md shadow-[0_4px_24px_rgba(55,115,255,0.35)] flex items-center gap-2.5 whitespace-nowrap">
              <div className="w-6 h-6 rounded bg-[#3773FF]/20 border border-[#3773FF]/40 flex items-center justify-center text-[#3773FF] shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold text-[11px] sm:text-xs tracking-tight">WeirVault.sol</span>
                  <span className="text-[8px] font-mono px-1 py-0.2 bg-[#3773FF]/20 text-[#3773FF] border border-[#3773FF]/30 rounded">Sepolia L1</span>
                </div>
                <p className="text-[9px] font-mono text-[#8E8E8E]">Rent Intake &amp; Custody</p>
              </div>
            </div>
          </div>
        </div>

        {/* Node 3: Bottom-Right Platform - Precompile 0x0FD2 */}
        <div
          onMouseEnter={() => setActiveNode("precompile")}
          onMouseLeave={() => setActiveNode(null)}
          className="absolute top-[67%] left-[82%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
        >
          {/* Radar Pulse Pin */}
          <div className="relative flex items-center justify-center">
            <span className={`absolute w-8 h-8 rounded-full bg-[#00E599]/30 transition-all duration-500 ${activeNode === "precompile" ? "scale-150 animate-ping opacity-75" : "scale-100 animate-pulse opacity-40"}`} />
            <span className="w-3 h-3 rounded-full bg-[#00E599] border-2 border-white shadow-[0_0_12px_#00E599]" />
          </div>

          {/* Floating Glassmorphic HUD Badge */}
          <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2.5 transition-all duration-300 pointer-events-none ${activeNode === "precompile" ? "scale-105 translate-y-1" : "scale-100"}`}>
            {/* Pointer Stem */}
            <div className="w-0.5 h-2 bg-[#00E599]/60 mx-auto" />
            <div className="px-3 py-1.5 rounded-lg border border-[#00E599]/50 bg-[#091815]/85 backdrop-blur-md shadow-[0_4px_24px_rgba(0,229,153,0.3)] flex items-center gap-2.5 whitespace-nowrap">
              <div className="w-6 h-6 rounded bg-[#00E599]/20 border border-[#00E599]/40 flex items-center justify-center text-[#00E599] shrink-0">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold text-[11px] sm:text-xs tracking-tight">Precompile 0x0FD2</span>
                  <span className="text-[8px] font-mono px-1 py-0.2 bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/30 rounded">CC3</span>
                </div>
                <p className="text-[9px] font-mono text-[#8E8E8E]">Consensus Quorum Verifier</p>
              </div>
            </div>
          </div>
        </div>

        {/* Node 4: Left Cluster - Commercial Lessees */}
        <div
          onMouseEnter={() => setActiveNode("lessees")}
          onMouseLeave={() => setActiveNode(null)}
          className="absolute top-[43%] left-[14%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
        >
          {/* Radar Pulse Pin */}
          <div className="relative flex items-center justify-center">
            <span className={`absolute w-8 h-8 rounded-full bg-[#F38600]/30 transition-all duration-500 ${activeNode === "lessees" ? "scale-150 animate-ping opacity-75" : "scale-100 animate-pulse opacity-40"}`} />
            <span className="w-3 h-3 rounded-full bg-[#F38600] border-2 border-white shadow-[0_0_12px_#F38600]" />
          </div>

          {/* Floating Glassmorphic HUD Badge */}
          <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 transition-all duration-300 pointer-events-none ${activeNode === "lessees" ? "scale-105 -translate-y-1" : "scale-100"}`}>
            <div className="px-3 py-1.5 rounded-lg border border-[#F38600]/40 bg-[#140F0A]/85 backdrop-blur-md shadow-[0_4px_24px_rgba(243,134,0,0.3)] flex items-center gap-2 whitespace-nowrap">
              <div className="w-6 h-6 rounded bg-[#F38600]/20 border border-[#F38600]/40 flex items-center justify-center text-[#F38600] shrink-0">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold text-[11px] sm:text-xs tracking-tight">Commercial Lessees</span>
                  <span className="text-[8px] font-mono px-1 py-0.2 bg-[#F38600]/20 text-[#F38600] border border-[#F38600]/30 rounded">PPA</span>
                </div>
                <p className="text-[9px] font-mono text-[#8E8E8E]">Lease Cash Flow Intake</p>
              </div>
            </div>
            {/* Pointer Stem */}
            <div className="w-0.5 h-2 bg-[#F38600]/60 mx-auto" />
          </div>
        </div>

        {/* Center Chip: EvmV1Decoder */}
        <div className="absolute top-[49%] left-[64%] -translate-x-1/2 -translate-y-1/2 z-15 pointer-events-none">
          <div className="px-2.5 py-1 rounded-full bg-[#08151D]/90 border border-[#00E599]/60 text-[#00E599] font-mono text-[9px] flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,229,153,0.4)] backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-ping" />
            <span className="font-semibold">EvmV1Decoder (Substrate)</span>
          </div>
        </div>

        {/* Conduit Micro-Badges along Flow Lines */}
        {/* 1. Lessees -> Vault */}
        <div className="absolute top-[55%] left-[30%] -translate-x-1/2 z-15 pointer-events-none hidden md:block">
          <span className="text-[8px] font-mono text-[#71B1FF] bg-[#070A0F]/80 backdrop-blur-sm px-2 py-0.5 rounded border border-[#3773FF]/30 shadow-sm">
            USDC Rent Inflow &gt;&gt;
          </span>
        </div>

        {/* 2. Top Conduits: Cap Table Yield Claims */}
        <div className="absolute top-[18%] left-[40%] -translate-x-1/2 z-15 pointer-events-none hidden md:block">
          <span className="text-[8px] font-mono text-[#3773FF] bg-[#070A0F]/80 backdrop-blur-sm px-2 py-0.5 rounded border border-[#3773FF]/30 flex items-center gap-1 shadow-sm">
            <Zap className="w-2.5 h-2.5 text-[#3773FF]" />
            <span>O(1) Yield Pipeline (~24k gas) &gt;&gt;</span>
          </span>
        </div>

        {/* 3. Precompile -> Cap Table: Quorum Attestation */}
        <div className="absolute top-[42%] left-[75%] -translate-x-1/2 z-15 pointer-events-none hidden md:block">
          <span className="text-[8px] font-mono text-[#00E599] bg-[#070A0F]/80 backdrop-blur-sm px-2 py-0.5 rounded border border-[#00E599]/30 shadow-sm">
            &lt;&lt; Quorum Attestation
          </span>
        </div>
      </div>

      {/* Interactive Detail Inspector Strip (Updates on Node Hover) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        {nodes.map((n) => {
          const isSelected = activeNode === n.id;
          return (
            <div
              key={n.id}
              onMouseEnter={() => setActiveNode(n.id)}
              onMouseLeave={() => setActiveNode(null)}
              className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "bg-[#101726] border-[#3773FF] shadow-[0_0_20px_rgba(55,115,255,0.3)] scale-[1.02]"
                  : "bg-[#0E0E0E] border-[#222222] hover:border-[#333333] hover:bg-[#121212]"
              }`}
            >
              <div className="flex items-start justify-between mb-1 gap-1.5 min-h-[28px]">
                <span className="text-white font-bold text-[11px] leading-snug">{n.title}</span>
                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${n.tagColor}`}>
                  {n.tag}
                </span>
              </div>
              <p className="text-[10px] text-[#8E8E8E] font-sans line-clamp-1">{n.subtitle}</p>
              <div className="mt-2 pt-1.5 border-t border-[#1C1C1C] flex items-center justify-between text-[9px] text-[#666666]">
                <span className="truncate">{n.spec}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
