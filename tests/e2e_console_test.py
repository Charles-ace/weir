#!/usr/bin/env python3
"""
E2E Console Rigor Test Suite - WEIR Protocol
Target: http://localhost:3000/console
Standard: Playwright headless browser E2E verification
"""

import sys
import os
import time
from playwright.sync_api import sync_playwright

BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000")
CONSOLE_URL = f"{BASE_URL}/console"
ARTIFACTS_DIR = r"C:\Users\akpan\.gemini\antigravity\brain\4630e6be-dbbd-42d3-a329-1acbe53ab9de"

def run_tests():
    print("===============================================================================")
    print("  WEIR CONSOLE E2E RIGOR SUITE")
    print("  Target URL:", CONSOLE_URL)
    print("===============================================================================\n")

    pass_count = 0
    fail_count = 0

    def record_pass(test_id, message):
        nonlocal pass_count
        pass_count += 1
        print(f"  [PASS] {test_id}: {message}")

    def record_fail(test_id, message):
        nonlocal fail_count
        fail_count += 1
        print(f"  [FAIL] {test_id}: {message}", file=sys.stderr)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        try:
            # -------------------------------------------------------------
            # TEST 1: PAGE HYDRATION & HONESTY DISCLOSURE BADGE
            # -------------------------------------------------------------
            print(">>> [TEST 1] Verifying Page Hydration, Title & Honesty Disclosures...")
            response = page.goto(CONSOLE_URL, wait_until="networkidle", timeout=15000)
            if not response or response.status != 200:
                record_fail("TEST-1.1", f"Expected HTTP 200, got status {response.status if response else 'None'}")
            else:
                record_pass("TEST-1.1", "HTTP 200 OK received from Next.js server")

            # Check Headline
            h1 = page.locator("h1").first.inner_text()
            if "Live RWA Settlement Console" in h1:
                record_pass("TEST-1.2", f"Header matched: '{h1}'")
            else:
                record_fail("TEST-1.2", f"Header mismatch: found '{h1}'")

            # Check Amber Honesty Banner (Rule 7 Compliance)
            honesty_badge = page.locator("text=Interactive Simulation Mode · Seeded with Live Contracts")
            if honesty_badge.count() > 0:
                record_pass("TEST-1.3", "Rule 7 Honesty Banner visibly rendered on UI")
            else:
                record_fail("TEST-1.3", "Missing honesty disclosure badge")

            # Check Registry Contracts
            content = page.content()
            if "0x13C40f20" in content and "0xe01236C5" in content:
                record_pass("TEST-1.4", "Live contract addresses (WeirVault & WeirDistributionASC) displayed in registry")
            else:
                record_fail("TEST-1.4", "Missing contract addresses in registry")

            # -------------------------------------------------------------
            # TEST 2: INITIAL METRICS RIBBON AUDIT
            # -------------------------------------------------------------
            print("\n>>> [TEST 2] Auditing Initial Seeded Metrics...")
            metrics_section = page.locator("section:has-text('Total Verified Inflows')")
            text_metrics = metrics_section.inner_text()

            if "$10,000" in text_metrics:
                record_pass("TEST-2.1", "Initial Total Inflow: $10,000 USDC verified")
            else:
                record_fail("TEST-2.1", f"Initial Inflow mismatch in: {text_metrics}")

            if "1.0000" in text_metrics:
                record_pass("TEST-2.2", "Initial Cumulative Index: 1.0000 USDC/sh verified")
            else:
                record_fail("TEST-2.2", "Initial Cumulative Index not 1.0000")

            if "Period #1" in text_metrics:
                record_pass("TEST-2.3", "Initial Period: Period #1 verified")
            else:
                record_fail("TEST-2.3", "Initial Period not Period #1")

            # -------------------------------------------------------------
            # TEST 3: $10,000 INFLOW SIMULATION & PIPELINE STATE MACHINE
            # -------------------------------------------------------------
            print("\n>>> [TEST 3] Executing $10,000 Revenue Inflow Simulation...")
            deposit_btn = page.locator("button:has-text('Deposit $10,000 L1 Revenue')")
            if deposit_btn.count() == 0:
                record_fail("TEST-3.1", "Deposit button not found")
            else:
                deposit_btn.click()
                record_pass("TEST-3.1", "Triggered 'Deposit $10,000 L1 Revenue'")

                # Wait for 4-phase state machine to finalize (3.7s simulated latency)
                print("    Waiting for 4-phase Substrate consensus pipeline (3.8s)...")
                page.wait_for_timeout(4500)

                # Check updated metrics
                updated_metrics = metrics_section.inner_text()
                if "$20,000" in updated_metrics:
                    record_pass("TEST-3.2", "Total Inflow incremented to $20,000 USDC")
                else:
                    record_fail("TEST-3.2", f"Expected $20,000 in metrics, got: {updated_metrics}")

                if "2.0000" in updated_metrics:
                    record_pass("TEST-3.3", "Cumulative Index incremented to 2.0000 USDC/sh")
                else:
                    record_fail("TEST-3.3", "Cumulative Index did not reach 2.0000")

                if "Period #2" in updated_metrics:
                    record_pass("TEST-3.4", "Active Period incremented to Period #2")
                else:
                    record_fail("TEST-3.4", "Active Period did not increment to Period #2")

                # Verify Cap-Table Pro-Rata Updates
                alice_card = page.locator(".rounded-xl:has(h4:has-text('Alice'))")
                bob_card = page.locator(".rounded-xl:has(h4:has-text('Bob'))")
                charlie_card = page.locator(".rounded-xl:has(h4:has-text('Charlie'))")

                if "$10,000 USDC" in alice_card.inner_text():
                    record_pass("TEST-3.5", "Alice claimable yield: $10,000 USDC ($5k initial + $5k Period 2)")
                else:
                    record_fail("TEST-3.5", f"Alice card mismatch: {alice_card.inner_text()}")

                if "$6,000 USDC" in bob_card.inner_text():
                    record_pass("TEST-3.6", "Bob claimable yield: $6,000 USDC ($3k initial + $3k Period 2)")
                else:
                    record_fail("TEST-3.6", f"Bob card mismatch: {bob_card.inner_text()}")

                if "$4,000 USDC" in charlie_card.inner_text():
                    record_pass("TEST-3.7", "Charlie claimable yield: $4,000 USDC ($2k initial + $2k Period 2)")
                else:
                    record_fail("TEST-3.7", f"Charlie card mismatch: {charlie_card.inner_text()}")

                # Check Audit Ledger New Row
                ledger = page.locator("section:has-text('On-Chain Attestation Ledger')")
                if "verifyAndDistribute(Period 2, +$10,000 USDC)" in ledger.inner_text():
                    record_pass("TEST-3.8", "Attestation ledger recorded Period 2 distribution event")
                else:
                    record_fail("TEST-3.8", "Missing Period 2 event in attestation ledger")

            # -------------------------------------------------------------
            # TEST 4: O(1) INVESTOR PULL-CLAIM (ALICE CLAIMS)
            # -------------------------------------------------------------
            print("\n>>> [TEST 4] Testing O(1) Pull-Claim Mechanism (Alice)...")
            alice_claim_btn = alice_card.locator("button:has-text('Claim $10,000 USDC')")
            if alice_claim_btn.count() == 0:
                record_fail("TEST-4.1", "Alice claim button ('Claim $10,000 USDC') not found")
            else:
                alice_claim_btn.click()
                page.wait_for_timeout(500)

                # Alice claimable should drop to $0, total claimed $10,000
                alice_card_after = page.locator(".rounded-xl:has(h4:has-text('Alice'))").inner_text()
                if "$0 USDC" in alice_card_after and "yield claimed" in alice_card_after.lower():
                    record_pass("TEST-4.2", "Alice claimable reset to $0 and button transitioned to 'Yield Claimed'")
                else:
                    record_fail("TEST-4.2", f"Alice card state incorrect: {alice_card_after}")

                # Invariant Check: Bob and Charlie must remain unchanged!
                bob_card_after = page.locator(".rounded-xl:has(h4:has-text('Bob'))").inner_text()
                charlie_card_after = page.locator(".rounded-xl:has(h4:has-text('Charlie'))").inner_text()

                if "$6,000 USDC" in bob_card_after and "$4,000 USDC" in charlie_card_after:
                    record_pass("TEST-4.3", "O(1) Pull Isolation Invariant: Bob ($6k) and Charlie ($4k) balances unchanged by Alice claim")
                else:
                    record_fail("TEST-4.3", "Cap-table isolation violated on claim")

            # -------------------------------------------------------------
            # TEST 5: COVENANT SHORTFALL SCENARIO ($6,000 INFLOW)
            # -------------------------------------------------------------
            print("\n>>> [TEST 5] Testing Covenant Shortfall Simulation ($6,000 Underpayment)...")
            shortfall_toggle = page.locator("button:has-text('Simulate Shortfall')")
            shortfall_toggle.click()
            page.wait_for_timeout(300)

            deposit_shortfall_btn = page.locator("button:has-text('Deposit $6,000 L1 Revenue')")
            if deposit_shortfall_btn.count() == 0:
                record_fail("TEST-5.1", "Button did not update to 'Deposit $6,000 L1 Revenue'")
            else:
                deposit_shortfall_btn.click()
                print("    Waiting for shortfall quorum attestation (3.8s)...")
                page.wait_for_timeout(4500)

                # Check Shortfall Banner
                shortfall_banner = page.locator("text=Covenant Shortfall Triggered")
                if shortfall_banner.count() > 0:
                    record_pass("TEST-5.2", "Covenant Shortfall Alert banner dynamically displayed")
                else:
                    record_fail("TEST-5.2", "Covenant Shortfall Alert banner failed to render")

                # Check updated metrics ($20k + $6k = $26k, Index 2.0 + 0.6 = 2.6000)
                metrics_after_shortfall = metrics_section.inner_text()
                if "$26,000" in metrics_after_shortfall and "2.6000" in metrics_after_shortfall:
                    record_pass("TEST-5.3", "Metrics updated: $26,000 total inflow, 2.6000 cumulative index")
                else:
                    record_fail("TEST-5.3", f"Metrics mismatch after shortfall: {metrics_after_shortfall}")

                # Check Alice received 50% of 6k ($3,000)
                alice_card_shortfall = page.locator(".rounded-xl:has(h4:has-text('Alice'))").inner_text()
                if "$3,000 USDC" in alice_card_shortfall:
                    record_pass("TEST-5.4", "Alice received 50% pro-rata share of shortfall ($3,000 USDC)")
                else:
                    record_fail("TEST-5.4", f"Alice shortfall mismatch: {alice_card_shortfall}")

            # Capture Desktop Full Page Screenshot
            desktop_shot = os.path.join(ARTIFACTS_DIR, "e2e_console_desktop_verified.png")
            page.screenshot(path=desktop_shot, full_page=True)
            record_pass("TEST-5.5", f"Captured full-resolution desktop artifact: {desktop_shot}")

            # -------------------------------------------------------------
            # TEST 6: MOBILE VIEWPORT RESPONSIVENESS & OVERFLOW CHECK
            # -------------------------------------------------------------
            print("\n>>> [TEST 6] Testing Mobile Viewport (390x844 iPhone 14)...")
            page.set_viewport_size({"width": 390, "height": 844})
            page.wait_for_timeout(500)

            has_h_overflow = page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth + 1")
            if not has_h_overflow:
                record_pass("TEST-6.1", "Zero horizontal overflow on mobile viewport (scrollWidth <= innerWidth)")
            else:
                record_fail("TEST-6.1", "Horizontal overflow detected on mobile viewport")

            # Capture Mobile Screenshot
            mobile_shot = os.path.join(ARTIFACTS_DIR, "e2e_console_mobile_verified.png")
            page.screenshot(path=mobile_shot, full_page=True)
            record_pass("TEST-6.2", f"Captured full-resolution mobile artifact: {mobile_shot}")

        except Exception as e:
            record_fail("EXCEPTION", f"Unexpected runtime failure during E2E run: {str(e)}")
        finally:
            browser.close()

    print("\n===============================================================================")
    print(f"  E2E TEST RUN SUMMARY: {pass_count} PASSED | {fail_count} FAILED")
    print("===============================================================================\n")

    if fail_count > 0:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    run_tests()
