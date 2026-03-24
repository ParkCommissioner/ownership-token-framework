# CoW DAO Value Distribution: Week 2 Research Update

**Prepared by: Aragon OTF — Jordan & Giorgi**
**Engagement: 6-week Value Distribution Mechanism Design**
**Status: End of Week 2 / Beginning of Week 3**

---

## 1. What we've done

### Analytic deep dives (on-chain data + event studies)
- UNI, AERO, ETHFI, AAVE, MKR/SKY — quantitative analysis with Dune/on-chain analytics
- Subset available to walk through live

### Mechanism deep dives (qualitative, primary-source research)
- **Failure cases**: xSUSHI, ParaSwap (PSP/sePSP), 1INCH (Unicorn Power)
- **Ambiguous cases**: Jupiter (JUP), PancakeSwap (CAKE), QuickSwap (QUICK), Synthetix (SNX)
- **Claimed successes**: Hyperliquid (HYPE), Aave (stkAAVE → Umbrella → Buy & Distribute), MakerDAO/Sky (MKR/SKY Smart Burn Engine)
- **ve implementations**: veCRV, veAERO, vePENDLE (reference cases — team has direct implementation experience across Mode, Yieldnest, Katana, Puffer, YieldBasis)

### Protocol landscape grid

| Protocol | Category | Mechanism | Outcome | Relevance to CoW |
|----------|----------|-----------|---------|-------------------|
| **Hyperliquid** | Perps DEX | 97% fees → buyback (non-discretionary) | +950% from TGE, $13-16B mcap | Purest buyback success; but zero VC, no emissions, narrative-driven |
| **Aave** | Lending | Safety Module → Umbrella → Buy & Distribute | Largest DeFi protocol, governance crisis over spend | Revenue-funded buyback; discretion created political friction |
| **MakerDAO/Sky** | Lending/Stablecoin | Smart Burn Engine (automated buyback) | Sustained buyback, SKY rebrand challenges | Entrenched, non-discretionary buyback. Gold standard for automation |
| **Aerodrome** | DEX (ve) | veAERO: lock → vote → earn fees + bribes | ~50% stake rate, dominant Base DEX | ve works when emissions are a resource to allocate. CoW has no equivalent |
| **Curve** | DEX (ve) | veCRV: 4yr lock → gauge votes → bribes | ~50% stake rate, built an ecosystem | Same flywheel precondition. Bribe market is the engine, not the lock |
| **EtherFi** | LRT | sETHFI: simple staking, revenue-funded | Growing protocol, staking live | Closest comp for simple CoW staking model |
| **Synthetix** | Derivatives | 7 mechanism changes in 7 years → SIP-420 | sUSD depeg ($0.70), protocol-owned debt | Proves fee yield doesn't scale with collateral. Complexity kills |
| **Jupiter** | DEX Aggregator | 50% fees → buyback, ASR staking rewards | $70M spent, -88% from peak | CTO called it "waste of resources." Buybacks < unlocks = net inflationary |
| **PancakeSwap** | DEX | veCAKE → killed staking → pure burn | 29mo deflation, still -94% from ATH | Deliberately killed ve. 98.89% vote. Gauges were value-extractive |
| **QuickSwap** | DEX | Dragon's Lair staking → Trial of Fire burn | $1.2M burned, still $0.01 | A/B tested staking vs burn. Neither moved price. Scale is the constraint |
| **1INCH** | DEX Aggregator | Unicorn Power/Fusion delegation | DAO gets zero revenue since Jun 2023 | Aggregator failure case. Labs captured all value via API ToS |
| **ParaSwap** | DEX Aggregator | Social escrow (sePSP) → rebrand to VLR | $2.2M mcap on $125B+ volume | Terminal failure. Innovative mechanism, zero revenue to fund it |
| **xSUSHI** | DEX | Fee-sharing staking | -98.7% TVL, revenue confiscated | Canonical failure. Proved low-commitment staking doesn't protect downside |

### Aggregators: a separate camp

CoW, 1INCH, and PSP share a structural challenge that DEXes and lending protocols don't face: aggregators route volume but don't own liquidity, which means revenue is a thin margin on execution quality rather than a tax on TVL. All three aggregator tokens have struggled or failed. CoW is currently the best-positioned of the three: real revenue (~$16M/yr), active buyback, 30%+ market share, and a fee model aligned with user outcomes (surplus sharing).

---

## 2. Emerging themes

### What the data says clearly

**Buybacks are a bid, not a floor.** They guarantee someone is buying. They do not guarantee a price level. JUP spent $70M and fell 88%. The mathematical relationship (annual_buyback / mcap = implied yield) is real but the market doesn't always price it.

**Emissions overwhelm buybacks.** Jupiter: $70M buyback covered 6% of unlocks. Hyperliquid works because there are zero VC tokens and minimal emissions — the net flow is positive. CoW must model net emissions (solver comp + vesting + 3% mint capacity) against buyback capacity before committing to any mechanism.

**Discretion erodes credibility.** Entrenched, automated mechanisms outperform discretionary ones. HYPE's Assistance Fund (automatic, 97%), Sky's Smart Burn Engine (automated, continuous) vs. AAVE's Buy & Distribute (ACI governance crisis over $50M→$30M cut), JUP (CTO publicly questioning continuation), 1INCH (labs unilateral redirect). The moment a mechanism becomes subject to debate about whether to continue, it loses value as a signal.

**Complexity is a recurring negative.** ParaSwap's social escrow was innovative but inscrutable. 1INCH's Unicorn Power delegation discouraged participation. PancakeSwap killed veCAKE because gauges directed 40% of emissions to pools generating <2% of burns. Synthetix needed 7 years to admit C-ratio management was a UX failure. Simple mechanisms get adopted. Complex ones get abandoned.

### What the data is ambiguous on

**Staking APR vs. stake rate.** Stake rates appear largely inelastic to yield within normal ranges. AAVE (stkAAVE ~20% staked, low nominal yield), AERO (~50%, high bribe yield), 1INCH (~8%, zero revenue), SKY (~60-67%, high revenue). When the token can 2-3x in 12 months, the difference between 10% and 15% APR may not drive behavior. The exception is ve, where bribe yields of 20-40% drive the high stake rates — but that's a different mechanism (options on emissions) not replicable for CoW.

**Buyback destination (burn vs. retain vs. distribute).** No clear winner. Burns are simple and narrative-friendly but CAKE burned 42M tokens over 29 months and is still down 94%. Treasury retention preserves optionality but risks being seen as "team hoarding." Distribution to stakers creates salience but adds complexity. LP provision is capital-efficient but operationally complex.

**Whether salience requires staking.** HYPE and JUP both achieved buyback salience without user-facing staking. HYPE through sheer volume and marketing. JUP through public controversy (CTO "waste of resources" quote). Staking is one way to make value accrual visible, but it's not the only way. Transparent, public dashboards and communication may achieve the same effect.

### What we believe (working hypotheses, subject to revision)

- ve is structurally inapplicable to CoW. No emissions to direct, no bribe market, no gauge system. The precondition for the ve flywheel doesn't exist.
- Low-commitment staking is a "good-time supply sink" — it captures upside by giving people a reason not to sell, but it doesn't protect downside (xSUSHI proved this).
- The highest-leverage change CoW can make may not be mechanism redesign but salience: making the existing buyback loud, transparent, non-discretionary, and visually trackable.
- If a new mechanism is warranted, it should be entrenched (not subject to governance on/off switching), simple (no gauge complexity), and funded from genuine surplus above operating costs.

---

## 3. For CoW specifically

### What we need from the CoW team

To model any mechanism accurately, we need a precise picture of COW token net flows:

**Inflows (sources of buy pressure / supply reduction)**
- Protocol revenue (Dune: dune.com/cowprotocol/cow-revenue)
- Current buyback volumes (Dune: dune.com/queries/5273980/8661207)
- MEV Blocker revenue

**Outflows (sources of sell pressure / supply increase)**
- Solver rewards: quote + competition (Dune: dune.com/cowprotocol/cow-solver-rewards)
- Operational expenditure ($12.6M USDC for 2026 via CIP-79)
- vCOW vesting schedule: ~155M vCOW outstanding, 4yr vest, conversion timeline
- Team/contributor vesting schedules
- 3% annual mint capacity (30M COW/yr, governance-controlled)

**Key question**: After solver compensation (~50% of revenue) and OpEx, what is the *surplus* available for value accrual? December 2024 showed this can compress to near-zero in high-volatility months.

### What we will not rule out

Keeping the existing mechanism — buyback as emissions offset — but improving:
- **Transparency**: real-time public dashboard showing buyback vs. solver emissions
- **Entrenchment**: removing discretionary pauses (the Dec 2024 / Q1 2025 pause)
- **Salience**: marketing the implied yield ($14-19M buyback / $135M mcap = 10-14%)
- **Destination**: evaluating burn vs. retain vs. a hybrid

### Weeks 3-5 plan

- Build net emissions model with accurate vesting/opex data from CoW team
- Shortlist 2-3 mechanism options for formal modeling:
  - Option A: Enhanced status quo (entrenched buyback, improved salience, destination decision)
  - Option B: Simple staking (sETHFI-style, revenue-funded, no lock)
  - Option C: [TBD based on CoW team priorities and data]
- Model each under bull/bear/base scenarios with empirical ranges from the comparative research
- Produce recommendation with supporting evidence

---

## Appendix: Research sources by protocol

All reports available as standalone documents with inline linked citations.

| Report | Location |
|--------|----------|
| MKR/SKY Timeline & Forum Summary | Delivered Week 1 |
| xSUSHI Research Report | xsushi_research_report.md |
| AAVE Value Accrual | Delivered Week 1 (extended search) |
| 1INCH Value Accrual | Delivered Week 1 (extended search) |
| Synthetix (SNX) | synthetix_snx_value_accrual_report.md |
| Hyperliquid (HYPE) Main Report | hyperliquid_hype_value_accrual_report.md |
| HYPE Buyback Critical Analysis | hype_buyback_critical_analysis.md |
| Jupiter (JUP) | jupiter_jup_value_accrual_report.md |
| ParaSwap (PSP/VLR) | paraswap_psp_value_accrual_report.md |
| PancakeSwap (CAKE) | pancakeswap_cake_value_accrual_report.md |
| QuickSwap (QUICK) | quickswap_quick_value_accrual_report.md |
| UNI/AERO/ETHFI/AAVE/MKR Analytics | Giorgi — Dune dashboards |
