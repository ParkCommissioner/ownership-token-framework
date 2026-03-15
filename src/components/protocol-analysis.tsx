"use client"

import { Link } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { PageWrapper } from "@/components/page-wrapper"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MetricDef {
  key: string
  label: string
  unit: string
  color: string
  domain: [number, number]
  format: (v: number) => string
  strokeWidth?: number
}

interface RateOverlay {
  key: string
  label: string
  color: string
  format: (v: number) => string
}

type EventCategory = "macro" | "rates" | "protocol" | "mechanism"

interface TimelineEvent {
  m: number
  label: string
  cat: EventCategory
  detail: string
}

interface SummaryStat {
  label: string
  value: string
  color: string
  subtitle: string
}

interface ProtocolConfig {
  id: string
  headerName: string
  headerAccent: string
  accentColor: string
  description: string
  metrics: MetricDef[]
  rateOverlays: RateOverlay[]
  rateDomain: [number, number]
  defaultMetrics: string[]
  data: Record<string, number | string>[]
  events: TimelineEvent[]
  stats: SummaryStat[]
  observations?: { header: string; body: string }[]
  methodology: string[]
}

// ---------------------------------------------------------------------------
// Category colors
// ---------------------------------------------------------------------------

const CAT_COLORS: Record<
  EventCategory,
  { color: string; bg: string; border: string }
> = {
  macro: { color: "#3b82f6", bg: "#eff6ff", border: "#93c5fd" },
  rates: { color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d" },
  protocol: { color: "#22c55e", bg: "#f0fdf4", border: "#86efac" },
  mechanism: { color: "#8b5cf6", bg: "#f5f3ff", border: "#c4b5fd" },
}

const CAT_LABELS: Record<EventCategory, string> = {
  macro: "Macro",
  rates: "Rates",
  protocol: "Protocol",
  mechanism: "Mechanism",
}

// ---------------------------------------------------------------------------
// Protocol configs
// ---------------------------------------------------------------------------

const AAVE_CONFIG: ProtocolConfig = {
  id: "aave",
  headerName: "stkAAVE",
  headerAccent: "Safety Module",
  accentColor: "#B6509E",
  description:
    "Stake rate and outcome variables over time, annotated with events across four intervention layers. Toggle metrics and rate overlays.",
  metrics: [
    {
      key: "sr",
      label: "Stake Rate",
      unit: "%",
      color: "#3b82f6",
      domain: [0, 30],
      format: (v) => `${v}%`,
      strokeWidth: 2.5,
    },
    {
      key: "cs",
      label: "Circulating Supply",
      unit: "M",
      color: "#8b5cf6",
      domain: [12, 16],
      format: (v) => `${v}M`,
    },
    {
      key: "apr",
      label: "stkAAVE APR",
      unit: "%",
      color: "#22c55e",
      domain: [0, 25],
      format: (v) => `${v}%`,
    },
    {
      key: "pe",
      label: "AAVE Price",
      unit: "$",
      color: "#ec4899",
      domain: [0, 500],
      format: (v) => `$${v}`,
    },
    {
      key: "rev",
      label: "Protocol Revenue",
      unit: "$M/q",
      color: "#ef4444",
      domain: [0, 6],
      format: (v) => `$${v}M`,
    },
  ],
  rateOverlays: [
    { key: "dsr", label: "DSR", color: "#f59e0b", format: (v) => `${v}%` },
    {
      key: "usr",
      label: "AAVE USDC Rate",
      color: "#06b6d4",
      format: (v) => `${v}%`,
    },
  ],
  rateDomain: [0, 10],
  defaultMetrics: ["sr"],
  data: [
    { date: "Sep 20", m: 0, sr: 5.0, cs: 13.0, apr: 22.0, pe: 53, rev: 0.1, dsr: 0, usr: 2.5 },
    { date: "Dec 20", m: 3, sr: 12.5, cs: 13.2, apr: 14.0, pe: 88, rev: 0.4, dsr: 0, usr: 3.0 },
    { date: "Mar 21", m: 6, sr: 18.0, cs: 13.5, apr: 10.5, pe: 370, rev: 1.8, dsr: 0, usr: 4.5 },
    { date: "Jun 21", m: 9, sr: 22.5, cs: 14.0, apr: 8.0, pe: 280, rev: 2.5, dsr: 0, usr: 3.0 },
    { date: "Sep 21", m: 12, sr: 24.0, cs: 14.2, apr: 7.5, pe: 340, rev: 3.2, dsr: 0, usr: 2.5 },
    { date: "Dec 21", m: 15, sr: 23.5, cs: 14.5, apr: 7.0, pe: 260, rev: 2.8, dsr: 0, usr: 2.0 },
    { date: "Mar 22", m: 18, sr: 22.0, cs: 14.7, apr: 6.8, pe: 166, rev: 1.5, dsr: 0, usr: 1.5 },
    { date: "Jun 22", m: 21, sr: 20.5, cs: 14.9, apr: 6.5, pe: 56, rev: 0.8, dsr: 1.0, usr: 1.2 },
    { date: "Sep 22", m: 24, sr: 20.0, cs: 15.0, apr: 6.2, pe: 78, rev: 0.6, dsr: 1.0, usr: 1.5 },
    { date: "Dec 22", m: 27, sr: 19.5, cs: 15.0, apr: 6.0, pe: 55, rev: 0.5, dsr: 1.0, usr: 1.8 },
    { date: "Mar 23", m: 30, sr: 21.0, cs: 15.1, apr: 6.5, pe: 74, rev: 0.7, dsr: 1.0, usr: 2.0 },
    { date: "Jun 23", m: 33, sr: 20.0, cs: 15.2, apr: 6.2, pe: 62, rev: 0.9, dsr: 3.49, usr: 3.5 },
    { date: "Sep 23", m: 36, sr: 19.0, cs: 15.2, apr: 5.8, pe: 58, rev: 1.0, dsr: 5.0, usr: 4.2 },
    { date: "Dec 23", m: 39, sr: 18.5, cs: 15.3, apr: 5.5, pe: 105, rev: 1.4, dsr: 5.0, usr: 4.0 },
    { date: "Mar 24", m: 42, sr: 17.5, cs: 15.3, apr: 5.0, pe: 113, rev: 2.0, dsr: 5.0, usr: 5.5 },
    { date: "Jun 24", m: 45, sr: 16.5, cs: 15.3, apr: 4.8, pe: 91, rev: 2.5, dsr: 7.0, usr: 6.0 },
    { date: "Sep 24", m: 48, sr: 17.0, cs: 15.3, apr: 4.6, pe: 148, rev: 3.5, dsr: 6.0, usr: 4.5 },
    { date: "Dec 24", m: 51, sr: 18.5, cs: 15.3, apr: 4.6, pe: 340, rev: 5.0, dsr: 5.0, usr: 3.8 },
    { date: "Mar 25", m: 54, sr: 19.0, cs: 15.3, apr: 4.5, pe: 200, rev: 4.0, dsr: 4.5, usr: 3.5 },
    { date: "Jun 25", m: 57, sr: 17.0, cs: 15.3, apr: 4.0, pe: 230, rev: 3.5, dsr: 4.5, usr: 3.0 },
    { date: "Sep 25", m: 60, sr: 16.5, cs: 15.3, apr: 3.8, pe: 175, rev: 3.0, dsr: 4.0, usr: 2.8 },
    { date: "Dec 25", m: 63, sr: 16.0, cs: 15.3, apr: 3.5, pe: 160, rev: 2.8, dsr: 4.0, usr: 2.5 },
    { date: "Mar 26", m: 66, sr: 16.5, cs: 15.3, apr: 3.5, pe: 128, rev: 2.5, dsr: 3.5, usr: 2.2 },
  ],
  events: [
    { m: 0, label: "Safety Module Launch", cat: "mechanism", detail: "stkAAVE goes live. 1,100 AAVE/day emissions. 10-day cooldown. 30% max slashing." },
    { m: 6, label: "DeFi Summer Peak", cat: "macro", detail: "ETH $1,800+. Peak DeFi euphoria. TVL at all-time highs." },
    { m: 15, label: "Market Top", cat: "macro", detail: "ETH ~$4,000. AAVE ~$260. Crypto market peaks." },
    { m: 18, label: "Terra/Luna Collapse", cat: "macro", detail: "UST depeg. Cascading liquidations. DeFi TVL drops ~60%." },
    { m: 21, label: "3AC / Celsius Contagion", cat: "macro", detail: "CeFi contagion. ETH ~$1,000. V2 liquidity mining ends May 2022." },
    { m: 24, label: "SM v1.5 Upgrade Proposed", cat: "mechanism", detail: "BGD proposes Safety Module upgrade: improved slashing, exchange rate tracking." },
    { m: 27, label: "FTX Collapse", cat: "macro", detail: "FTX implosion. ETH ~$1,200. Stake rate holds ~19.5%, showing floor resilience." },
    { m: 30, label: "GHO Launch Prep", cat: "protocol", detail: "GHO stablecoin parameters finalised. stkAAVE holders get 25% GHO borrow discount." },
    { m: 33, label: "DSR Raised to 3.49%", cat: "rates", detail: "MakerDAO DSR jumps to 3.49%, later 5%+. Competes with stkAAVE ~6% yield." },
    { m: 36, label: "stkGHO Launched", cat: "mechanism", detail: "GHO staking goes live. Stablecoin alternative in Safety Module. ~5.5% APR." },
    { m: 39, label: "Aave V3 Maturity", cat: "protocol", detail: "V3 across Arbitrum, Optimism, Base, Polygon. Multi-chain revenue expansion." },
    { m: 42, label: "Emissions Cut to 820/day", cat: "mechanism", detail: "AAVE emissions reduced from 1,100 to 820/day. Yield drops ~1.5%." },
    { m: 45, label: "Aavenomics Proposal", cat: "protocol", detail: "Marc Zeller proposes buyback, fee switch, Umbrella. Aug 2024 governance vote." },
    { m: 48, label: "$50M Buyback Approved", cat: "protocol", detail: "$50M annual buyback. Weekly $250K-$1.75M. AAVE rallies." },
    { m: 51, label: "AAVE Hits $380 ATH", cat: "macro", detail: "Crypto bull run. AAVE all-time high $381." },
    { m: 54, label: "Buyback Execution Begins", cat: "protocol", detail: "AFC starts weekly buybacks via CoW Swap. Apr 2025." },
    { m: 57, label: "Umbrella Goes Live", cat: "mechanism", detail: "Umbrella replaces Safety Module. Emissions cut to 315/day. Yield drops to ~4%." },
    { m: 60, label: "Further Emission Cuts", cat: "mechanism", detail: "TokenLogic proposes incremental reductions." },
    { m: 63, label: "Macro Softening", cat: "macro", detail: "Broader crypto pullback. ETH below $2,500." },
  ],
  stats: [
    { label: "Observed Range", value: "16 – 24%", color: "#3b82f6", subtitle: "of AAVE supply staked" },
    { label: "Bear Floor", value: "~16%", color: "#ef4444", subtitle: "yield-inelastic base" },
    { label: "Bull Ceiling", value: "~24%", color: "#22c55e", subtitle: "peak engagement" },
    { label: "Current", value: "~16.5%", color: "#8b5cf6", subtitle: "post-Umbrella" },
  ],
  methodology: [
    "Stake rate = stkAAVE supply / 16M total. Data reconstructed from Messari quarterlies, on-chain queries, and governance posts. AAVE price in USD tracks market response to mechanism changes. stkAAVE APR reflects emissions schedule changes. Protocol revenue is quarterly gross from DefiLlama. DSR and AAVE USDC supply rate represent the competitive risk-free DeFi yield at each point.",
    "This is the template format. Each protocol in the comparative set (veCRV, veAERO, vePENDLE, esGMX, sETHFI, SKY) receives the same treatment with equivalent metrics adjusted for their mechanism type. The four event layers enable cross-protocol comparison of what moved the needle versus what was noise.",
  ],
}

const AERO_CONFIG: ProtocolConfig = {
  id: "aerodrome",
  headerName: "veAERO",
  headerAccent: "Vote-Escrow on Base",
  accentColor: "#0052FF",
  description:
    "Lock rate and outcome variables from launch (Aug 2023) through Mar 2026. Aerodrome is a Solidly-fork ve(3,3) DEX: 100% of trading fees flow to veAERO voters, with anti-dilution rebases.",
  metrics: [
    {
      key: "lr",
      label: "Lock Rate (veAERO)",
      unit: "%",
      color: "#0052FF",
      domain: [30, 95],
      format: (v) => `${v}%`,
      strokeWidth: 2.5,
    },
    {
      key: "cs",
      label: "Total Supply",
      unit: "M",
      color: "#8b5cf6",
      domain: [400, 1100],
      format: (v) => `${v}M`,
    },
    {
      key: "tvl",
      label: "TVL",
      unit: "$M",
      color: "#22c55e",
      domain: [0, 1600],
      format: (v) => `$${v}M`,
    },
    {
      key: "pe",
      label: "AERO Price",
      unit: "$",
      color: "#ec4899",
      domain: [0, 2.5],
      format: (v) => `$${v.toFixed(2)}`,
    },
    {
      key: "rev",
      label: "Quarterly Revenue",
      unit: "$M",
      color: "#ef4444",
      domain: [0, 25],
      format: (v) => `$${v}M`,
    },
    {
      key: "ep",
      label: "Emissions/Epoch",
      unit: "M",
      color: "#a855f7",
      domain: [5, 16],
      format: (v) => `${v}M`,
    },
  ],
  rateOverlays: [
    { key: "dsr", label: "DSR", color: "#f59e0b", format: (v) => `${v}%` },
    {
      key: "usr",
      label: "AAVE USDC Rate",
      color: "#06b6d4",
      format: (v) => `${v}%`,
    },
  ],
  rateDomain: [0, 10],
  defaultMetrics: ["lr"],
  data: [
    { date: "Aug 23", m: 0, lr: 90.0, cs: 500, tvl: 30, pe: 0.01, rev: 0, ep: 10.0, dsr: 5.0, usr: 3.0 },
    { date: "Oct 23", m: 2, lr: 85.0, cs: 520, tvl: 45, pe: 0.03, rev: 0.2, ep: 11.5, dsr: 5.0, usr: 4.0 },
    { date: "Dec 23", m: 4, lr: 78.0, cs: 560, tvl: 80, pe: 0.006, rev: 0.8, ep: 13.0, dsr: 5.0, usr: 4.2 },
    { date: "Feb 24", m: 6, lr: 68.0, cs: 610, tvl: 200, pe: 0.09, rev: 2.5, ep: 14.5, dsr: 5.0, usr: 4.5 },
    { date: "Apr 24", m: 8, lr: 60.0, cs: 660, tvl: 700, pe: 2.38, rev: 12.0, ep: 14.8, dsr: 5.0, usr: 5.0 },
    { date: "Jun 24", m: 10, lr: 56.0, cs: 710, tvl: 500, pe: 0.8, rev: 8.0, ep: 13.5, dsr: 7.0, usr: 5.5 },
    { date: "Aug 24", m: 12, lr: 53.0, cs: 750, tvl: 550, pe: 0.7, rev: 10.0, ep: 12.8, dsr: 6.0, usr: 4.5 },
    { date: "Oct 24", m: 14, lr: 52.0, cs: 790, tvl: 650, pe: 1.15, rev: 14.0, ep: 12.2, dsr: 6.0, usr: 4.0 },
    { date: "Dec 24", m: 16, lr: 50.0, cs: 830, tvl: 1400, pe: 2.33, rev: 20.0, ep: 11.5, dsr: 5.0, usr: 3.8 },
    { date: "Feb 25", m: 18, lr: 49.0, cs: 860, tvl: 900, pe: 1.58, rev: 15.0, ep: 11.0, dsr: 4.5, usr: 3.5 },
    { date: "Apr 25", m: 20, lr: 48.0, cs: 890, tvl: 350, pe: 0.31, rev: 6.0, ep: 10.5, dsr: 4.5, usr: 3.0 },
    { date: "Jun 25", m: 22, lr: 47.0, cs: 910, tvl: 600, pe: 0.7, rev: 12.0, ep: 10.0, dsr: 4.5, usr: 3.0 },
    { date: "Aug 25", m: 24, lr: 47.0, cs: 930, tvl: 600, pe: 0.8, rev: 14.0, ep: 9.5, dsr: 4.0, usr: 2.8 },
    { date: "Oct 25", m: 26, lr: 46.0, cs: 940, tvl: 500, pe: 0.75, rev: 10.0, ep: 9.2, dsr: 4.0, usr: 2.5 },
    { date: "Dec 25", m: 28, lr: 45.0, cs: 950, tvl: 400, pe: 0.55, rev: 8.0, ep: 9.0, dsr: 4.0, usr: 2.5 },
    { date: "Mar 26", m: 31, lr: 45.0, cs: 960, tvl: 346, pe: 0.38, rev: 6.0, ep: 8.8, dsr: 3.5, usr: 2.2 },
  ],
  events: [
    { m: 0, label: "Aerodrome Launch on Base", cat: "mechanism", detail: "500M initial supply, 90% locked as veAERO. Emissions 10M/epoch. ve(3,3) with anti-dilution rebases." },
    { m: 2, label: "ATL / Early Price Discovery", cat: "macro", detail: "AERO near ATL ~$0.03. Extremely low liquidity. Base ecosystem nascent." },
    { m: 4, label: "Base Ecosystem Traction", cat: "protocol", detail: "AERO stabilizes ~$0.006. Base TVL growing. Aerodrome >35% of Base TVL." },
    { m: 6, label: "CB Ventures Investment", cat: "protocol", detail: "Coinbase Base Ecosystem Fund invests. Signal of legitimacy. AERO rallies toward $1+." },
    { m: 8, label: "Slipstream Launch / ATH $2.38", cat: "mechanism", detail: "Concentrated liquidity launches Apr 2024. AERO hits $2.38. TVL $700M. Weekly fees $21M." },
    { m: 10, label: "Post-ATH Correction", cat: "macro", detail: "DeFi correction. AERO pulls back to $0.70-1.00. TVL stabilizes." },
    { m: 12, label: "Peak Emission Phase Ending", cat: "mechanism", detail: "Take-off phase complete. Emissions transition to 1% weekly decay." },
    { m: 14, label: "Animoca Brands Purchase", cat: "macro", detail: "Animoca large market purchase + stake. Token spikes. Whale accumulation." },
    { m: 16, label: "AERO ATH $2.33 / TVL $1.4B", cat: "macro", detail: "Bull run peak. AERO all-time high $2.33 (Dec 7). Top-5 DeFi by profitability." },
    { m: 18, label: "Bull Run Fading", cat: "macro", detail: "AERO at $1.58 start of 2025. Sustained decline begins." },
    { m: 20, label: "Market Crash to $0.31", cat: "macro", detail: "Altcoin correction. AERO -80%. TVL contracts to $350M." },
    { m: 22, label: "Recovery + $250M Cumulative Fees", cat: "protocol", detail: "AERO recovers to $0.70+. Cumulative swap fees surpass $250M." },
    { m: 24, label: "Slipstream Dominance", cat: "protocol", detail: "Slipstream captures 64% of comparable pool volume, surpassing Uniswap V3 on Base." },
    { m: 26, label: "DNS Hijacking + Aero Merger", cat: "mechanism", detail: "Front-end DNS attack Nov 2025. Aero merger with Velodrome announced. Single cross-chain token." },
    { m: 28, label: "Aero Fed Approaching", cat: "mechanism", detail: "Emissions approaching 9M/epoch threshold. veAERO voters take control of monetary policy." },
    { m: 31, label: "Current State", cat: "macro", detail: "AERO ~$0.38. TVL ~$346M. Supply ~960M. Lock rate ~45%. ~$97M annualized fees." },
  ],
  stats: [
    { label: "Lock Rate Range", value: "45 – 90%", color: "#0052FF", subtitle: "of total AERO supply" },
    { label: "Stabilized Band", value: "45 – 55%", color: "#22c55e", subtitle: "post-emission dilution" },
    { label: "Current Lock Rate", value: "~45%", color: "#8b5cf6", subtitle: "~430M of 960M supply" },
    { label: "Cumulative Fees", value: ">$250M", color: "#ef4444", subtitle: "since Aug 2023" },
    { label: "Current Inflation", value: "~25%", color: "#a855f7", subtitle: "annualized, decaying" },
  ],
  observations: [
    {
      header: "Lock rate decline is entirely supply-driven, not behavioral.",
      body: "The drop from 90% to 45% is almost entirely explained by emission dilution expanding the denominator (500M to 960M supply). In absolute terms, locked AERO has likely grown. The ve(3,3) rebase mechanism, which compensates lockers proportionally to emissions, creates a structural incentive to maintain locks that does not exist in standard ve models like veCRV.",
    },
    {
      header: "Revenue is real and substantial.",
      body: "$250M+ cumulative fees in 2.5 years. At peak ($21M weekly), Aerodrome was top-5 most profitable DeFi protocol. This provides genuine fundamental backing for lock yields, unlike inflationary staking rewards.",
    },
    {
      header: "The Aero Fed transition is the key upcoming inflection.",
      body: "When emissions drop below 9M/epoch (~epoch 67), veAERO voters take direct control of monetary policy. This is unprecedented in DeFi: token holders setting their own inflation rate by majority vote.",
    },
    {
      header: "Price is heavily macro-correlated.",
      body: "The $0.006 to $2.33 to $0.38 USD trajectory tracks broader altcoin cycles almost perfectly. Lock rate, by contrast, is far more stable. This supports the thesis that mechanism design matters more for participation metrics than for price, and that macro swamps token-specific factors in price terms.",
    },
  ],
  methodology: [
    "Lock rate = veAERO voting power supply / total AERO supply. Data reconstructed from DefiLlama, CoinCodex supply data, Aerodrome governance docs, and on-chain epoch data. AERO price in USD tracks market response to mechanism changes and macro cycles. Emissions/epoch tracks the emission schedule from take-off (3% weekly increase for 14 epochs) through cruise (1% weekly decay). TVL and quarterly revenue from DefiLlama.",
    "Note: Aerodrome\u2019s ve(3,3) model differs structurally from Curve\u2019s veCRV. The anti-dilution rebase gives veAERO holders proportional compensation for emissions, and voters receive 100% of trading fees (vs 50% for veCRV). These differences mean lock rate comparisons require adjustment for the rebase effect on the denominator.",
  ],
}

const CONFIGS: Record<string, ProtocolConfig> = {
  aave: AAVE_CONFIG,
  aerodrome: AERO_CONFIG,
}

// Protocols that have analysis pages
const AVAILABLE_PROTOCOLS = new Set(Object.keys(CONFIGS))

// ---------------------------------------------------------------------------
// Placeholder page for protocols without data
// ---------------------------------------------------------------------------

function PlaceholderPage({ protocolId }: { protocolId: string }) {
  return (
    <PageWrapper>
      <section className="bg-background">
        <Container className="py-10">
          <Link
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium mb-6"
            to="/value-accrual"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to flowchart
          </Link>
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl text-muted-foreground font-bold">
                {protocolId.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="text-center max-w-md space-y-3">
              <h1 className="text-2xl font-bold text-accent-foreground">
                {protocolId.charAt(0).toUpperCase() + protocolId.slice(1)}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                No chronological data yet. Try{" "}
                <Link
                  className="text-primary hover:underline font-medium"
                  to="/value-accrual/$protocolId"
                  params={{ protocolId: "aave" }}
                >
                  AAVE
                </Link>{" "}
                or{" "}
                <Link
                  className="text-primary hover:underline font-medium"
                  to="/value-accrual/$protocolId"
                  params={{ protocolId: "aerodrome" }}
                >
                  Aerodrome
                </Link>{" "}
                for an example of the chronological analysis format.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </PageWrapper>
  )
}

// ---------------------------------------------------------------------------
// Toggle pill
// ---------------------------------------------------------------------------

function TogglePill({
  active,
  color,
  label,
  onClick,
}: {
  active: boolean
  color: string
  label: string
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all cursor-pointer",
        active
          ? "text-foreground"
          : "bg-white text-muted-foreground border-border hover:border-muted-foreground/40"
      )}
      onClick={onClick}
      style={
        active
          ? {
              backgroundColor: `${color}10`,
              borderColor: `${color}60`,
              color,
            }
          : undefined
      }
      type="button"
    >
      <span
        className="size-2 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      {label}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Custom tooltip
// ---------------------------------------------------------------------------

function ChartTooltipContent({
  active,
  payload,
  config,
  activeMetrics,
  showRates,
}: {
  active?: boolean
  payload?: Array<{ dataKey: string; value: number; color: string; payload?: Record<string, number | string> }>
  config: ProtocolConfig
  activeMetrics: Set<string>
  showRates: boolean
}) {
  if (!active || !payload?.length) return null

  const dateEntry = payload[0]?.payload as Record<string, number | string>
  const allDefs = [...config.metrics, ...config.rateOverlays]

  return (
    <div className="rounded-lg border bg-background p-2.5 shadow-md text-xs space-y-1">
      <p className="font-medium text-foreground">{dateEntry?.date as string}</p>
      {payload.map((entry) => {
        const def = allDefs.find((d) => d.key === entry.dataKey)
        if (!def) return null
        const isRate = config.rateOverlays.some((r) => r.key === entry.dataKey)
        if (isRate && !showRates) return null
        if (!isRate && !activeMetrics.has(entry.dataKey)) return null
        return (
          <div className="flex items-center justify-between gap-4" key={entry.dataKey}>
            <span className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: def.color }}
              />
              <span className="text-muted-foreground">{def.label}</span>
            </span>
            <span className="font-mono font-medium" style={{ color: def.color }}>
              {def.format(entry.value)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ProtocolAnalysis({ protocolId }: { protocolId: string }) {
  const config = CONFIGS[protocolId]
  if (!config) return <PlaceholderPage protocolId={protocolId} />

  return <AnalysisPage config={config} />
}

function AnalysisPage({ config }: { config: ProtocolConfig }) {
  const [activeMetrics, setActiveMetrics] = useState<Set<string>>(
    () => new Set(config.defaultMetrics)
  )
  const [showRates, setShowRates] = useState(false)
  const [catFilter, setCatFilter] = useState<EventCategory | "all">("all")
  const [highlightedEvent, setHighlightedEvent] = useState<number | null>(null)
  const [pinnedEvent, setPinnedEvent] = useState<number | null>(null)
  const eventRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const currentHighlight = pinnedEvent ?? highlightedEvent

  const filteredEvents =
    catFilter === "all"
      ? config.events
      : config.events.filter((e) => e.cat === catFilter)

  const toggleMetric = useCallback((key: string) => {
    setActiveMetrics((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const handleChartHover = useCallback(
    (state: { activeTooltipIndex?: number }) => {
      if (pinnedEvent !== null) return
      if (state.activeTooltipIndex == null) {
        setHighlightedEvent(null)
        return
      }
      const dataPoint = config.data[state.activeTooltipIndex]
      if (!dataPoint) return
      const m = dataPoint.m as number
      // Find nearest event
      let nearest: TimelineEvent | null = null
      let minDist = Infinity
      for (const ev of config.events) {
        const dist = Math.abs(ev.m - m)
        if (dist < minDist) {
          minDist = dist
          nearest = ev
        }
      }
      if (nearest && minDist <= 3) {
        setHighlightedEvent(nearest.m)
        const el = eventRefs.current.get(nearest.m)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "nearest" })
        }
      } else {
        setHighlightedEvent(null)
      }
    },
    [config.data, config.events, pinnedEvent]
  )

  const handleEventClick = useCallback(
    (m: number) => {
      setPinnedEvent((prev) => (prev === m ? null : m))
    },
    []
  )

  // Determine Y axes
  const activeMetricsList = config.metrics.filter((m) =>
    activeMetrics.has(m.key)
  )
  const leftMetric = activeMetricsList[0] ?? null
  const rightMetric = activeMetricsList[1] ?? null

  // If rates are on and there's no right metric, rates go on right axis
  const ratesOnRight = showRates && !rightMetric

  return (
    <PageWrapper>
      <section className="bg-background">
        <Container className="py-10">
          {/* Back link */}
          <Link
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium mb-6"
            to="/value-accrual"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to flowchart
          </Link>

          {/* Header */}
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold leading-10 tracking-tight text-accent-foreground md:text-4xl">
              {config.headerName}{" "}
              <span style={{ color: config.accentColor }}>
                {config.headerAccent}
              </span>
            </h1>
            <p className="max-w-[800px] text-base leading-7 text-muted-foreground">
              {config.description}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-background pb-16">
        <Container>
          {/* Metric toggles */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {config.metrics.map((m) => (
              <TogglePill
                active={activeMetrics.has(m.key)}
                color={m.color}
                key={m.key}
                label={m.label}
                onClick={() => toggleMetric(m.key)}
              />
            ))}
          </div>

          {/* Rate overlay toggle */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-muted-foreground mr-1">
              Benchmark rates:
            </span>
            {config.rateOverlays.map((r) => (
              <TogglePill
                active={showRates}
                color={r.color}
                key={r.key}
                label={r.label}
                onClick={() => setShowRates((v) => !v)}
              />
            ))}
          </div>

          {/* Event category filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <TogglePill
              active={catFilter === "all"}
              color="#6b7280"
              label="All"
              onClick={() => setCatFilter("all")}
            />
            {(
              Object.entries(CAT_LABELS) as [EventCategory, string][]
            ).map(([cat, label]) => (
              <TogglePill
                active={catFilter === cat}
                color={CAT_COLORS[cat].color}
                key={cat}
                label={label}
                onClick={() =>
                  setCatFilter((prev) => (prev === cat ? "all" : cat))
                }
              />
            ))}
          </div>

          {/* Chart */}
          <Card className="mb-6">
            <CardContent className="pt-4">
              <ResponsiveContainer height={400} width="100%">
                <ComposedChart
                  data={config.data}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  onMouseMove={handleChartHover}
                  onMouseLeave={() => {
                    if (pinnedEvent === null) setHighlightedEvent(null)
                  }}
                >
                  <CartesianGrid
                    stroke="#e5e7eb"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fontFamily: "monospace" }}
                    tickLine={false}
                  />

                  {/* Left Y axis */}
                  {leftMetric && (
                    <YAxis
                      domain={leftMetric.domain}
                      orientation="left"
                      tick={{
                        fontSize: 11,
                        fontFamily: "monospace",
                        fill: leftMetric.color,
                      }}
                      tickFormatter={(v: number) => leftMetric.format(v)}
                      tickLine={false}
                      yAxisId="left"
                    />
                  )}

                  {/* Right Y axis */}
                  {rightMetric && (
                    <YAxis
                      domain={rightMetric.domain}
                      orientation="right"
                      tick={{
                        fontSize: 11,
                        fontFamily: "monospace",
                        fill: rightMetric.color,
                      }}
                      tickFormatter={(v: number) => rightMetric.format(v)}
                      tickLine={false}
                      yAxisId="right"
                    />
                  )}

                  {/* Rate axis (right) */}
                  {ratesOnRight && (
                    <YAxis
                      domain={config.rateDomain}
                      orientation="right"
                      tick={{
                        fontSize: 11,
                        fontFamily: "monospace",
                        fill: "#9ca3af",
                      }}
                      tickFormatter={(v: number) => `${v}%`}
                      tickLine={false}
                      yAxisId="rates"
                    />
                  )}

                  <Tooltip
                    content={
                      <ChartTooltipContent
                        config={config}
                        activeMetrics={activeMetrics}
                        showRates={showRates}
                      />
                    }
                  />

                  {/* Event reference lines */}
                  {filteredEvents.map((ev) => (
                    <ReferenceLine
                      key={ev.m}
                      stroke={CAT_COLORS[ev.cat].color}
                      strokeDasharray="4 4"
                      strokeOpacity={currentHighlight === ev.m ? 0.9 : 0.2}
                      x={
                        config.data.find(
                          (d) => (d.m as number) === ev.m
                        )?.date as string
                      }
                      yAxisId={leftMetric ? "left" : ratesOnRight ? "rates" : undefined}
                    />
                  ))}

                  {/* Metric lines */}
                  {config.metrics.map((m, i) => {
                    if (!activeMetrics.has(m.key)) return null
                    const yAxisId =
                      i === 0 || m.key === leftMetric?.key
                        ? "left"
                        : i === 1 || m.key === rightMetric?.key
                          ? "right"
                          : "left"
                    return (
                      <Line
                        animationDuration={800}
                        animationEasing="ease-out"
                        dataKey={m.key}
                        dot={false}
                        key={m.key}
                        stroke={m.color}
                        strokeWidth={m.strokeWidth ?? 1.8}
                        type="monotone"
                        yAxisId={yAxisId}
                      />
                    )
                  })}

                  {/* Rate overlay lines */}
                  {showRates &&
                    config.rateOverlays.map((r) => (
                      <Line
                        animationDuration={800}
                        animationEasing="ease-out"
                        dataKey={r.key}
                        dot={false}
                        key={r.key}
                        stroke={r.color}
                        strokeDasharray="6 3"
                        strokeWidth={1.5}
                        type="monotone"
                        yAxisId={ratesOnRight ? "rates" : rightMetric ? "right" : "left"}
                      />
                    ))}
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
            {config.stats.map((stat) => (
              <div
                className="rounded-lg border bg-card p-3 flex flex-col gap-1"
                key={stat.label}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </span>
                <span
                  className="text-lg font-bold font-mono tabular-nums"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  {stat.subtitle}
                </span>
              </div>
            ))}
          </div>

          {/* Event timeline */}
          <h2 className="text-base font-semibold mb-4 text-foreground">
            Event Timeline
          </h2>
          <div className="space-y-2 mb-8">
            {filteredEvents.map((ev) => {
              const isHighlighted = currentHighlight === ev.m
              const catStyle = CAT_COLORS[ev.cat]
              // Find metric value at this event's month
              const dataPoint = config.data.find(
                (d) => (d.m as number) === ev.m
              )
              const primaryKey =
                config.defaultMetrics[0] ?? config.metrics[0]?.key
              const primaryValue = dataPoint
                ? (dataPoint[primaryKey] as number)
                : null
              const primaryMetric = config.metrics.find(
                (m) => m.key === primaryKey
              )

              return (
                <div
                  className={cn(
                    "rounded-lg border p-3 cursor-pointer transition-all duration-200",
                    isHighlighted
                      ? "shadow-sm"
                      : "bg-card hover:bg-muted/30"
                  )}
                  key={ev.m}
                  onClick={() => handleEventClick(ev.m)}
                  ref={(el) => {
                    if (el) eventRefs.current.set(ev.m, el)
                  }}
                  style={
                    isHighlighted
                      ? {
                          backgroundColor: catStyle.bg,
                          borderColor: catStyle.border,
                          transform: "scale(1.01)",
                          boxShadow: `0 2px 8px ${catStyle.color}20`,
                        }
                      : undefined
                  }
                >
                  <div className="flex items-start gap-3">
                    {/* Category dot */}
                    <span
                      className="size-[9px] rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: catStyle.color }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-2 min-w-0">
                          <span className="text-xs font-mono text-muted-foreground shrink-0">
                            {
                              config.data.find(
                                (d) => (d.m as number) === ev.m
                              )?.date as string
                            }
                          </span>
                          <span
                            className={cn(
                              "text-sm font-semibold truncate",
                              isHighlighted
                                ? ""
                                : "text-foreground"
                            )}
                            style={
                              isHighlighted
                                ? { color: catStyle.color }
                                : undefined
                            }
                          >
                            {ev.label}
                          </span>
                        </div>
                        {primaryValue !== null && primaryMetric && (
                          <span className="text-xs font-mono text-muted-foreground/60 shrink-0">
                            {primaryMetric.format(primaryValue)}
                          </span>
                        )}
                      </div>

                      {/* Detail - expand when highlighted */}
                      <div
                        className="overflow-hidden transition-all duration-300"
                        style={{
                          maxHeight: isHighlighted ? "200px" : "0px",
                          opacity: isHighlighted ? 1 : 0,
                        }}
                      >
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          {ev.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Key observations (Aerodrome only) */}
          {config.observations && config.observations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-base font-semibold mb-4 text-foreground">
                Key Observations
              </h2>
              <div className="space-y-4 max-w-[800px]">
                {config.observations.map((obs, i) => (
                  <p
                    className="text-sm leading-relaxed text-accent-foreground"
                    key={i}
                  >
                    <strong>{obs.header}</strong> {obs.body}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Methodology */}
          <div className="border-t pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Methodology
            </h3>
            <div className="space-y-3 max-w-[800px]">
              {config.methodology.map((p, i) => (
                <p
                  className="text-xs text-muted-foreground leading-relaxed"
                  key={i}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </PageWrapper>
  )
}

// Export for use in flowchart terminal panel links
export { AVAILABLE_PROTOCOLS }
