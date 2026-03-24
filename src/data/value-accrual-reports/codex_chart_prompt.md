# Codex Prompt: Protocol Value Accrual Comparison Charts

## Context

This is the cow-flow.vercel.app Next.js project (Aragon OTF repo). There are already value-accrual pages at `/value-accrual/aave`, `/value-accrual/uni`, etc. We need to add new protocol comparison chart pages using the same project structure, styling, and component patterns.

## What to build

A set of interactive, toggleable time-series charts for each protocol below. Each protocol gets its own page at `/value-accrual/[protocol]`. There should also be a comparison overview page at `/value-accrual/compare` that allows toggling between protocols.

## Chart specification

### Metrics (toggleable series — user can show/hide each)

For each protocol, the chart should display these as toggleable overlaid time series:

1. **Performance vs. beta asset** — Protocol token price indexed to 100 at a common start date, plotted against ETH (or SOL for JUP) similarly indexed. This shows relative over/underperformance vs. the base asset.
2. **Staking APR** (if staking exists) **or Burn rate %** (annualized burn as % of circulating supply, if burn-only model). Single line or area.
3. **Circulating supply** — Total circulating tokens over time. Include the effect of buybacks (net of emissions) where applicable. Secondary y-axis.
4. **USD price** — Raw token price in USD.
5. **Stake rate %** — (if applicable) Percentage of circulating supply staked. Area fill.

### Annotations (story points)

Vertical annotation lines with tooltips at key dates. These are the curated story points from our research. When a user hovers or clicks an annotation, a tooltip displays the event description.

### Chart library

Use Recharts (already available in the project). ComposedChart with multiple YAxis entries. Reference lines for annotations with custom tooltip.

### Styling

Match existing cow-flow.vercel.app design system. Dark theme, accent colors per metric series.

---

## Protocol data and story points

### AAVE

**Beta asset**: ETH
**Mechanism**: Safety Module (stkAAVE) → Umbrella upgrade → Buy & Distribute
**Stake rate**: ~19-22% of circulating supply
**Key data points to source**: Dune (aave staking), CoinGecko (price), DefiLlama (revenue)

**Story points (annotations):**
| Date | Event |
|------|-------|
| 2020-10-07 | Safety Module launches. stkAAVE staking live with 10-day cooldown. Slashing never used. |
| 2024-07-25 | Aave v3.1 Umbrella upgrade proposed. Replaces Safety Module with asset-specific staking. |
| 2024-11-04 | "Buy and Distribute" activated. $1M/week AAVE buybacks from treasury surplus. |
| 2025-03-15 | ACI proposes cutting Buy & Distribute from $50M to $30M annualized. Governance crisis. |
| 2025-04-01 | Aavenomics passed. Weekly $1M buybacks run for 6+ months. ~70K AAVE accumulated by Aug 2025. |

---

### MKR / SKY

**Beta asset**: ETH
**Mechanism**: Smart Burn Engine (automated surplus → buyback). Rebrand MKR → SKY.
**Stake rate**: ~60-67% (SKY staking)
**Key data points to source**: makerburn.com, Dune, CoinGecko

**Story points:**
| Date | Event |
|------|-------|
| 2022-01-26 | Rune Christensen publishes "The Endgame Plan". Buyback + SubDAO structure proposed. |
| 2023-09-01 | Smart Burn Engine activates. Automated buyback of MKR from protocol surplus. |
| 2024-09-18 | Sky rebrand launches. MKR → SKY at 1:24,000 ratio. Savings rate activated. |
| 2025-02-01 | Sky begins $1M/day USDS buyback. $75M spent by Aug 2025. |
| 2025-03-01 | Smart Burn Engine LP model abandoned. Switched to direct buyback ($37.6K/day). |

---

### Synthetix (SNX)

**Beta asset**: ETH
**Mechanism**: 7 mechanism changes — inflation → fee sharing → buyback → SIP-420 protocol-owned debt
**Stake rate**: ~80% peak (inflationary era), ~50% (420 Pool)
**Key data points to source**: Synthetix staking dashboard, CoinGecko, DefiLlama

**Story points:**
| Date | Event |
|------|-------|
| 2019-03-01 | Inflationary rewards launched. 75% APY drives stake rate to 80%+. |
| 2023-11-01 | Andromeda release: Perps V3 on Base. Fee-sharing model. |
| 2024-06-01 | Kain Warwick returns. Diagnoses fee yield / collateral scaling trap. |
| 2025-03-05 | SIP-420 approved. Protocol-owned debt replaces individual C-ratio management. |
| 2025-03-15 | sUSD depegs to $0.70 following debt jubilee from SIP-420. |

---

### Hyperliquid (HYPE)

**Beta asset**: ETH
**Mechanism**: ~97% of fees → Assistance Fund → buyback. Non-discretionary.
**Stake rate**: N/A (no staking)
**Key data points to source**: ASXN dashboard, CoinGecko, Hyperliquid stats

**Story points:**
| Date | Event |
|------|-------|
| 2024-11-29 | HYPE TGE. No VC allocation. 31% airdropped to early users. |
| 2025-01-01 | Buyback machine active. ~97% of trading fees flow to Assistance Fund. |
| 2025-03-26 | JELLY exploit. $230M+ exposure. Validator committee intervenes. Centralization debate. |
| 2025-06-01 | $644M cumulative buybacks in 2025 (46% of all crypto buybacks). |
| 2025-11-01 | Team token cliff begins. Unlocks on track to exceed buyback volume by 1.8x annualized. |

---

### Jupiter (JUP)

**Beta asset**: SOL (not ETH)
**Mechanism**: 50% fees → buyback (burn + litterbox). ASR staking rewards.
**Stake rate**: ~753M JUP staked (governance-gated ASR)
**Key data points to source**: CoinGecko, Jupiter dashboard

**Story points:**
| Date | Event |
|------|-------|
| 2024-01-31 | JUP token launch. 1B airdrop ("Jupuary"). |
| 2025-01-17 | Tokenomics vote: 30% supply reduction (10B → 7B). Buyback activated (50% of fees). |
| 2025-02-15 | JUP rallies ~300% in first month of buyback. |
| 2025-06-01 | $70M spent on buybacks. Covered only 6% of unlocked tokens. Price -88% from peak. |
| 2026-01-03 | CTO Siong Ong: "Waste of resources." Questions whether to continue buybacks. |

---

### PancakeSwap (CAKE)

**Beta asset**: ETH (BNB as secondary reference)
**Mechanism**: veCAKE (killed Apr 2025) → Tokenomics 3.0 pure buyback-and-burn
**Stake rate**: N/A (staking retired April 2025, previously high under veCAKE)
**Key data points to source**: PancakeSwap burn reports, CoinGecko

**Story points:**
| Date | Event |
|------|-------|
| 2023-09-01 | CAKE deflation era begins. Burns exceed emissions for first time. |
| 2023-12-01 | veCAKE introduced. Lock up to 4yrs for gauge voting + revenue sharing + farm boost. |
| 2025-04-08 | Tokenomics 3.0 vote passes 98.89%. veCAKE, staking, revenue sharing all retired. |
| 2025-04-23 | Implementation live. Daily emissions cut from 29K → 20K → 14.5K CAKE. Pure burn model. |
| 2026-01-16 | Max supply reduced from 450M to 400M. 29th consecutive month of net deflation. |

---

### xSUSHI (SUSHI)

**Beta asset**: ETH
**Mechanism**: Fee-sharing staking (xSUSHI). Confiscated via Kanpai proposals.
**Stake rate**: ~67% peak, ~3.3% current
**Key data points to source**: CoinGecko, DefiLlama

**Story points:**
| Date | Event |
|------|-------|
| 2020-09-01 | xSUSHI launches. Stake SUSHI, earn 0.05% of all swap fees. |
| 2021-05-01 | Peak: ~67% of SUSHI staked. xSUSHI considered gold standard for simple fee sharing. |
| 2022-12-06 | Kanpai 2.0 passes. 100% of xSUSHI fee revenue redirected to DAO treasury. |
| 2023-06-01 | Jared Grey (head chef) investigated for fraud. Governance crisis. |
| 2025-01-01 | TVL down 98.7% from peak. ~3.3% stake rate. Terminal decline. |

---

### 1INCH

**Beta asset**: ETH
**Mechanism**: Unicorn Power / Fusion delegation. DAO receives zero revenue since Jun 2023.
**Stake rate**: ~8%
**Key data points to source**: CoinGecko, 1inch staking dashboard

**Story points:**
| Date | Event |
|------|-------|
| 2022-11-24 | 1INCH Fusion mode launches. Resolver-based execution with staking delegation. |
| 2023-06-01 | 1IP-28 passes. Swap Surplus fee activated — but revenue goes to Labs via API ToS, not DAO. |
| 2024-01-01 | Unicorn Power staking live. Complex delegation mechanics. ~8% stake rate. |
| 2025-07-01 | "Financial Revitalization" governance revolt. Community demands DAO revenue share. |
| 2025-09-01 | Labs controls all fee revenue. DAO treasury has zero protocol income. |

---

### ParaSwap (PSP / VLR)

**Beta asset**: ETH
**Mechanism**: Social escrow (sePSP). Revenue-starved. Rebranded to Velora/VLR Sep 2025.
**Stake rate**: ~3,300 stakers at peak
**Key data points to source**: CoinGecko, ParaSwap forum

**Story points:**
| Date | Event |
|------|-------|
| 2021-11-15 | PSP token launch. Airdrop to ~20K early users. ATH $2.10. |
| 2022-10-01 | Social escrow (sePSP) proposed. Rewards tied to protocol-positive actions. |
| 2023-09-01 | Epoch 8: 29.9 ETH distributed to 3,300 stakers. ~$14.50/staker/epoch. |
| 2024-10-01 | ParaBoost retrospective: boost mechanism failed adoption targets. |
| 2025-09-16 | Rebrand to Velora. VLR replaces PSP 1:1. PSP utility terminated immediately. |

---

### QuickSwap (QUICK)

**Beta asset**: ETH (on Polygon)
**Mechanism**: Dragon's Lair staking → Trial of Fire 100% burn → DragonFi 2.0
**Stake rate**: Low (Dragon's Lair era ~1% APY), N/A post-Trial of Fire
**Key data points to source**: CoinGecko (New QUICK), QuickSwap blog

**Story points:**
| Date | Event |
|------|-------|
| 2021-04-30 | Old QUICK ATH: $1,590. Peak Polygon DEX activity. |
| 2022-06-01 | Token redenomination: Old QUICK → New QUICK at 1:1000 ratio. |
| 2024-10-01 | Trial of Fire begins. 100% protocol revenue → buy back and burn QUICK. |
| 2025-06-25 | Burns 4.25x emissions (532K/day burned vs 125K/day emitted). |
| 2025-07-01 | DragonFi 2.0: Emissions halted entirely. Revenue funds farming + burns. |

---

## Comparison overview page (`/value-accrual/compare`)

A single page with:

1. **Protocol selector**: Checkboxes to toggle protocols on/off.
2. **Metric selector**: Radio buttons to choose which metric to compare (performance vs beta, stake rate, burn rate, etc.)
3. **Unified chart**: All selected protocols plotted on the same axes for the selected metric.
4. **Summary table below chart**:

| Protocol | Mechanism | ATH Drawdown | Stake Rate | Buyback Yield | Outcome |
|----------|-----------|-------------|------------|---------------|---------|
| AAVE | Safety Module → B&D | -72% | ~20% | ~1.5% | Active, governance friction |
| SKY | Smart Burn Engine | -90% | ~65% | ~3% | Automated, working |
| SNX | Fee share → SIP-420 | -97% | ~50% | N/A | sUSD depeg, restructuring |
| HYPE | 97% fee → buyback | +950% from TGE | N/A | ~4% | Success (narrative-driven) |
| JUP | 50% fee → buyback | -88% | ASR gated | ~7% (but < unlocks) | Failure (emissions > buybacks) |
| CAKE | veCAKE → pure burn | -94% | Killed | ~6% burn/yr | Deflation working, price not |
| QUICK | Staking → burn → DFi2.0 | -95% | Killed | ~20% burn/yr | Scale insufficient |
| xSUSHI | Fee-sharing staking | -97% | 3.3% | N/A | Terminal failure |
| 1INCH | Unicorn Power | -98% | ~8% | 0% (zero DAO rev) | Structural capture by Labs |
| PSP | Social escrow | -99.9% | Dead | N/A | Rebranded to VLR |

---

## Data sourcing notes

Price and supply data should be fetched from CoinGecko API (free tier, `/coins/{id}/market_chart` endpoint with `vs_currency=usd` and `days=max`). Beta asset data (ETH, SOL) from the same API.

For stake rates and APR — these are not available from a single API. Use hardcoded milestone data points from the story points above and interpolate linearly between them. This is acceptable for a presentation tool, not a production dashboard.

Burn rate data: Use hardcoded values from our research reports. Same interpolation approach.

## Implementation notes

- Each protocol page should be a standalone route that lazy-loads its data
- The comparison page should allow adding/removing protocols dynamically
- All charts should be responsive and work on presentation screens (1920x1080 target)
- Annotations should be visually distinct but not cluttered — use small markers that expand on hover
- Include a legend that doubles as the toggle (click series name to show/hide)
- Export-friendly: include a "Copy chart" or "Download SVG" button for deck inclusion
