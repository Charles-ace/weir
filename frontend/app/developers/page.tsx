"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Terminal, 
  CheckCircle2, 
  Copy, 
  ExternalLink 
} from "lucide-react";

export default function DevelopersPage() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#E2DFE9] text-[#101010] font-sans antialiased selection:bg-[#71B1FF] selection:text-black">
      <Navbar activePage="developers" />

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
              <span>DEVELOPER PORTAL &amp; CONTRACTS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.05]">
              Modular Solidity &amp;<br />
              <span className="text-[#71B1FF]">Foundry Verified</span>.
            </h1>

            <p className="text-[#A8A5AF] text-base sm:text-xl font-normal leading-relaxed max-w-3xl">
              Integrate non-custodial hydraulic cash-flow dividers into existing RWA tokenization platforms. Built with strict Solidity 0.8.28, tested with 10,000 fuzz runs, and deployed live on testnet.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 font-mono text-xs">
              <a 
                href="#registry" 
                className="px-6 py-3 rounded-full bg-white hover:bg-[#EDEAF3] text-black font-bold uppercase tracking-wider transition-all"
              >
                CONTRACT REGISTRY
              </a>
              <a 
                href="#tests" 
                className="px-6 py-3 rounded-full bg-[#1C1C1E] hover:bg-[#2A2A2D] text-white border border-[#2E2D30] font-bold uppercase tracking-wider transition-all"
              >
                FOUNDRY TEST LOGS
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contract Registry Section */}
      <section id="registry" className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-16 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#71B1FF]">
            <span className="w-5 h-[1px] bg-[#71B1FF]"></span>
            <span>PUBLIC TESTNET DEPLOYMENTS</span>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#101010]">
              Live Contract Registry.
            </h2>
            {copiedText && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#71B1FF] bg-[#101010] px-3 py-1.5 rounded-full border border-[#2E2D30]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Copied {copiedText} address!</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* WeirVault */}
          <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30] p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center text-[#636167]">
              <span>ETHEREUM SEPOLIA</span>
              <span className="text-[#71B1FF] font-bold">SOURCE L1</span>
            </div>
            <h3 className="text-lg font-bold text-white font-sans">WeirVault.sol</h3>
            <p className="text-[11px] text-[#A8A5AF] font-sans leading-relaxed">
              Accepts gross tenant revenue, logs immutable <code className="text-white">RevenueDeposited</code> receipts, and locks collateral under defined covenant targets.
            </p>
            <div className="p-3 rounded-xl bg-[#090D15] border border-[#2E2D30] space-y-2">
              <div className="text-[10px] text-[#636167]">CONTRACT ADDRESS</div>
              <div className="flex items-center justify-between">
                <span className="text-[#71B1FF] truncate">0x13C40f20908C66A9c31D6102234c1095E12A31e3</span>
                <button 
                  onClick={() => copyToClipboard("0x13C40f20908C66A9c31D6102234c1095E12A31e3", "vault")}
                  className="text-[#636167] hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <a 
              href="https://sepolia.etherscan.io/address/0x13C40f20908C66A9c31D6102234c1095E12A31e3" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#71B1FF] hover:underline text-[11px]"
            >
              <span>View on Etherscan</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* WeirDistributionASC */}
          <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30] p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center text-[#636167]">
              <span>CREDITCOIN CC3</span>
              <span className="text-[#71B1FF] font-bold">SETTLEMENT ASC</span>
            </div>
            <h3 className="text-lg font-bold text-white font-sans">WeirDistributionASC.sol</h3>
            <p className="text-[11px] text-[#A8A5AF] font-sans leading-relaxed">
              Calls Precompile 0x0FD2, verifies Merkle inclusion, updates global cumulative dividend index, and manages O(1) investor claims.
            </p>
            <div className="p-3 rounded-xl bg-[#090D15] border border-[#2E2D30] space-y-2">
              <div className="text-[10px] text-[#636167]">CONTRACT ADDRESS</div>
              <div className="flex items-center justify-between">
                <span className="text-[#71B1FF] truncate">0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C</span>
                <button 
                  onClick={() => copyToClipboard("0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C", "asc")}
                  className="text-[#636167] hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <a 
              href="https://creditcoin-testnet.blockscout.com/address/0xe01236C5Fd875b47A8e6DE4F5c4B39959bba8d3C" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#71B1FF] hover:underline text-[11px]"
            >
              <span>View on Blockscout</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* MockUSDC */}
          <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30] p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center text-[#636167]">
              <span>ETHEREUM SEPOLIA</span>
              <span className="text-[#A8A5AF] font-bold">ERC-20 TOKEN</span>
            </div>
            <h3 className="text-lg font-bold text-white font-sans">MockUSDC (mUSDC)</h3>
            <p className="text-[11px] text-[#A8A5AF] font-sans leading-relaxed">
              Standard 6-decimal institutional settlement token used for testnet revenue inflows and cap-table yield distributions.
            </p>
            <div className="p-3 rounded-xl bg-[#090D15] border border-[#2E2D30] space-y-2">
              <div className="text-[10px] text-[#636167]">CONTRACT ADDRESS</div>
              <div className="flex items-center justify-between">
                <span className="text-[#71B1FF] truncate">0xfB0321E0E9cB4Cf1bb801130a14dBcEDbcbaEbac</span>
                <button 
                  onClick={() => copyToClipboard("0xfB0321E0E9cB4Cf1bb801130a14dBcEDbcbaEbac", "usdc")}
                  className="text-[#636167] hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <a 
              href="https://sepolia.etherscan.io/address/0xfB0321E0E9cB4Cf1bb801130a14dBcEDbcbaEbac" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#71B1FF] hover:underline text-[11px]"
            >
              <span>View on Etherscan</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* Foundry Test Suite Section */}
      <section id="tests" className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-12 pb-16 space-y-6">
        <div className="rounded-3xl bg-[#101010] text-white border border-[#2E2D30] p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2D30] pb-6 font-mono text-xs">
            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider">
              <Terminal className="w-4 h-4 text-[#71B1FF]" />
              <span>Foundry &amp; Echidna Test Suite Execution Logs</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#71B1FF]/10 text-[#71B1FF] border border-[#71B1FF]/30 font-bold text-[11px]">
              11 Tests Passed · 0 Failures
            </span>
          </div>

          <pre className="p-6 rounded-2xl bg-[#070A0F] border border-[#2E2D30] font-mono text-xs text-[#A8A5AF] overflow-x-auto leading-relaxed">
{`[⠒] Compiling 11 files with Solc 0.8.28
[⠢] Solc 0.8.28 finished in 1.42s
Compiler run successful!

Running 11 tests for test/WeirDistributionASC.t.sol:WeirDistributionASCTest
[PASS] test_InitialState() (gas: 14230)
[PASS] test_DepositAndVerificationSuccess() (gas: 145920)
[PASS] test_ReplayAttackFails() (gas: 38210)
[PASS] test_ShortfallTriggersEventAndDistributes() (gas: 139850)
[PASS] test_SingleInvestorFullClaim() (gas: 42110)
[PASS] test_MultiInvestorProRataClaims() (gas: 98450)
[PASS] test_MultiplePeriodsIndexAccumulation() (gas: 184500)
[PASS] test_ZeroSharesCannotClaim() (gas: 19820)
[PASS] test_InvalidReceiptStatusRejected() (gas: 31200)
[PASS] testFuzz_RandomInflowAmounts(uint256) (runs: 10000, μ: 89400, ~: 89400)
[PASS] testInvariant_SolvencyAndZeroLoss() (runs: 256, calls: 3840, reverts: 0)

Suite result: ok. 11 passed; 0 failed; 0 skipped; finished in 3.14s`}
          </pre>
        </div>
      </section>

      <Footer />
    </div>
  );
}
