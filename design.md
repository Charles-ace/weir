# DESIGN SYSTEM SPECIFICATION — `WEIR`

## Visual Identity
Industrial, high-precision hydraulic aesthetic. Deep slate/zinc dark mode with precise amber/cyan telemetry indicators. Zero consumer gradient slop; clean data-dense typography.

## Color Palette
- **Background Root:** `#0B0F17` (Deep Obsidian Zinc)
- **Card / Surface Background:** `#111827` (Matte Slate)
- **Border / Divider:** `#1F2937` (Subtle Wireframe Gray)
- **Primary Accent (Flow / Active):** `#06B6D4` (Hydraulic Cyan)
- **Secondary Accent (Verification / Invariant):** `#10B981` (Emerald Verified)
- **Warning / Shortfall Indicator:** `#F59E0B` (Amber Alert)
- **Text Primary:** `#F9FAFB` (Crisp Off-White)
- **Text Secondary:** `#9CA3AF` (Muted Steel Gray)
- **Monospace Code/Telemetry:** `#E5E7EB` with JetBrains Mono / Roboto Mono

## Typography Scale
- **Display 1 (Hero Hook):** 36px / 44px Line Height — SemiBold
- **Heading 2 (Asset Title / Cards):** 20px / 28px Line Height — Medium
- **Subheading (Telemetry Metric):** 14px / 20px Line Height — Medium (Uppercase, tracking-wider)
- **Metric Value (Numbers / Dollar amounts):** 28px / 36px Line Height — SemiBold Monospace
- **Body / Descriptive:** 14px / 22px Line Height — Regular

## Key Micro-Interactions & States
- **Attestation Status Pill:**
  - `Idle`: Zinc border, gray dot (`Waiting for Next Era`)
  - `Ingesting`: Cyan border, pulsing glow (`Detecting Sepolia Block #...`)
  - `Attesting`: Amber border, rotating indicator (`Attestors Gossiping BLS Quorum (~15s)`)
  - `Verified`: Emerald background, checkmark (`Precompile 0x0FD2: Inclusion Proven`)
- **Claim Action Button:**
  - Active: `#06B6D4` background, hover `#0891B2`, instant state feedback.
