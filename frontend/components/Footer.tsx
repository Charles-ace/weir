"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full max-w-[1550px] mx-auto px-6 lg:px-12 py-16 border-t border-[#101010]/10 space-y-14">
      {/* Top Banner & Explorer CTAs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 border-b border-[#101010]/10">
        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101010]">
            Unskimmable <span className="text-[#71B1FF]">and</span> Deterministic RWA Settlement.
          </h3>
          <p className="text-xs text-[#636167]">
            Creditcoin Attestcoin Protocol (Precompile 0x0FD2) · BUIDL CTC 2026 Fall Hackathon (Track 2: RWA #4518)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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

      {/* Multi-Column Sitemap (Dusk Style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-mono">
        <div className="space-y-3">
          <p className="font-bold text-[#101010] uppercase tracking-wider text-[11px]">PROTOCOL</p>
          <ul className="space-y-2 text-[#636167]">
            <li><Link href="/" className="hover:text-[#101010] transition-colors">Overview</Link></li>
            <li><Link href="/network" className="hover:text-[#101010] transition-colors">Attestcoin 0x0FD2</Link></li>
            <li><Link href="/network#quorums" className="hover:text-[#101010] transition-colors">BLS Quorums</Link></li>
            <li><Link href="/network#scaling" className="hover:text-[#101010] transition-colors">O(1) Gas Math</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-bold text-[#101010] uppercase tracking-wider text-[11px]">DEVELOPERS</p>
          <ul className="space-y-2 text-[#636167]">
            <li><Link href="/developers" className="hover:text-[#101010] transition-colors">Contract Registry</Link></li>
            <li><Link href="/developers#foundry" className="hover:text-[#101010] transition-colors">Foundry Tests</Link></li>
            <li><Link href="/developers#interfaces" className="hover:text-[#101010] transition-colors">Solidity Interfaces</Link></li>
            <li><Link href="https://github.com/dora-hacks/creditcoin-hackathon" target="_blank" className="hover:text-[#101010] transition-colors flex items-center gap-1">GitHub Repo ↗</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-bold text-[#101010] uppercase tracking-wider text-[11px]">USE CASES</p>
          <ul className="space-y-2 text-[#636167]">
            <li><Link href="/use-cases" className="hover:text-[#101010] transition-colors">Sahara Solar Array</Link></li>
            <li><Link href="/use-cases#commercial" className="hover:text-[#101010] transition-colors">Commercial Leases</Link></li>
            <li><Link href="/use-cases#private-debt" className="hover:text-[#101010] transition-colors">Private Debt Facilities</Link></li>
            <li><Link href="/use-cases#covenants" className="hover:text-[#101010] transition-colors">Covenant Shortfall</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-bold text-[#101010] uppercase tracking-wider text-[11px]">ABOUT &amp; AUDIT</p>
          <ul className="space-y-2 text-[#636167]">
            <li><Link href="/about" className="hover:text-[#101010] transition-colors">Problem: The RWA Skim</Link></li>
            <li><Link href="/about#team" className="hover:text-[#101010] transition-colors">Team &amp; Architecture</Link></li>
            <li><Link href="/#ledger" className="hover:text-[#101010] transition-colors">Live Settlement Ledger</Link></li>
            <li><Link href="https://dorahacks.io/hackathon/buidl-ctc" target="_blank" className="hover:text-[#101010] transition-colors flex items-center gap-1">DoraHacks CTC #4518 ↗</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Security Badges */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#101010]/10 font-mono text-[11px] text-[#636167]">
        <p>© 2026 WEIR Protocol. BUIDL CTC 2026 Fall Hackathon. All Rights Reserved.</p>
        <div className="flex items-center gap-4">
          <span>Relayer-Free</span>
          <span>•</span>
          <span>Deterministic Settlement</span>
          <span>•</span>
          <span>Zero-Manager Discretion</span>
        </div>
      </div>
    </footer>
  );
}
