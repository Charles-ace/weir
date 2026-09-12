"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

interface NavbarProps {
  activePage?: "home" | "network" | "developers" | "console";
}

export default function Navbar({ activePage = "home" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full max-w-[1550px] mx-auto px-6 lg:px-12 py-7 flex items-center justify-between relative z-50">
      {/* Left: WEIR Brand Mark & Protocol Identity */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#101010] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 11H20M7 16H17M10 20H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="11" r="2" fill="#71B1FF" />
              </svg>
            </div>
            <span className="font-sans text-xl font-extrabold tracking-[0.14em] text-[#101010]">
              WEIR
            </span>
          </div>
          <span className="hidden sm:inline-block font-mono text-[10px] uppercase px-2 py-0.5 rounded-full bg-black/5 text-[#101010]/70 border border-black/10 font-medium">
            CREDITCOIN RWA #4518
          </span>
        </Link>
      </div>

      {/* Center: Navigation Links (Exact Dusk Header Typography & Spacing) */}
      <ul className="hidden md:flex items-center gap-8 lg:gap-11 text-[11px] font-bold tracking-[0.16em] uppercase">
        <li>
          <Link 
            href="/" 
            className={`transition-opacity hover:opacity-60 ${activePage === "home" ? "text-[#101010] border-b-2 border-[#101010] pb-1" : "text-[#101010]/70"}`}
          >
            HOME
          </Link>
        </li>
        <li>
          <Link 
            href="/network" 
            className={`transition-opacity hover:opacity-60 ${activePage === "network" ? "text-[#101010] border-b-2 border-[#101010] pb-1" : "text-[#101010]/70"}`}
          >
            NETWORK
          </Link>
        </li>
        <li>
          <Link 
            href="/developers" 
            className={`transition-opacity hover:opacity-60 ${activePage === "developers" ? "text-[#101010] border-b-2 border-[#101010] pb-1" : "text-[#101010]/70"}`}
          >
            DEVELOPERS
          </Link>
        </li>
        <li>
          <Link 
            href="/console" 
            className={`transition-opacity hover:opacity-60 ${activePage === "console" ? "text-[#101010] border-b-2 border-[#101010] pb-1" : "text-[#101010]/70"}`}
          >
            CONSOLE
          </Link>
        </li>
      </ul>

      {/* Right: Search + Action Pill Button */}
      <div className="flex items-center gap-3">
        <Link 
          href="/console#ledger" 
          aria-label="Search Audit Trail" 
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#101010] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:bg-[#F2EFF7] transition-all"
        >
          <Search className="w-4 h-4 text-[#101010]" />
        </Link>
        <Link 
          href="/console" 
          className="hidden sm:inline-flex rounded-full bg-[#1C1C1E] hover:bg-black text-white px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-all shadow-sm active:scale-95"
        >
          LAUNCH CONSOLE
        </Link>

        {/* Mobile menu toggle button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#101010] shadow-sm"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-4 right-4 bg-[#101010] text-white p-6 rounded-3xl shadow-2xl border border-[#2E2D30] flex flex-col gap-4 md:hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-wider py-2 border-b border-[#2E2D30]">
            Home
          </Link>
          <Link href="/network" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-wider py-2 border-b border-[#2E2D30]">
            Network &amp; Precompile 0x0FD2
          </Link>
          <Link href="/developers" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-wider py-2 border-b border-[#2E2D30]">
            Developers &amp; Contracts
          </Link>
          <Link href="/console" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-wider py-2 border-b border-[#2E2D30]">
            Settlement Console
          </Link>
          <Link href="/console" onClick={() => setMobileMenuOpen(false)} className="mt-2 text-center rounded-full bg-white text-black py-3 text-xs font-bold uppercase tracking-wider">
            Launch Console
          </Link>
        </div>
      )}
    </nav>
  );
}
