"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WeirArchitectureDiagram from "@/components/WeirArchitectureDiagram";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Authentic Protocol Inverted-L Chevron Glyph
function ChevronArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 53 53"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || "w-full aspect-square"}
    >
      <path
        d="M42.588 36.1011V18.0241V8.32422H32.8881L14.8112 8.32422L5.11133 18.0241H14.8112H32.8881V36.1011V45.8009L42.588 36.1011Z"
        fill="#3773FF"
      />
    </svg>
  );
}

// Exact Responsive Breakpoints & Negative Space Grid Mappings
// Left columns are carved out (emptyCols) to cradle the headline, subtext, and CTA buttons
const u = {
  cols: 24,
  rows: 14,
  defaultArrowsPerRow: 24,
  arrowsPerRowMap: {
    2: 15,
    3: 15,
    4: 16,
    5: 16,
    6: 12,
    7: 12,
    8: 11,
    9: 11,
    10: 11,
    11: 12,
    12: 14,
    13: 18
  } as Record<number, number>,
  tagMap: [
    { row: 3, col: 15, span: 3, label: "L1 Inflow Vault" },
    { row: 6, col: 17, span: 4, label: "Precompile 0x0FD2" },
    { row: 9, col: 14, span: 4, label: "O(1) Cap Table" }
  ]
};

const c = {
  cols: 24,
  rows: 14,
  defaultArrowsPerRow: 24,
  arrowsPerRowMap: {
    2: 15,
    3: 15,
    4: 16,
    5: 16,
    6: 12,
    7: 12,
    8: 11,
    9: 11,
    10: 11,
    11: 12,
    12: 14,
    13: 18
  } as Record<number, number>,
  tagMap: [
    { row: 3, col: 15, span: 3, label: "L1 Inflow Vault" },
    { row: 6, col: 17, span: 4, label: "Precompile 0x0FD2" },
    { row: 9, col: 14, span: 4, label: "O(1) Cap Table" }
  ]
};

const f = {
  cols: 24,
  rows: 14,
  defaultArrowsPerRow: 24,
  arrowsPerRowMap: {
    2: 15,
    3: 15,
    4: 16,
    5: 16,
    6: 12,
    7: 12,
    8: 11,
    9: 11,
    10: 11,
    11: 12,
    12: 13,
    13: 16
  } as Record<number, number>,
  tagMap: [
    { row: 3, col: 15, span: 3, label: "L1 Inflow Vault" },
    { row: 6, col: 17, span: 4, label: "Precompile 0x0FD2" },
    { row: 9, col: 14, span: 4, label: "O(1) Cap Table" }
  ]
};

const p = {
  cols: 12,
  rows: 14,
  defaultArrowsPerRow: 12,
  arrowsPerRowMap: {
    2: 4,
    3: 4,
    4: 4,
    5: 3,
    6: 2,
    7: 2,
    8: 2,
    9: 2,
    10: 2,
    11: 3,
    12: 5,
    13: 8
  } as Record<number, number>,
  tagMap: []
};

const d = {
  cols: 10,
  rows: 15,
  defaultArrowsPerRow: 10,
  arrowsPerRowMap: {
    1: 4,
    2: 2,
    3: 2,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 2,
    13: 4
  } as Record<number, number>,
  tagMap: []
};

const gridColsMap: Record<number, string> = {
  24: "grid-cols-24",
  12: "grid-cols-12",
  10: "grid-cols-10"
};

const colSpanMap: Record<number, string> = {
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4"
};

export default function HomePage() {
  useScrollReveal();
  const [gridConfig, setGridConfig] = useState(c);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Responsive Grid Adjustment
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1600) setGridConfig(u);
      else if (width >= 1280) setGridConfig(c);
      else if (width >= 1024) setGridConfig(f);
      else if (width >= 640) setGridConfig(p);
      else setGridConfig(d);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Authentic Protocol Staggered Entrance Animation via GSAP
  useEffect(() => {
    const container = gridContainerRef.current;
    if (!container) return;

    const arrows = container.querySelectorAll(".pattern-arrow");
    const tags = container.querySelectorAll(".pattern-tag");
    const shuffledElements = gsap.utils.shuffle([...Array.from(arrows), ...Array.from(tags)]);

    gsap.fromTo(
      shuffledElements,
      { opacity: 0, scale: 0.85 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.65,
        ease: "power3.out",
        stagger: {
          each: 0.008,
          from: "random"
        },
        clearProps: "transform"
      }
    );
  }, [gridConfig]);

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#FDFCFC] font-sans antialiased selection:bg-[#3773FF] selection:text-white flex flex-col overflow-x-hidden">
      <Navbar activePage="home" />

      <main className="flex-1">
        {/* ========================================================= */}
        {/* SECTION 1: HERO + CHEVRON GRID (SCREENSHOT 1 MATCH)       */}
        {/* ========================================================= */}
        <section className="relative min-h-[94vh] flex items-center bg-[#0E0E0E] overflow-hidden pt-24 pb-16 border-b border-[#1C1C1C]">
          {/* Background Responsive Chevron Matrix */}
          <div
            ref={gridContainerRef}
            className="container mx-auto px-2 sm:px-4 inset-0 z-10 overflow-hidden pointer-events-none select-none"
          >
            {Array.from({ length: gridConfig.rows }).map((_, r) => {
              const arrowsInRow = gridConfig.arrowsPerRowMap?.[r] ?? gridConfig.defaultArrowsPerRow;
              const isRowEmpty = arrowsInRow === 0;
              const emptyCols = gridConfig.cols - arrowsInRow;

              return (
                <div key={`row-${r}`} className={`grid ${gridColsMap[gridConfig.cols]} gap-0.5 sm:gap-1`}>
                  {Array.from({ length: gridConfig.cols }).map((_, i) => {
                    // Check for embedded cobalt tag
                    const tag = gridConfig.tagMap.find((t) => t.row === r && t.col === i);
                    if (tag) {
                      return (
                        <h3
                          key={`tag-${r}-${i}`}
                          className={`pattern-tag opacity-0 text-white px-2 flex items-center justify-center bg-[#3773FF] z-20 font-bold xl:text-[22px] lg:text-lg sm:text-base text-xs 2xl:h-[56px] xl:h-[48px] lg:h-[42px] h-[32px] pointer-events-auto shadow-md ${colSpanMap[tag.span]}`}
                        >
                          {tag.label}
                        </h3>
                      );
                    }

                    // Cells covered by a multi-column tag
                    if (gridConfig.tagMap.some((t) => t.row === r && i > t.col && i < t.col + t.span)) {
                      return null;
                    }

                    // Empty cutout cells on the left to cradle the display headline
                    if (i < emptyCols && !isRowEmpty) {
                      return <div key={`empty-${r}-${i}`} className="w-full aspect-square" />;
                    }

                    // Interactive Chevron Arrow
                    return (
                      <div
                        key={`arrow-${r}-${i}`}
                        className={`pattern-arrow opacity-0 col-span-1 aspect-square flex items-center justify-center flex-shrink-0 pointer-events-auto transition-transform duration-300 ease-out hover:rotate-90 cursor-pointer ${
                          isRowEmpty ? "!opacity-0" : ""
                        }`}
                      >
                        <ChevronArrow className="w-full aspect-square text-[#3773FF] hover:brightness-125 transition-all" />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Foreground Display Headline Cradled Inside Grid Cutout */}
          <div className="absolute top-0 left-0 right-0 bottom-0 container mx-auto px-4 pointer-events-none flex flex-col justify-center z-30">
            <div className="max-w-[720px] 2xl:max-w-[850px] space-y-6 pointer-events-auto pt-16">
              <h1 className="text-[54px] sm:text-[84px] xl:text-[98px] 2xl:text-[112px] font-medium leading-[0.98] tracking-tight text-white">
                Not your<br />
                audit,<br />
                Not your yield.
              </h1>

              <p className="text-sm sm:text-base text-[#B0B0B0] font-normal leading-relaxed max-w-[480px]">
                When real-world assets earn rent, middlemen often delay payouts or skim fees. WEIR automatically verifies commercial revenue on-chain and sends every investor their exact share—instantly, transparently, and with zero middlemen.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 relative z-40">
                <Link
                  href="/console"
                  className="apple-btn-primary"
                >
                  Launch Console
                </Link>
                <Link
                  href="/architecture"
                  className="apple-btn-secondary"
                >
                  Explore Architecture
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: METRICS TICKER STRIP (SCREENSHOT 3 TOP MATCH)  */}
        {/* ========================================================= */}
        <section className="w-full bg-[#0E0E0E] border-b border-[#2F2F2F] overflow-x-auto reveal-on-scroll">
          <div className="w-full grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-[#2F2F2F]">
            <div className="p-6 lg:p-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#B0B0B0] uppercase tracking-wider">
                <span className="text-[#3773FF] font-bold text-base">¬</span>
                <span>Verified Inflows</span>
              </div>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight">$4.28M</p>
            </div>
            <div className="p-6 lg:p-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#B0B0B0] uppercase tracking-wider">
                <span className="text-[#3773FF] font-bold text-base">¬</span>
                <span>Active Facilities</span>
              </div>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight">14</p>
            </div>
            <div className="p-6 lg:p-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#B0B0B0] uppercase tracking-wider">
                <span className="text-[#3773FF] font-bold text-base">¬</span>
                <span>Quorum Attestations</span>
              </div>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight">84,120</p>
            </div>
            <div className="p-6 lg:p-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#B0B0B0] uppercase tracking-wider">
                <span className="text-[#3773FF] font-bold text-base">¬</span>
                <span>Quorum Finality</span>
              </div>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-normal text-[#00E599] tracking-tight">&lt; 15.0s</p>
            </div>
            <div className="p-6 lg:p-8 space-y-3 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#B0B0B0] uppercase tracking-wider">
                <span className="text-[#3773FF] font-bold text-base">¬</span>
                <span>Claim Gas Cost</span>
              </div>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-normal text-[#3773FF] tracking-tight">~24K Gas</p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: PLATFORMS + ISOMETRIC 3D DIAGRAM (IMAGE 2)     */}
        {/* ========================================================= */}
        <section className="py-20 lg:py-28 bg-[#0E0E0E] border-b border-[#1C1C1C] reveal-on-scroll">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Architectural Copy */}
              <div className="lg:col-span-5 space-y-6">
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  WEIR <span className="bg-[#3773FF] text-white px-2.5 py-0.5 inline-block font-bold">Settlement</span> Platforms:
                  Unlock Unskimmable RWA Cash Flows
                </h2>

                <p className="text-sm text-[#B0B0B0] leading-relaxed">
                  WEIR is a decentralized financial pipeline that lets tokenized asset issuers and investors settle commercial lease revenue without intermediary trust. Combining Ethereum Sepolia custody with Creditcoin CC3 consensus verification, we provide a unified, trust-minimised infrastructure for revenue intake, attestation, and distribution.
                </p>

                <p className="text-sm text-[#B0B0B0] leading-relaxed">
                  The core modules include <strong className="text-white">WeirVault</strong> for institutional rent custody, <strong className="text-white">Precompile 0x0FD2</strong> for synchronous Merkle receipt verification in Substrate runtime, the <strong className="text-white">Settlement Console</strong> for zero-trust cash flows, and <strong className="text-white">O(1) Cap Table</strong> for gas-negligible pull claims.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/architecture"
                    className="apple-btn-secondary"
                  >
                    <span>Explore Architecture</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/docs"
                    className="apple-btn-secondary"
                  >
                    <span>View Documentation</span>
                  </Link>
                </div>
              </div>

              {/* Right: Authentic 3D Isometric Platform Architecture (100% WEIR Populated) */}
              <div className="lg:col-span-7 relative flex items-center justify-center">
                <WeirArchitectureDiagram />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: WHY PROOFS + AUTHENTIC WIREFRAME BACKDROP      */}
        {/* (SCREENSHOT 3 MATCH WITH fs-cocreation-2.webp & ICONS)    */}
        {/* ========================================================= */}
        <section className="w-full mx-auto bg-[url('/images/protocol/fs-cocreation-2.webp')] lg:bg-cover bg-contain bg-no-repeat bg-top lg:py-[128px] py-16 border-b border-[#1C1C1C] reveal-on-scroll">
          <div className="container mx-auto px-4 gap-4 flex flex-col">
            <div className="lg:mb-16 mb-10 mx-auto text-center">
              <h2 className="text-2xl md:text-4xl font-medium text-white flex flex-wrap items-center justify-center gap-2">
                <span>Why</span>
                <span className="bg-[#3773FF] text-white px-2.5 py-0.5 inline-block font-bold">Cryptographic Proofs</span>
                <span>Powers Everything WEIR Builds?</span>
              </h2>
            </div>

            {/* Alternating Feature Cards with Connecting Vertical Line (Screenshot 3 Match) */}
            <div className="flex flex-col max-w-[895px] w-full mx-auto">
              {/* Item 1: Cyan geometric icon */}
              <div className="flex lg:gap-6 gap-4 lg:justify-end relative lg:pb-[92px] pb-14">
                <div className="lg:w-[59px] lg:h-[59px] w-[42px] h-[42px] relative flex-shrink-0">
                  <Image
                    src="/images/protocol/privacy-1.png"
                    alt="Zero-Trust Servicing"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="privacy-item flex max-w-[395px] flex-col gap-2">
                  <h3 className="text-white text-base md:text-2xl font-medium leading-snug">
                    Making Real-World Cash Flows Truly Trustless and Unskimmable
                  </h3>
                  <p className="text-[#B0B0B0] text-sm md:text-base leading-relaxed">
                    Enable asset originators and investors to eliminate servicer discretion, mathematically enforce debt covenants, and execute instant O(1) dividend pull-claims on Creditcoin CC3.
                  </p>
                </div>
                {/* Vertical connecting gradient line 1 */}
                <div className="w-[1px] bg-gradient-to-b from-[#03BFD4] to-[#3773FF] absolute lg:right-[445px] lg:left-[unset] left-[20px] lg:top-[59px] top-[42px] bottom-0" />
              </div>

              {/* Item 2: Blue geometric icon (Alternating layout) */}
              <div className="flex lg:gap-6 gap-4 relative lg:pb-[92px] pb-14">
                <div className="privacy-item flex lg:text-right flex-col gap-2 max-w-[395px] lg:order-1 order-2">
                  <h3 className="text-white text-base md:text-2xl font-medium leading-snug">
                    Native Precompile 0x0FD2: Relayer-Free Finality
                  </h3>
                  <p className="text-[#B0B0B0] text-sm md:text-base leading-relaxed">
                    Eliminates multi-sig custody risks and external oracle dependencies. Substrate validator quorums verify Sepolia block header inclusion in under 15 seconds.
                  </p>
                </div>
                <div className="lg:w-[59px] lg:h-[59px] w-[42px] h-[42px] relative flex-shrink-0 lg:order-2 order-1">
                  <Image
                    src="/images/protocol/privacy-2.png"
                    alt="Native Precompile 0x0FD2"
                    fill
                    className="object-contain"
                  />
                </div>
                {/* Vertical connecting gradient line 2 */}
                <div className="w-[1px] bg-gradient-to-b from-[#3773FF] to-[#885FFF] absolute lg:right-[445px] lg:left-[unset] left-[20px] lg:top-[59px] top-[42px] bottom-0" />
              </div>

              {/* Item 3: Purple geometric icon */}
              <div className="flex lg:gap-6 gap-4 lg:justify-end relative pb-0">
                <div className="lg:w-[59px] lg:h-[59px] w-[42px] h-[42px] relative flex-shrink-0">
                  <Image
                    src="/images/protocol/privacy-3.png"
                    alt="O(1) Gas Pull-Claims"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="privacy-item flex max-w-[395px] flex-col gap-2">
                  <h3 className="text-white text-base md:text-2xl font-medium leading-snug">
                    O(1) Gas Pull-Claims: Unlimited Cap-Table Scalability
                  </h3>
                  <p className="text-[#B0B0B0] text-sm md:text-base leading-relaxed">
                    A continuous cumulative unit pricing index enables thousands of global cap-table investors to pull claim dividends with fixed ~24,000 gas overhead.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: CTA BANNER (SCREENSHOT 4 MATCH)                */}
        {/* (AUTHENTIC death-of-socrates.png PANORAMA BACKDROP)       */}
        {/* ========================================================= */}
        <section className="w-full mx-auto bg-[url('/images/protocol/death-of-socrates-mobile.png')] md:bg-[url('/images/protocol/death-of-socrates.png')] bg-cover bg-center reveal-on-scroll">
          <div className="container mx-auto md:py-[128px] py-[64px] px-4 gap-4 flex flex-col items-center text-center">
            <h3 className="text-[28px] md:text-[38px] leading-[42px] md:leading-[54px] text-white text-center font-medium">
              Ready to build with WEIR?
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-6">
              <Link
                href="/console"
                className="apple-btn-primary"
              >
                Launch Console
              </Link>
              <Link
                href="/docs"
                className="apple-btn-secondary"
              >
                View Documentation
              </Link>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="apple-btn-secondary flex items-center gap-2"
              >
                <span>Follow us on</span>
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
