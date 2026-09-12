"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="w-full max-w-[1550px] mx-auto px-6 lg:px-12 py-16 border-t border-[#101010]/10 space-y-14">
      {/* Top Banner & Newsletter Input (Exact Dusk Framed Layout) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-12 border-b border-[#101010]/10">
        <div className="space-y-3 max-w-xl">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#101010]">
            Unskimmable <span className="text-[#71B1FF]">and</span> Deterministic RWA Settlement.
          </h3>
          <p className="text-xs sm:text-sm text-[#636167] font-normal leading-relaxed">
            Eliminating intermediary cash-flow skimming on real-world asset dividends through Creditcoin Attestcoin consensus and EVM precompile 0x0FD2.
          </p>
        </div>

        {/* Newsletter / Updates Form */}
        <div className="w-full lg:w-auto">
          {subscribed ? (
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#EBF3FE] border border-[#71B1FF]/30 text-xs font-mono text-[#101010]">
              <CheckCircle2 className="w-4 h-4 text-[#71B1FF]" />
              <span>Subscribed to WEIR Protocol releases</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center rounded-full bg-white border border-[#101010]/15 p-1.5 shadow-sm max-w-md w-full focus-within:border-[#101010] transition-all">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter work email for updates"
                required
                className="bg-transparent px-4 py-2 text-xs font-mono text-[#101010] placeholder:text-[#636167]/60 outline-none flex-grow"
              />
              <button 
                type="submit"
                className="w-9 h-9 rounded-full bg-[#101010] hover:bg-black text-white flex items-center justify-center transition-transform active:scale-95"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Multi-Column Sitemap (Dusk Style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-mono">
        <div className="space-y-3">
          <p className="font-bold text-[#101010] uppercase tracking-wider text-[11px]">PROTOCOL</p>
          <ul className="space-y-2.5 text-[#636167]">
            <li><Link href="/" className="hover:text-[#101010] transition-colors">Overview</Link></li>
            <li><Link href="/network" className="hover:text-[#101010] transition-colors">Attestcoin 0x0FD2</Link></li>
            <li><Link href="/network#quorums" className="hover:text-[#101010] transition-colors">BLS Quorums</Link></li>
            <li><Link href="/network#scaling" className="hover:text-[#101010] transition-colors">O(1) Gas Math</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-bold text-[#101010] uppercase tracking-wider text-[11px]">DEVELOPERS</p>
          <ul className="space-y-2.5 text-[#636167]">
            <li><Link href="/console" className="hover:text-[#101010] transition-colors">Settlement Console</Link></li>
            <li><Link href="/developers" className="hover:text-[#101010] transition-colors">Contract Registry</Link></li>
            <li><Link href="/developers#foundry" className="hover:text-[#101010] transition-colors">Foundry Tests</Link></li>
            <li><a href="https://github.com/dora-hacks/creditcoin-hackathon" target="_blank" rel="noreferrer" className="hover:text-[#101010] transition-colors flex items-center gap-1">GitHub Repo ↗</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-bold text-[#101010] uppercase tracking-wider text-[11px]">CASE STUDY</p>
          <ul className="space-y-2.5 text-[#636167]">
            <li><Link href="/#case-study" className="hover:text-[#101010] transition-colors">Sahara Solar SPV</Link></li>
            <li><Link href="/#case-study" className="hover:text-[#101010] transition-colors">Waterfall Enforcement</Link></li>
            <li><Link href="/#case-study" className="hover:text-[#101010] transition-colors">0% Flow Skim</Link></li>
            <li><Link href="/console#ledger" className="hover:text-[#101010] transition-colors">Onchain Audit Trail</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-bold text-[#101010] uppercase tracking-wider text-[11px]">ECOSYSTEM</p>
          <ul className="space-y-2.5 text-[#636167]">
            <li><a href="https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C" target="_blank" rel="noreferrer" className="hover:text-[#101010] transition-colors flex items-center gap-1">Creditcoin CC3 ↗</a></li>
            <li><a href="https://sepolia.etherscan.io/address/0x13C40f20908C66A9c31D6102234c1095E12A31e3" target="_blank" rel="noreferrer" className="hover:text-[#101010] transition-colors flex items-center gap-1">Sepolia Vault ↗</a></li>
            <li><a href="https://dorahacks.io/hackathon/buidl-ctc" target="_blank" rel="noreferrer" className="hover:text-[#101010] transition-colors flex items-center gap-1">DoraHacks Track 2 ↗</a></li>
            <li><Link href="/console" className="hover:text-[#101010] transition-colors">Live Simulation</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Security Badges */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#101010]/10 font-mono text-[11px] text-[#636167]">
        <p>© 2026 WEIR Protocol. BUIDL CTC 2026 Fall Hackathon (Track 2: RWA #4518). All Rights Reserved.</p>
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
