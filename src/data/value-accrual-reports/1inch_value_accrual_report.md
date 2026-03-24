# 1INCH: a case study in aggregator value accrual failure

The 1INCH token represents DeFi's clearest example of product-market fit without token-market fit. Despite routing **$500B+ in cumulative trading volume** on Ethereum alone and commanding 25\u201332% of EVM aggregator market share, the 1inch DAO receives **zero operating revenue** — a situation unchanged since June 2023. The 1INCH token trades at **$0.10, down 98.8% from its $8.65 all-time high**, while CoW Protocol — with comparable market cap (~$135M) — generates **$14\u201319M in annualized protocol revenue** flowing directly to token buybacks. This divergence is not accidental. It reflects a fundamental architectural choice: 1inch optimized for volume by eliminating fees, while CoW optimized for value capture by embedding protocol-level fees that survive across all frontends. For CoW DAO, 1inch is both a structural peer and a cautionary tale about what happens when aggregator dominance cannot translate into token holder returns.

---

## The full timeline: from Christmas airdrop to governance crisis

The 1INCH token launched on **December 25, 2020**, with ~90 million tokens airdropped to approximately 55,200 wallets that had previously used the aggregator. Total supply was fixed at **1.5 billion tokens** — hard-capped with no minting mechanism. The allocation split heavily toward insiders: **33% to investors**, **22.5% to the core team** (both on 4-year vesting), 30% to community incentives, and 14.5% to a protocol growth fund. A second airdrop in February 2021 distributed 15 million additional tokens. Funding rounds included a $2.8M seed (Binance Labs, Galaxy Digital, Dragonfly Capital at $0.01/token), a $12M strategic round (Pantera Capital at $0.0656/token), and a $175M Series B in December 2021 at a $2.25B valuation, backed by Amber Group, Jane Street, and Alameda Research.

The original staking model (v1) offered governance-only utility — stakers could vote on protocol parameters like spread surplus allocation. This changed fundamentally in **December 2022** when 1inch launched **Fusion mode** alongside a complete staking overhaul. The new system introduced **st1INCH** (a receipt token) and **Unicorn Power (UP)** — a time-weighted governance metric that decays linearly over a user's chosen lock period (1 month to 2 years). Stakers delegate 100% of their UP to a single resolver, earning 1INCH farming rewards in return.

Fusion mode itself is an intent-based execution system where users sign swap orders that enter a **Dutch auction** — starting at a favorable rate and declining until a resolver accepts. Resolvers are professional market makers who pay gas, source optimal execution, and keep the spread surplus as profit. Initially only 1inch Labs' own resolver operated; governance expanded this to **5 resolvers (1IP-12)**, then **10 (1IP-19)**. Entry requires holding ≥5% of total Unicorn Power supply, passing KYC/KYB screening, and depositing 1INCH into a FeeBank contract.

Subsequent upgrades include **Fusion 2.0 (May 2024)** — which introduced partial fills, gas-adjusted price curves, and roughly 10\u201335% cheaper settlement — and **Fusion+ (November 2024)**, enabling cross-chain atomic swaps using hash time-locked contracts across **13+ networks including Solana**. The **Aqua protocol** (developer release November 2025) introduced a shared liquidity concept where wallets become self-custodial AMMs. Critically, Aqua's whitepaper contains **no explicit 1INCH value capture mechanism**.

As of March 2026, the most significant pending change is the **Staking v2 proposal** ("The Unified Power Model," October 2025), which would replace decaying UP with an exponential multiplier, enable simultaneous governance and resolver delegation from a single stake, and introduce a treasury-funded base APR. This proposal remains in Phase 1 discussion — **not yet voted on or implemented**.

---

## Where the money actually goes: revenue flows to Labs and resolvers, not to the DAO

Understanding 1inch's revenue model requires distinguishing between three separate entities: **1inch Labs** (the for-profit company), **1inch DAO** (the token-governed collective), and **resolvers** (professional market makers). The protocol generates meaningful economic value — but virtually none of it reaches token holders.

The DAO's only historical revenue source was **swap surplus (positive slippage)** — the difference between quoted and executed swap prices. Before June 2023, approximately 80.55% of this surplus flowed to the DAO treasury and 19.45% to referrers. This mechanism accumulated **~$22 million total** over the protocol's lifetime, peaking at $6.7M in Q2 2022 (42% generated during the Terra/UST collapse on May 11\u201312 alone). In June 2023, **1IP-28 passed with 96% support**, discontinuing swap surplus collection entirely. The rationale was that surplus capture added gas costs and inconsistently penalized a minority of users by up to 10%. Co-founder Sergej Kunz publicly welcomed the decision.

Since that vote, **the DAO has earned zero operating revenue**. The Staking v2 proposal explicitly acknowledges that "protocol revenue is currently at zero" and that the existing commitment to share "50% of DAO revenue" with stakers is meaningless when there is no revenue to share. The DAO treasury held approximately **$10.9M in mid-2025**, down from a peak of $18.2M in Q1 2023, with roughly 2 years of runway at current burn rates.

Meanwhile, **1inch Labs captures revenue through multiple channels** that bypass the DAO entirely. Per the May 2025 API Terms of Service, 1inch Labs retains all swap surplus generated through its Swap API, Fusion API, and Fusion+ API. The Limit Order Protocol's FeeTaker contract routes protocol fees to a **Labs-controlled address (0xb01F...)**, not the DAO treasury. Partners exceeding $10M in API volume are upgraded to enterprise plans with revenue-sharing agreements — again benefiting Labs, not the DAO. Separately, resolvers retain **100% of Fusion surplus** per 1IP-57. In a two-month sample from mid-2025, approximately **$893K in capturable fees** flowed to resolvers and Labs, annualizing to roughly **$5.3M/year** — with BNB Chain accounting for 82% of that figure.

The take rate is extraordinarily low. At peak collection (Q2 2022), the DAO captured approximately **1.5 basis points** on volume. The current identifiable protocol-wide take rate (including Labs and resolver captures) is roughly **0.4\u20130.5 basis points** — an order of magnitude below CoW Protocol's effective rate.

---

## The staking trap: 3\u20135% yield funded by token redistribution, not revenue

Approximately **$12M worth of 1INCH** is currently staked across roughly 13,000 stakers, representing an estimated **8% of circulating supply**. The Staking v2 proposal characterizes participation as "low" and notes that the majority of voting power remains held by the core team — making governance effectively centralized despite the DAO's nominal decentralization.

What yield do stakers actually earn? The commonly cited **3.75\u20134.8% APR** comes from delegating Unicorn Power to resolvers, who distribute rewards from their own 1INCH token pools. The 1inch Foundation seeded this with a **10M 1INCH delegation incentive program** (250K tokens/week). This is not "real yield" — it is **token redistribution** funded by resolver marketing budgets and Foundation grants, not protocol revenue. CoinGecko records **$0.00 in daily protocol fees and $0.00 in project revenue** for 1INCH. After incentive emission reductions in 2025, base APRs reportedly dropped by more than 50%.

The staking mechanism also imposes harsh penalties: early withdrawal can cost **up to 90%** of the staked amount if exited shortly after locking, with the penalty decreasing linearly toward zero as the lock period expires. Combined with Unicorn Power's linear decay, the system creates a complex, illiquid staking experience with minimal economic upside. Users must choose a single resolver for delegation — they cannot split across multiple resolvers — and rewards vary based on resolver generosity rather than any protocol-level guarantee.

This stands in sharp contrast to staking mechanisms in lending protocols. **Aave's Safety Module** pays stakers from protocol revenue and provides insurance backstop utility. **Maker's MKR burns** are funded directly by stability fees. In both cases, the connection between protocol usage and token holder returns is direct and verifiable. In 1inch's case, **the connection does not exist**.

---

## A DAO in revolt: the financial revitalization battle

The most consequential governance debate in 1inch's history erupted in **August 2025** when Arana Digital and StableLab proposed **"1IP-XX: 1inch DAO Financial Revitalization"** — demanding that 100% of Fusion surplus fees and Limit Order taker fees be redirected to the DAO treasury. The proposal documented specific on-chain addresses where Labs-controlled contracts captured fees and presented two months of data showing $893K in capturable revenue. Abdullah Umar, head of governance at Arana Ventures, stated publicly that **"the DAO has effectively become a front for portraying a sense of decentralisation."**

The 1inch Foundation's response, posted August 14, 2025, pushed back firmly. They argued that current revenue flows are "minimum operating cost offsets essential to keeping systems performant and secure," that the DAO "doesn't hold any operational responsibility for the underlying infrastructure," and therefore doesn't need additional revenue "beyond the small number of 1inch tokens it receives." The Foundation committed to returning with a "structured approach" but rejected the specific proposal to redirect revenue.

This debate exposed a deeper structural tension. **The DAO treasury had funded significant spending on Labs-associated projects**: $2M for hardware wallet development, $2.2M for event sponsorships, $2M for a Bruce Lee-themed marketing campaign, and $768K for hack victim reimbursements — totaling over **$7M in outflows** with zero incoming revenue. An anonymous governance participant refused to support a subsequent events grant, stating: "This is effectively raiding the DAO treasury. We would be in favour of this if the DAO had a sustainable revenue source." The proposal was withdrawn.

Earlier governance discussions reveal persistent community frustration. A 2024 forum thread titled "1inch Revenue Proposal" noted candidly that **"1inch operates in a commodity business where users seek the best swap rate; they don't care whether it's 1inch, 0x, or CowSwap."** The post identified that the top 1% of users drive 55% of swaps and 85% of volume. A co-founder's 2021 discussion of tokenomics floated three options — direct staker rewards, buy-and-burn, or treasury accumulation — but none were meaningfully implemented. The spread surplus governance parameter has remained at **0% since launch**.

---

## Price performance reveals the value accrual vacuum

1INCH launched at approximately $1.10\u2013$1.50 in December 2020, peaked at **$8.65 in May 2021**, and has since declined roughly **98.8%** to its all-time low of **$0.083 on February 6, 2026**. As of mid-March 2026, the token trades around **$0.10** with a market cap of approximately **$135\u2013145M** and a fully diluted valuation of ~$155M. Vesting completed in 2025, so FDV and market cap have nearly converged — eliminating any "unlock premium" but also removing the overhang of future supply dilution.

The performance is catastrophic relative to all relevant benchmarks. BTC gained approximately 175% from 1INCH's launch price; ETH gained approximately 230%. Among aggregator tokens, **Jupiter (JUP)** commands roughly 4x the market cap ($595M) despite launching years later, and **CoW (COW)** has nearly identical market cap despite processing far less cumulative volume. ParaSwap's PSP token — the closest failure case — collapsed to a ~$1.6M market cap, effectively a dead project.

The disconnect between volume and value is the defining metric. 1inch processed **$214B in swap volume during 2025** — a 39% year-over-year increase — across 114 million swaps. Yet its market cap represents just **0.07% of annual volume**. For comparison, Uniswap's market cap (~$4B) represents roughly 0.5% of its annual volume — still low by traditional finance standards, but 7x higher than 1inch's ratio.

The January 2026 crash was triggered by **early investor wallets selling millions of dollars in 1INCH via CoW Swap**, with over $6.5M in realized losses. A single sub-$2M sell order caused a **7% price plunge on Binance**, revealing severe liquidity fragility. Arbitrage bots accounted for 77% of trading volume during the crash. The team denied involvement but acknowledged the need for a "tokenomics review" — a promise that remains undelivered as of March 2026.

---

## CoW Protocol's structural advantages in fee capture

CoW Protocol and 1inch Fusion are both intent-based solver/resolver systems, but their fee capture architectures diverge in ways that explain their vastly different revenue outcomes. Three architectural differences matter most.

**First, batch auctions versus individual Dutch auctions.** CoW batches multiple orders in ~30-second intervals, enabling Coincidence of Wants matching (direct peer-to-peer execution that eliminates AMM fees entirely for matched portions) and uniform clearing prices that structurally prevent MEV extraction. 1inch Fusion processes each order individually via Dutch auction — simpler but unable to capture cross-order optimization opportunities.

**Second, protocol-level versus frontend-level fees.** CoW's fees are embedded at the **settlement contract level** — the protocol captures a 50% price-improvement share plus an unconditional 2 basis point volume fee (per CIP-74, November 2025). These fees cannot be bypassed by routing through alternative frontends or API integrations. 1inch's fee capture, by contrast, exists only at the **API terms-of-service level** — 1inch Labs retains surplus from API calls, but this is a corporate revenue stream, not a protocol-level mechanism that benefits token holders.

**Third, direct buyback versus indirect delegation.** CoW DAO uses protocol revenue to purchase COW tokens from the open market, targeting **1.2x weekly COW emissions** — designed to be net deflationary since November 2025. 1INCH stakers receive farming rewards from resolvers funded by token redistribution. The first creates direct, verifiable buy pressure tied to protocol usage. The second creates circular token flows with no external value entering the system.

CoW's revenue trajectory reflects these advantages. Annual protocol revenue runs at approximately **$14\u201319M** (varying with volume), CoW DAO holds a **$112.7M treasury** (roughly 10x the 1inch DAO's), and the protocol has captured **34% of Ethereum aggregator market share** as of Q4 2025 — effectively tying with 1inch's organic share of approximately 25%. The solver network includes **19+ active solvers** with meaningful competition, compared to 1inch Fusion's 7\u201312 resolvers that are heavily concentrated (top 4 handle ~90% of volume). CoW AMM further diversifies revenue by capturing LP-related surplus through a Function-Maximizing AMM design — extending CoW's value proposition from traders to liquidity providers and adding TVL-like economics to what would otherwise be pure pass-through infrastructure.

---

## The aggregator premium problem: structural disadvantage or solvable challenge?

1inch's experience provides the strongest evidence yet for what analysts call the **"aggregator premium" problem** — the thesis that aggregator tokens are structurally disadvantaged relative to lending or stablecoin protocol tokens. The logic is straightforward: aggregators route volume through other protocols' liquidity but don't own that liquidity. Underlying DEXes capture LP trading fees; aggregators sit on top as an optimization layer that is extremely useful but inherently difficult to monetize.

The comparison with lending protocols is stark. **Aave** captures interest rate spreads continuously on $15B+ in TVL — a balance-sheet business with recurring revenue proportional to deposits. Its token recently gained a **$50M annual buyback program** and the "Aave Will Win" framework directing 100% of product revenue to the DAO. **MakerDAO/Sky** generates stability fees on DAI/USDS minting — structural revenue that grows with stablecoin adoption, historically used for MKR buybacks. Both protocols own their capital stack and charge fees on it. Aggregators are **pass-through infrastructure** — they improve prices but don't inherently capture the spread.

Yet the problem is not entirely insoluble. Three approaches show varying degrees of promise:

- **CoW Protocol's solution** — protocol-level fees that can't be bypassed, batch auctions that create unique execution quality worth paying for (MEV protection, CoW matching), and CoW AMM diversifying into LP economics — represents the most sophisticated attempt to overcome the structural disadvantage.
- **Jupiter's solution** — expanding beyond aggregation into perpetuals (JLP generates real trading fees), launchpad products, and ecosystem infrastructure on Solana — diversifies revenue away from pure aggregation. JUP commands $595M market cap with 44% staking rate.
- **1inch's non-solution** — optimizing for volume by eliminating fees, with token utility limited to indirect resolver delegation — demonstrates what happens when the structural disadvantage is accepted rather than addressed.

The race-to-zero-fees dynamic is real. Meta-aggregators like LlamaSwap compare across aggregators, pushing the entire category toward zero explicit fees. 1inch's governance explicitly chose this path in 1IP-28. But CoW's architecture partially escapes this trap because its batch auction provides **unique execution quality** (MEV protection, CoW matching, uniform clearing prices) that individual order-by-order systems cannot replicate — creating a defensible reason for users to accept modest fees.

---

## Data sources, dashboards, and verification notes

**Dune Analytics dashboards**: 1inch Aggregation Router (dune.com/1inch/aggregator), Fusion (dune.com/1inch/fusion), DAO Treasury (dune.com/1inch/shippooor-dao-treasury), Positive Slippage (dune.com/lsquared/1inch-positive-slippage). **Token Terminal**: tokenterminal.com/explorer/projects/1inch (revenue, fees, trading volume, financial statements). **DefiLlama**: defillama.com/protocol/1inch (TVL, volume), defillama.com/dex-aggregators (market share rankings), defillama.com/fees (fee comparisons). **Governance**: gov.1inch.network (Discourse forum), snapshot.org/#/1inch.eth (votes). **Key on-chain addresses**: DAO Treasury (0x7951c7ef...), Fee Collector/Labs (0xb01F8f52...), LOP FeeTaker (0xc0dfdb9e...).

**Volume data conflicts**: 1inch self-reports $700B+ total; Dune shows $716B; DefiLlama shows ~$235B. Different aggregation start dates and methodology account for the discrepancy. The DefiLlama figure is most conservative and independently verifiable. **Market share narrative**: The widely cited "59.1% → 28.3% decline" is misleading — the 59.1% was an anomalous spike driven by Binance Alpha airdrop campaigns on BNB Chain (volume surged 2,796% QoQ). Organic share has been relatively stable at 25\u201332%, with CoW steadily gaining from ~14% to ~24%, effectively tying 1inch by Q4 2025. **Revenue figures**: CoW's $18.9M annualized revenue (DefiLlama) may reflect a higher-activity trailing period; CoinGecko's daily rate suggests a current run-rate of ~$14M. All aggregator revenue figures should be treated with caution due to varying definitions.

---

## Conclusion: what 1inch tells CoW about the value accrual imperative

The 1inch case demonstrates three lessons for CoW DAO's value accrual strategy with high confidence.

**First, volume without fee capture is worthless for token holders.** 1inch processed more cumulative volume than virtually any DeFi protocol, yet its token trades at $0.10 — a 98.8% decline from peak — because none of that volume generates returns for the DAO or stakers. The decisive moment was 1IP-28 in June 2023, when the DAO voluntarily eliminated its only revenue source to compete on price. CoW's decision to embed fees at the protocol level (not the frontend level) is the single most important architectural difference between the two systems.

**Second, the Labs/DAO separation is toxic to token value when revenue flows exclusively to Labs.** 1inch's delegates describe the DAO as a "front for decentralisation" — a governance theater where token holders vote on parameters that don't matter while the profitable entity (1inch Labs) captures all economic value through API terms of service. CoW DAO's unified model, where protocol revenue flows directly to DAO-controlled buybacks, avoids this misalignment by design.

**Third, the aggregator structural disadvantage is real but not fatal.** Aggregators lack the recurring, TVL-proportional revenue of lending protocols and the stability-fee revenue of stablecoin issuers. But CoW's batch auction creates unique execution quality (MEV protection, CoW matching) that justifies fees, and CoW AMM extends value capture into LP economics — partially converting CoW from pure pass-through infrastructure into a protocol with balance-sheet-like characteristics. 1inch never attempted this diversification; its Aqua protocol contains no token value capture mechanism. The 1inch experience is evidence not that aggregator tokens are inherently doomed, but that they require deliberate, protocol-level fee architecture and product diversification to overcome the structural headwinds that 1inch chose to ignore.