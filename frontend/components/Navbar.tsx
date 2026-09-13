"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import WeirLogo from "@/components/WeirLogo";

interface NavbarProps {
  activePage?: "home" | "platforms" | "console" | "architecture" | "docs";
}

export default function Navbar({ activePage = "home" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0E0E0E]/80 backdrop-blur-xl border-b border-[#222222] transition-all duration-300">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 py-3.5 flex items-center justify-between">
        {/* 2D Vector Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <WeirLogo className="w-6 h-6 shrink-0" />
          <span className="text-xl font-bold tracking-tight text-white font-sans">
            WEIR<span className="text-[#3773FF]">.io</span>
          </span>
        </Link>

        {/* Apple-grade Nav Links */}
        <ul className="hidden md:flex items-center gap-1 text-xs font-semibold tracking-wide text-[#B0B0B0] bg-[#161616]/60 p-1 rounded-md border border-[#242424]">
          <li>
            <Link
              href="/"
              className={`px-4 py-1.5 rounded-[3px] transition-all block ${
                activePage === "home"
                  ? "bg-[#262626] text-white shadow-sm"
                  : "hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/architecture"
              className={`px-4 py-1.5 rounded-[3px] transition-all block ${
                activePage === "architecture" || activePage === "platforms"
                  ? "bg-[#262626] text-white shadow-sm"
                  : "hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              Platforms
            </Link>
          </li>
          <li>
            <Link
              href="/docs"
              className={`px-4 py-1.5 rounded-[3px] transition-all block ${
                activePage === "docs"
                  ? "bg-[#262626] text-white shadow-sm"
                  : "hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              Docs
            </Link>
          </li>
          <li>
            <Link
              href="/console"
              className={`px-4 py-1.5 rounded-[3px] transition-all block ${
                activePage === "console"
                  ? "bg-[#262626] text-white shadow-sm"
                  : "hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              Console
            </Link>
          </li>
        </ul>

        {/* Right CTA Button (Apple-grade Stark White) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/console"
            className="apple-btn-primary py-2 px-5 text-[11px]"
          >
            Launch Console
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-1 rounded hover:bg-neutral-900"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0E0E0E]/95 backdrop-blur-2xl border-b border-[#222222] px-6 py-6 space-y-4 text-sm font-semibold">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-1.5 ${activePage === "home" ? "text-white font-bold" : "text-neutral-400"}`}
          >
            Home
          </Link>
          <Link
            href="/architecture"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-1.5 ${activePage === "architecture" ? "text-white font-bold" : "text-neutral-400"}`}
          >
            Platforms & Architecture
          </Link>
          <Link
            href="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-1.5 ${activePage === "docs" ? "text-white font-bold" : "text-neutral-400"}`}
          >
            Documentation
          </Link>
          <Link
            href="/console"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-1.5 ${activePage === "console" ? "text-white font-bold" : "text-neutral-400"}`}
          >
            Console (Live Workstation)
          </Link>

          <div className="pt-2">
            <Link
              href="/console"
              onClick={() => setMobileMenuOpen(false)}
              className="apple-btn-primary w-full text-center"
            >
              Launch Console
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
