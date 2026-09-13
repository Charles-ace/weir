"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Check } from "lucide-react";
import WeirLogo from "@/components/WeirLogo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="w-full bg-[#0A0A0A] border-t border-[#1F1F1F] text-white pt-16 pb-12">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Brand + Subscribe (Screenshot 4 Match) */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <WeirLogo className="w-7 h-7 shrink-0" />
              <span className="text-2xl font-black tracking-tight text-white">
                WEIR<span className="text-[#3773FF]">.io</span>
              </span>
            </Link>

            <p className="text-xs text-[#8E8E8E] leading-relaxed max-w-sm">
              Non-custodial cash-flow settlement for institutional real-world assets. Zero-trust revenue attestation on Creditcoin CC3 via native Precompile <code className="text-white font-mono">0x0FD2</code>.
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center max-w-sm">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-[#121212] border border-[#262626] px-4 py-2.5 text-xs text-white placeholder-neutral-500 rounded-l-[2px] focus:outline-none focus:border-[#3773FF] transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1C1C1C] hover:bg-[#262626] border-y border-r border-[#262626] text-[11px] font-bold uppercase tracking-wider text-white rounded-r-[2px] transition-colors shrink-0 flex items-center gap-1.5"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00E599]" />
                    <span>Joined</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </form>

            <div className="space-y-2">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">Follow Us</span>
              <div className="flex items-center gap-2">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-[2px] bg-[#121212] border border-[#222222] flex items-center justify-center text-xs text-neutral-400 hover:text-white hover:border-[#3773FF] transition-colors"
                  aria-label="X Twitter"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-[2px] bg-[#121212] border border-[#222222] flex items-center justify-center text-xs text-neutral-400 hover:text-white hover:border-[#3773FF] transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-[2px] bg-[#121212] border border-[#222222] flex items-center justify-center text-[10px] font-bold text-neutral-400 hover:text-white hover:border-[#3773FF] transition-colors"
                  aria-label="Telegram"
                >
                  TG
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-[2px] bg-[#121212] border border-[#222222] flex items-center justify-center text-[10px] font-bold text-neutral-400 hover:text-white hover:border-[#3773FF] transition-colors"
                  aria-label="Discord"
                >
                  DC
                </a>
              </div>
            </div>
          </div>

          {/* Right Columns: Exactly 3 Columns (Screenshot 4 Match) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            {/* Platforms */}
            <div className="space-y-3">
              <span className="font-bold text-white uppercase tracking-wider font-mono text-[11px] block">
                Platforms
              </span>
              <ul className="space-y-2.5 text-[#A0A0A0] font-sans">
                <li><Link href="/architecture" className="hover:text-white transition-colors">Overview</Link></li>
                <li>
                  <a
                    href="https://sepolia.etherscan.io/address/0x13C40f20908C66A9c31D6102234c1095E12A31e3"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>WeirVault (Sepolia)</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                  </a>
                </li>
                <li><Link href="/architecture" className="hover:text-white transition-colors">Precompile 0x0FD2</Link></li>
                <li><Link href="/architecture" className="hover:text-white transition-colors">O(1) Cap Table</Link></li>
                <li><Link href="/console" className="hover:text-white transition-colors">Settlement Console</Link></li>
              </ul>
            </div>

            {/* Use Cases */}
            <div className="space-y-3">
              <span className="font-bold text-white uppercase tracking-wider font-mono text-[11px] block">
                Use Cases
              </span>
              <ul className="space-y-2.5 text-[#A0A0A0] font-sans">
                <li><Link href="/console" className="hover:text-white transition-colors">Sahara Solar Array #4</Link></li>
                <li><Link href="/console" className="hover:text-white transition-colors">NYC EV Delivery Fleet</Link></li>
                <li><Link href="/console" className="hover:text-white transition-colors">Midwest Agritech PPA</Link></li>
                <li><Link href="/console" className="hover:text-white transition-colors">Commercial Lease Debt</Link></li>
                <li><Link href="/architecture" className="hover:text-white transition-colors">Covenant Enforcer</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <span className="font-bold text-white uppercase tracking-wider font-mono text-[11px] block">
                Resources
              </span>
              <ul className="space-y-2.5 text-[#A0A0A0] font-sans">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/architecture" className="hover:text-white transition-colors">Architecture Lock</Link></li>
                <li>
                  <a
                    href="https://docs.creditcoin.org"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Creditcoin CC3 Docs</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://creditcoin-testnet.blockscout.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Blockscout Explorer</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://sepolia.etherscan.io"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Sepolia Etherscan</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar with System Attestation Tag */}
        <div className="pt-8 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#707070] font-mono">
          <p>© 2026 WEIR Protocol. Non-Custodial RWA Settlement Engine.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#00E599]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse" />
              <span>Creditcoin CC3 Testnet Verified</span>
            </span>
            <span className="text-[#444444]">|</span>
            <span className="flex items-center gap-1 text-[#3773FF]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Precompile 0x0FD2 Active</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
