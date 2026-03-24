import { createServerFn } from "@tanstack/react-start";
import type { ValueAccrualReportId } from "@/lib/value-accrual-reports";

export type ValueAccrualMetricId =
  | "performance"
  | "accrualRate"
  | "circulatingSupply"
  | "priceUsd"
  | "stakeRate";

export type AccrualMetricKind =
  | "stakingApr"
  | "burnRate"
  | "buybackYield"
  | "rewardRate";

export interface ValueAccrualMilestone {
  date: string;
  value: number;
}

export interface ValueAccrualStoryPoint {
  date: string;
  title: string;
  description: string;
}

export interface ValueAccrualResearchBrief {
  title: string;
  source: string;
  sourceFile: string;
  summary: string;
  takeaways: string[];
}

export interface ValueAccrualProtocolDefinition {
  slug: string;
  name: string;
  symbol: string;
  coingeckoIds: string[];
  betaAssetIds: string[];
  betaSymbol: string;
  secondaryBetaSymbol?: string;
  accentColor: string;
  chartStartDate: string;
  mechanism: string;
  description: string;
  accrualMetricLabel: string;
  accrualMetricKind: AccrualMetricKind;
  accrualRateMilestones: ValueAccrualMilestone[];
  stakeRateMilestones?: ValueAccrualMilestone[];
  storyPoints: ValueAccrualStoryPoint[];
  reportIds?: ValueAccrualReportId[];
  researchBriefs?: ValueAccrualResearchBrief[];
  isVisible?: boolean;
  summary: {
    athDrawdown: string;
    stakeRate: string;
    buybackYield: string;
    outcome: string;
  };
}

export interface ValueAccrualPoint {
  bucket: string;
  label: string;
  isoDate: string;
  timestamp: number;
  priceUsd: number;
  circulatingSupply: number | null;
  performanceRatio: number;
  accrualRate: number | null;
  stakeRate: number | null;
  annotations: ValueAccrualStoryPoint[];
}

export interface LoadedValueAccrualProtocolData {
  protocol: ValueAccrualProtocolDefinition;
  points: ValueAccrualPoint[];
  latestPoint: ValueAccrualPoint | null;
  windowStartDate: string | null;
  windowEndDate: string | null;
  isWindowLimited: boolean;
}

export type ValueAccrualComparisonRow = Record<
  string,
  number | string | null
> & {
  bucket: string;
  label: string;
};

export interface ValueAccrualStaticMarketChartRecord {
  coinId: string;
  startDate: string;
  endDate: string;
  fetchedAt: string;
  prices: [number, number][];
  market_caps: [number, number][];
}

export const VALUE_ACCRUAL_COMPARE_METRICS: Array<{
  id: ValueAccrualMetricId;
  label: string;
  description: string;
}> = [
  {
    id: "performance",
    label: "Asset / beta",
    description:
      "Raw asset-versus-beta ratio: token price divided by ETH, or SOL for Jupiter. Higher means outperformance.",
  },
  {
    id: "accrualRate",
    label: "APR / burn rate",
    description:
      "Protocol-specific accrual rate reconstructed from research milestones.",
  },
  {
    id: "circulatingSupply",
    label: "Circulating supply",
    description:
      "Estimated from CoinGecko market cap divided by token price, net of buybacks where reflected by market data.",
  },
  {
    id: "priceUsd",
    label: "USD price",
    description: "Raw token price in USD from CoinGecko market data.",
  },
  {
    id: "stakeRate",
    label: "Stake rate",
    description:
      "Percent of circulating supply staked or locked when the mechanism exists.",
  },
];

const PROTOCOLS: ValueAccrualProtocolDefinition[] = [
  {
    slug: "aave",
    name: "Aave",
    symbol: "AAVE",
    coingeckoIds: ["aave"],
    betaAssetIds: ["ethereum"],
    betaSymbol: "ETH",
    accentColor: "#B6509E",
    chartStartDate: "2020-10-07",
    mechanism: "Safety Module -> Umbrella -> Buy and Distribute",
    description:
      "Aave shifted from emissions-backed safety staking to asset-specific staking under Umbrella, then layered in treasury-funded buybacks. This page tracks whether that structure actually changed token outcomes versus ETH.",
    accrualMetricLabel: "Staking APR",
    accrualMetricKind: "stakingApr",
    accrualRateMilestones: [
      { date: "2020-10-07", value: 7.5 },
      { date: "2021-05-01", value: 8.6 },
      { date: "2024-07-25", value: 5.2 },
      { date: "2024-11-04", value: 4.8 },
      { date: "2025-04-01", value: 4.3 },
      { date: "2026-03-01", value: 3.8 },
    ],
    stakeRateMilestones: [
      { date: "2020-10-07", value: 19 },
      { date: "2021-05-01", value: 22 },
      { date: "2024-07-25", value: 20 },
      { date: "2025-04-01", value: 21 },
      { date: "2026-03-01", value: 19.5 },
    ],
    storyPoints: [
      {
        date: "2020-10-07",
        title: "Safety Module becomes the core staking design",
        description:
          "stkAAVE launches with a cooldown and slashing promise, but the report treats it as emissions-funded insurance rather than true value accrual.",
      },
      {
        date: "2023-01-01",
        title: "CRV bad debt proves slashing is political",
        description:
          "After the November 2022 CRV incident, governance uses treasury funds instead of slashing stakers, exposing the Safety Module's core weakness.",
      },
      {
        date: "2025-03-04",
        title: "Aavenomics flips on the fee switch",
        description:
          "The Buy and Distribute proposal reframes AAVE from a governance receipt into a token with an explicit buyback claim on protocol surplus.",
      },
      {
        date: "2025-06-05",
        title: "Umbrella automates what stkAAVE never did",
        description:
          "Umbrella replaces monolithic AAVE slashing with asset-specific automated coverage, fixing the manual-governance problem highlighted in the report.",
      },
      {
        date: "2026-03-04",
        title: "Buyback discretion becomes the new fault line",
        description:
          "TokenLogic's proposed cut from $50M to $30M and ACI's departure show that even improved tokenomics remain governance-contingent.",
      },
    ],
    reportIds: ["aave"],
    researchBriefs: [
      {
        title:
          "AAVE value accrual: five years from governance receipt to buyback machine",
        source: "files.zip research report",
        sourceFile: "aave_value_accrual_report.md",
        summary:
          "The report's conclusion is that Aave only became a real value-accrual case once buybacks were funded from protocol surplus; the prior staking era was mostly inflation paying for unused insurance.",
        takeaways: [
          "The Safety Module was never actually slashed, so its yield functioned more like emissions-backed theater than a reliable loss-absorption mechanism.",
          "Umbrella matters because it automates asset-specific coverage instead of relying on tokenholder votes to hurt themselves in a crisis.",
          "Buy and Distribute improved the economic claim for holders, but the March 2026 budget fight shows that discretionary buybacks still carry governance risk.",
        ],
      },
    ],
    summary: {
      athDrawdown: "-72%",
      stakeRate: "~20%",
      buybackYield: "~1.5%",
      outcome: "Active, governance friction",
    },
  },
  {
    slug: "sky",
    name: "Sky",
    symbol: "SKY",
    coingeckoIds: ["sky", "maker"],
    betaAssetIds: ["ethereum"],
    betaSymbol: "ETH",
    accentColor: "#6D41D4",
    chartStartDate: "2022-01-26",
    mechanism: "Smart Burn Engine + MKR to SKY migration",
    description:
      "MakerDAO turned surplus burn into a programmatic Smart Burn Engine, then rebranded MKR into SKY. The key question is whether automation and later staking actually translated into better tokenholder outcomes than a passive ETH benchmark.",
    accrualMetricLabel: "Staking APR",
    accrualMetricKind: "stakingApr",
    accrualRateMilestones: [
      { date: "2022-01-26", value: 0 },
      { date: "2023-09-01", value: 0 },
      { date: "2024-09-18", value: 0 },
      { date: "2025-02-01", value: 11 },
      { date: "2025-03-01", value: 9 },
      { date: "2026-03-01", value: 15 },
    ],
    stakeRateMilestones: [
      { date: "2024-09-18", value: 0 },
      { date: "2025-02-01", value: 42 },
      { date: "2025-08-01", value: 60 },
      { date: "2026-03-01", value: 67 },
    ],
    storyPoints: [
      {
        date: "2022-01-26",
        title: "Endgame frames automated buybacks as the destination",
        description:
          "The initial MKR research arc starts with Endgame: surplus should compound back into the token rather than sit as idle treasury value.",
      },
      {
        date: "2023-09-01",
        title: "Smart Burn Engine makes buybacks continuous",
        description:
          "Sky becomes the clean automation benchmark in the research set once surplus starts buying MKR without recurring governance discretion.",
      },
      {
        date: "2024-09-18",
        title: "MKR migrates into SKY",
        description:
          "The 1:24,000 migration and rebrand create a broken chart unless MKR history is normalized into SKY-equivalent units.",
      },
      {
        date: "2025-02-01",
        title: "Buyback scale becomes visible",
        description:
          "By early 2025 the program is spending about $1M per day, turning automation into a visible tokenholder narrative rather than a background treasury process.",
      },
      {
        date: "2025-03-01",
        title: "Direct buybacks replace the LP-heavy design",
        description:
          "The mechanism simplifies again, reinforcing one of the recurring research themes: direct surplus recycling is easier to defend than complex token plumbing.",
      },
    ],
    reportIds: ["sky"],
    researchBriefs: [
      {
        title: "MKR/SKY timeline synthesis",
        source: "Week 2 brief + chart prompt",
        sourceFile: "cow_week2_meeting_brief.md + codex_chart_prompt.md",
        summary:
          "SKY is treated in the research as the gold-standard automation case: a non-discretionary buyback program that stayed legible through a difficult token migration.",
        takeaways: [
          "The decisive difference versus AAVE and JUP is credibility: the burn engine runs automatically instead of reopening the value-accrual debate every quarter.",
          "The MKR to SKY migration needs explicit normalization, because price and supply history cross a 1:24,000 unit change in September 2024.",
          "The research frame is not that SKY solved every problem, but that automation and continuity made its buyback signal far more durable than discretionary peers.",
        ],
      },
    ],
    summary: {
      athDrawdown: "-90%",
      stakeRate: "~65%",
      buybackYield: "~3%",
      outcome: "Automated, working",
    },
  },
  {
    slug: "snx",
    name: "Synthetix",
    symbol: "SNX",
    coingeckoIds: ["havven", "synthetix-network-token"],
    betaAssetIds: ["ethereum"],
    betaSymbol: "ETH",
    accentColor: "#39D3C6",
    chartStartDate: "2019-03-01",
    mechanism: "Inflation -> fee sharing -> SIP-420 protocol-owned debt",
    description:
      "Synthetix changed its value accrual mechanism repeatedly. This page focuses on whether the token ever escaped the dilution trap, from inflationary staking through perps fee sharing and the SIP-420 reset.",
    accrualMetricLabel: "Staking APR",
    accrualMetricKind: "stakingApr",
    accrualRateMilestones: [
      { date: "2019-03-01", value: 75 },
      { date: "2021-05-01", value: 22 },
      { date: "2023-11-01", value: 8 },
      { date: "2024-06-01", value: 6 },
      { date: "2025-03-05", value: 12 },
      { date: "2026-03-01", value: 5 },
    ],
    stakeRateMilestones: [
      { date: "2019-03-01", value: 55 },
      { date: "2021-05-01", value: 80 },
      { date: "2023-11-01", value: 62 },
      { date: "2025-03-05", value: 50 },
      { date: "2026-03-01", value: 48 },
    ],
    storyPoints: [
      {
        date: "2019-03-01",
        title: "Inflation bootstraps staking at extreme scale",
        description:
          "The report treats early SNX as proof that emissions can drive 80% staking participation, but only by front-loading dilution.",
      },
      {
        date: "2023-11-01",
        title: "Andromeda adds buyback-and-burn to a fading fee-share model",
        description:
          "Late-2023 Synthetix pivots from pure inflation to perps fees and small burns, but the report argues the scale never matched the collateral base.",
      },
      {
        date: "2024-06-01",
        title: "Kain names the core scaling trap",
        description:
          "Fee yield was being spread across too much staked collateral, which is the central failure mode the SNX report wants CoW to internalize.",
      },
      {
        date: "2025-03-05",
        title: "SIP-420 abandons individual debt management",
        description:
          "The 420 Pool centralizes debt and forces migration because the old C-ratio-and-hedging experience had become untenable for users.",
      },
      {
        date: "2025-03-15",
        title: "The redesign immediately breaks the peg",
        description:
          "The debt jubilee pushes sUSD toward $0.70, underscoring the report's warning that tokenomic resets can destabilize adjacent systems.",
      },
    ],
    reportIds: ["snx"],
    researchBriefs: [
      {
        title: "Synthetix (SNX): Seven years of staking mechanism evolution",
        source: "files.zip research report",
        sourceFile: "synthetix_snx_value_accrual_report.md",
        summary:
          "The SNX report reads like a sequence of mechanism postmortems: inflation worked for bootstrapping, fee sharing never scaled, and SIP-420 is a drastic simplification after years of debt-management complexity.",
        takeaways: [
          "SNX is the clearest evidence that fee-sharing yield gets diluted as collateral grows unless the revenue engine scales at the same rate.",
          "The original debt-pool design demanded too much active management from stakers, which is why SIP-420 moved risk management to the protocol itself.",
          "The sUSD depeg after SIP-420 is the key warning sign: changing the accrual mechanism can damage the rest of the stack even when the logic looks cleaner on paper.",
        ],
      },
    ],
    summary: {
      athDrawdown: "-97%",
      stakeRate: "~50%",
      buybackYield: "N/A",
      outcome: "sUSD depeg, restructuring",
    },
  },
  {
    slug: "hype",
    name: "Hyperliquid",
    symbol: "HYPE",
    coingeckoIds: ["hyperliquid", "hyperliquid-hype"],
    betaAssetIds: ["ethereum"],
    betaSymbol: "ETH",
    accentColor: "#40E8A3",
    chartStartDate: "2024-11-29",
    mechanism: "Assistance Fund buyback machine",
    description:
      "Hyperliquid routes almost all trading fees to a non-discretionary buyback engine. There is no staking layer to hide behind, so the chart isolates whether relentless fee-funded repurchases were enough on their own.",
    accrualMetricLabel: "Buyback yield",
    accrualMetricKind: "buybackYield",
    accrualRateMilestones: [
      { date: "2024-11-29", value: 0 },
      { date: "2025-01-01", value: 4 },
      { date: "2025-06-01", value: 4.5 },
      { date: "2025-11-01", value: 2.5 },
      { date: "2026-03-01", value: 2 },
    ],
    storyPoints: [
      {
        date: "2024-11-29",
        title: "No-VC launch gives buybacks clean terrain",
        description:
          "The report treats the no-VC, 31% community airdrop launch as a major reason the Assistance Fund had less structural sell pressure to fight.",
      },
      {
        date: "2025-01-01",
        title: "The Assistance Fund turns revenue into a permanent bid",
        description:
          "Around 97% of fees begin routing into automated market repurchases, making HYPE the cleanest pure-buyback case in the dataset.",
      },
      {
        date: "2025-06-01",
        title: "Buybacks become the market narrative",
        description:
          "By mid-2025 HYPE buybacks dominate crypto headlines, but the adversarial report argues the bigger effect is narrative reinforcement rather than direct mechanical price support.",
      },
      {
        date: "2025-12-16",
        title: "Hold-to-burn sharpens the deflation meme",
        description:
          "The proposal to burn Assistance Fund holdings makes the program even more legible, while raising questions about sacrificing any residual emergency-fund role.",
      },
      {
        date: "2026-03-06",
        title: "The first big unlock is absorbed",
        description:
          "The March 2026 team unlock becomes the stress test for whether buybacks are a true floor or just a strong background bid supported by bullish sentiment.",
      },
    ],
    reportIds: ["hype", "hypeCritical"],
    researchBriefs: [
      {
        title: "Hyperliquid (HYPE): The purest buyback machine in DeFi",
        source: "files.zip research report",
        sourceFile: "hyperliquid_hype_value_accrual_report.md",
        summary:
          "The main HYPE report argues that Hyperliquid proves pure revenue-funded buybacks can work at scale when the protocol dominates its category and avoids VC overhang.",
        takeaways: [
          "Value accrual is intentionally decoupled from staking here; holders benefit without opting into a separate staking wrapper.",
          "The mechanism is strongest because buybacks are automatic, highly visible, and funded by unusually large protocol revenue relative to supply.",
          "The biggest open risk in the report is not design complexity but dependency on derivatives volume remaining elevated.",
        ],
      },
      {
        title:
          "Do HYPE buybacks actually drive price? A critical interrogation",
        source: "files.zip adversarial analysis",
        sourceFile: "hype_buyback_critical_analysis.md",
        summary:
          "The adversarial companion report rejects the simplistic 'buybacks made the chart go up' story and reframes them as a persistent narrative bid rather than the sole mechanical driver of price.",
        takeaways: [
          "Buybacks were small relative to total market-cap expansion and secondary trading volume, so they cannot explain HYPE's full rerating on their own.",
          "The Assistance Fund matters because it is legible and continuous, not because each day's purchases are large enough to bully the market higher.",
          "Team unlocks remain the live test: if sustained sell pressure outruns the buyback stream, the narrative can break even with a strong mechanism.",
        ],
      },
    ],
    summary: {
      athDrawdown: "+950% from TGE",
      stakeRate: "N/A",
      buybackYield: "~4%",
      outcome: "Success, narrative-driven",
    },
  },
  {
    slug: "jup",
    name: "Jupiter",
    symbol: "JUP",
    coingeckoIds: ["jupiter-exchange-solana", "jupiter"],
    betaAssetIds: ["solana"],
    betaSymbol: "SOL",
    accentColor: "#8BFFB4",
    chartStartDate: "2024-01-31",
    mechanism: "50% of fees -> buyback plus ASR staking",
    description:
      "Jupiter combined a fee-funded buyback policy with governance-gated ASR staking on Solana. The chart shows whether that mix kept up with token unlocks or simply masked them for a quarter.",
    accrualMetricLabel: "ASR / buyback rate",
    accrualMetricKind: "rewardRate",
    accrualRateMilestones: [
      { date: "2024-01-31", value: 0 },
      { date: "2025-01-17", value: 7 },
      { date: "2025-02-15", value: 8.5 },
      { date: "2025-06-01", value: 3.5 },
      { date: "2026-01-03", value: 1.5 },
      { date: "2026-03-01", value: 1 },
    ],
    stakeRateMilestones: [
      { date: "2024-01-31", value: 0 },
      { date: "2025-01-17", value: 11 },
      { date: "2025-06-01", value: 10.8 },
      { date: "2026-03-01", value: 10.5 },
    ],
    storyPoints: [
      {
        date: "2024-01-31",
        title: "JUP launches with a giant future supply overhang",
        description:
          "The report starts from launch because the 10B-token distribution and future Jupuary cadence are the backdrop for every later value-accrual decision.",
      },
      {
        date: "2025-01-17",
        title: "Buybacks arrive with a supply cut",
        description:
          "Governance cuts total supply to 7B and allocates 50% of fees to buybacks, creating the cleanest possible test of whether buybacks can outrun emissions.",
      },
      {
        date: "2025-02-15",
        title: "The first-month pump proves announcement salience",
        description:
          "JUP's early rally shows that the market reacts to buyback news, but the report treats this as temporary announcement alpha rather than lasting support.",
      },
      {
        date: "2025-06-01",
        title: "The unlock math breaks the thesis",
        description:
          "By mid-2025 the report's key number is unavoidable: roughly $70M of buybacks covered only about 6% of unlocked supply.",
      },
      {
        date: "2026-01-03",
        title: "The CTO calls buybacks a waste of resources",
        description:
          "The most important late-stage signal is internal: Jupiter leadership publicly questions whether growth incentives would be a better use of capital than continuing the program.",
      },
    ],
    reportIds: ["jup"],
    researchBriefs: [
      {
        title: "Jupiter (JUP): When $70M in buybacks doesn't move the price",
        source: "files.zip research report",
        sourceFile: "jupiter_jup_value_accrual_report.md",
        summary:
          "The Jupiter report is the direct counterexample to simplistic buyback optimism: real revenue funded large repurchases, and the token still collapsed because emissions were much larger.",
        takeaways: [
          "JUP shows that buybacks cannot repair token economics when unlocks and incentive emissions keep expanding the tradable float.",
          "The short-term rally after the buyback launch was real, but it faded once the market re-focused on monthly unlock pressure.",
          "The report's bottom line is that a governance token needs a durable economic claim, not just occasional repurchase headlines.",
        ],
      },
    ],
    summary: {
      athDrawdown: "-88%",
      stakeRate: "ASR gated",
      buybackYield: "~7% (but < unlocks)",
      outcome: "Failure, emissions > buybacks",
    },
  },
  {
    slug: "cake",
    name: "PancakeSwap",
    symbol: "CAKE",
    coingeckoIds: ["pancakeswap-token"],
    betaAssetIds: ["ethereum"],
    betaSymbol: "ETH",
    secondaryBetaSymbol: "BNB",
    accentColor: "#43D7D6",
    isVisible: false,
    chartStartDate: "2023-09-01",
    mechanism: "veCAKE sunset -> pure buyback and burn",
    description:
      "PancakeSwap moved from lock-based value sharing to a much simpler burn model under Tokenomics 3.0. The comparison matters because the protocol became structurally deflationary while price still struggled to recover.",
    accrualMetricLabel: "Burn rate",
    accrualMetricKind: "burnRate",
    accrualRateMilestones: [
      { date: "2023-09-01", value: 2 },
      { date: "2023-12-01", value: 3.5 },
      { date: "2025-04-23", value: 6 },
      { date: "2026-01-16", value: 6.5 },
      { date: "2026-03-01", value: 6.2 },
    ],
    stakeRateMilestones: [
      { date: "2023-12-01", value: 24 },
      { date: "2025-04-08", value: 0 },
      { date: "2026-03-01", value: 0 },
    ],
    storyPoints: [
      {
        date: "2023-09-01",
        title: "Deflation era begins",
        description:
          "Token burns exceed emissions for the first time and CAKE turns structurally deflationary.",
      },
      {
        date: "2023-12-01",
        title: "veCAKE launches",
        description:
          "Users can lock CAKE for up to four years for gauge voting, revenue sharing, and farm boosts.",
      },
      {
        date: "2025-04-08",
        title: "Tokenomics 3.0 passes",
        description:
          "PancakeSwap retires veCAKE, staking, and revenue sharing with a 98.89% governance vote.",
      },
      {
        date: "2025-04-23",
        title: "Pure burn model goes live",
        description:
          "Daily emissions are cut in stages from 29K toward 14.5K CAKE and the mechanism becomes pure buyback and burn.",
      },
      {
        date: "2026-01-16",
        title: "Max supply reduced",
        description:
          "Maximum CAKE supply falls from 450M to 400M after 29 straight months of net deflation.",
      },
    ],
    reportIds: ["cake"],
    summary: {
      athDrawdown: "-94%",
      stakeRate: "Killed",
      buybackYield: "~6% burn/yr",
      outcome: "Deflation working, price not",
    },
  },
  {
    slug: "xsushi",
    name: "xSUSHI",
    symbol: "SUSHI",
    coingeckoIds: ["sushi"],
    betaAssetIds: ["ethereum"],
    betaSymbol: "ETH",
    accentColor: "#FB7185",
    chartStartDate: "2020-09-01",
    mechanism: "Fee-sharing staking hollowed out by Kanpai",
    description:
      "xSUSHI started as the cleanest fee-sharing design in DeFi. The chart shows how quickly that model unwound once governance redirected fees away from stakers and the exchange lost relevance.",
    accrualMetricLabel: "Staking APR",
    accrualMetricKind: "stakingApr",
    accrualRateMilestones: [
      { date: "2020-09-01", value: 20 },
      { date: "2021-05-01", value: 14 },
      { date: "2022-12-06", value: 0 },
      { date: "2025-01-01", value: 0 },
      { date: "2026-03-01", value: 0 },
    ],
    stakeRateMilestones: [
      { date: "2020-09-01", value: 20 },
      { date: "2021-05-01", value: 67 },
      { date: "2022-12-06", value: 25 },
      { date: "2023-06-01", value: 10 },
      { date: "2025-01-01", value: 3.3 },
      { date: "2026-03-01", value: 2.5 },
    ],
    storyPoints: [
      {
        date: "2020-09-01",
        title: "xSUSHI launches as visible fee-sharing",
        description:
          "The report treats SushiBar as a mechanically elegant wrapper: simple staking, auto-compounding fees, and immediate user-visible yield.",
      },
      {
        date: "2021-05-01",
        title: "The reflexive upside phase peaks",
        description:
          "At peak adoption, roughly two-thirds of SUSHI is staked and xSUSHI looks like the benchmark for fee-sharing token design.",
      },
      {
        date: "2022-12-06",
        title: "Kanpai confiscates the yield",
        description:
          "Redirecting 100% of fee flow to the treasury is the report's decisive break in trust: once the yield can be revoked, the staking narrative is permanently damaged.",
      },
      {
        date: "2023-03-01",
        title: "The SEC subpoena compounds the governance spiral",
        description:
          "Legal pressure lands on top of the treasury crisis and reinforces the report's claim that governance instability, not contract design, killed the model.",
      },
      {
        date: "2025-01-01",
        title: "The mechanism ends as a historical artifact",
        description:
          "By the terminal phase, TVL is down roughly 98.7% and xSUSHI survives mostly as a record of how much trust the protocol destroyed.",
      },
    ],
    reportIds: ["xsushi"],
    researchBriefs: [
      {
        title: "xSUSHI: The DeFi staking mechanism that should have worked",
        source: "files.zip research report",
        sourceFile: "xsushi_research_report.md",
        summary:
          "The xSUSHI report is explicit that the mechanism was not the failure; Sushi's governance instability, collapsing business, and yield confiscation were.",
        takeaways: [
          "xSUSHI is the cleanest example of a well-designed fee-sharing wrapper failing because the underlying protocol lost relevance and trust.",
          "Kanpai 2.0 matters more than any APR figure, because it taught the market that staker economics could be revoked when the treasury got stressed.",
          "The report's core lesson for CoW is that low-commitment staking can amplify upside, but it does not protect downside when protocol fundamentals deteriorate.",
        ],
      },
    ],
    summary: {
      athDrawdown: "-97%",
      stakeRate: "3.3%",
      buybackYield: "N/A",
      outcome: "Terminal failure",
    },
  },
  {
    slug: "1inch",
    name: "1inch",
    symbol: "1INCH",
    coingeckoIds: ["1inch"],
    betaAssetIds: ["ethereum"],
    betaSymbol: "ETH",
    accentColor: "#4F7FFF",
    chartStartDate: "2022-11-24",
    mechanism: "Fusion delegation and Unicorn Power staking",
    description:
      "1inch built a complicated staking and delegation system, but the DAO never captured the value of the fees generated around it. The comparison page makes that structural mismatch explicit.",
    accrualMetricLabel: "Staking APR",
    accrualMetricKind: "stakingApr",
    accrualRateMilestones: [
      { date: "2022-11-24", value: 6 },
      { date: "2023-06-01", value: 2 },
      { date: "2024-01-01", value: 8 },
      { date: "2025-07-01", value: 1 },
      { date: "2025-09-01", value: 0 },
      { date: "2026-03-01", value: 0 },
    ],
    stakeRateMilestones: [
      { date: "2022-11-24", value: 6.5 },
      { date: "2024-01-01", value: 8 },
      { date: "2025-07-01", value: 8 },
      { date: "2026-03-01", value: 8 },
    ],
    storyPoints: [
      {
        date: "2022-11-24",
        title: "Fusion turns staking into resolver delegation",
        description:
          "The report treats the Fusion launch as the moment 1INCH stopped being simple governance staking and became a more complex resolver-incentive system.",
      },
      {
        date: "2023-06-01",
        title: "1IP-28 ends DAO revenue",
        description:
          "Once swap surplus collection is shut off, the report's central diagnosis becomes obvious: the DAO has governance theater but no operating income.",
      },
      {
        date: "2024-05-01",
        title: "Fusion 2.0 improves product quality, not token rights",
        description:
          "The protocol keeps shipping product upgrades, but the report emphasizes that better execution does not help tokenholders when value capture still bypasses the DAO.",
      },
      {
        date: "2025-08-01",
        title: "Delegates openly revolt over value leakage",
        description:
          "The financial revitalization fight is the report's key political moment: delegates argue the DAO has become a facade while Labs and resolvers keep the economics.",
      },
      {
        date: "2025-09-01",
        title: "The capture is explicit and unresolved",
        description:
          "By late 2025 the core fact has not changed: Labs controls the fee streams and the DAO still has effectively zero protocol revenue.",
      },
    ],
    reportIds: ["oneInch"],
    researchBriefs: [
      {
        title: "1INCH: A case study in aggregator value accrual failure",
        source: "files.zip research report",
        sourceFile: "1inch_value_accrual_report.md",
        summary:
          "The 1INCH report argues that the token is a clean example of product-market fit without token-market fit: the protocol kept routing huge volume while the DAO lost any meaningful claim on the economics.",
        takeaways: [
          "Fusion and Unicorn Power made staking more complex, but complexity was secondary to the larger problem that revenue increasingly bypassed the DAO.",
          "1IP-28 is the pivotal event because it formalized the split between useful protocol infrastructure and a token with no cashflow claim.",
          "The report treats 1inch as a warning that aggregator dominance is worthless to holders if fee capture lives in labs contracts and API terms instead of the protocol.",
        ],
      },
    ],
    summary: {
      athDrawdown: "-98%",
      stakeRate: "~8%",
      buybackYield: "0% (zero DAO rev)",
      outcome: "Structural capture by Labs",
    },
  },
  {
    slug: "psp",
    name: "ParaSwap",
    symbol: "PSP",
    coingeckoIds: ["paraswap", "paraswap-new"],
    betaAssetIds: ["ethereum"],
    betaSymbol: "ETH",
    accentColor: "#F59E0B",
    chartStartDate: "2021-11-15",
    mechanism: "Social escrow with minimal revenue backing",
    description:
      "ParaSwap tried to turn staking into a behavior-coordination layer with social escrow, but the protocol never generated enough value to make the system matter before the VLR rebrand shut PSP down.",
    accrualMetricLabel: "Reward rate",
    accrualMetricKind: "rewardRate",
    accrualRateMilestones: [
      { date: "2021-11-15", value: 0 },
      { date: "2022-10-01", value: 4 },
      { date: "2023-09-01", value: 2 },
      { date: "2024-10-01", value: 1 },
      { date: "2025-09-16", value: 0 },
      { date: "2026-03-01", value: 0 },
    ],
    storyPoints: [
      {
        date: "2021-11-15",
        title: "PSP launches into a short-lived valuation window",
        description:
          "The report opens with the gap between early token excitement and the much weaker long-run economics that followed.",
      },
      {
        date: "2022-10-01",
        title: "Social escrow tries to reward useful behavior",
        description:
          "The core design idea is genuinely novel: rewards should depend on trading, referrals, and other actions that help the protocol rather than passive lockups.",
      },
      {
        date: "2023-09-01",
        title: "Epoch 8 proves the economics are too small",
        description:
          "The report fixates on the tiny payouts here because they expose the real issue: sophisticated staking logic cannot fix an anemic revenue base.",
      },
      {
        date: "2024-10-01",
        title: "The retrospective admits adoption never came",
        description:
          "By late 2024 ParaBoost is already being streamlined, confirming the report's view that users never found the social-escrow UX compelling enough to matter.",
      },
      {
        date: "2025-09-16",
        title: "Velora replaces PSP outright",
        description:
          "The rebrand is treated as an admission that PSP's history had become an anchor the mechanism could not escape.",
      },
    ],
    reportIds: ["psp"],
    researchBriefs: [
      {
        title: "ParaSwap (PSP/VLR): The terminal aggregator failure case",
        source: "files.zip research report",
        sourceFile: "paraswap_psp_value_accrual_report.md",
        summary:
          "The PSP report is the floor case for aggregator tokens: clever staking mechanics could not compensate for tiny rewards, weak mindshare, and a widening gap between product usage and token value.",
        takeaways: [
          "Social escrow was directionally smart, but the actual rewards were far too small for the mechanism to change user behavior.",
          "PSP is a warning that complex incentive design can become invisible if the protocol never creates enough economic surface area to make the rewards matter.",
          "The VLR rebrand is framed as the last resort after the token's prior history made rehabilitation implausible.",
        ],
      },
    ],
    summary: {
      athDrawdown: "-99.9%",
      stakeRate: "Dead",
      buybackYield: "N/A",
      outcome: "Rebranded to VLR",
    },
  },
  {
    slug: "quick",
    name: "QuickSwap",
    symbol: "QUICK",
    coingeckoIds: ["quickswap", "new-quickswap"],
    betaAssetIds: ["ethereum"],
    betaSymbol: "ETH",
    accentColor: "#68B5FF",
    isVisible: false,
    chartStartDate: "2021-04-30",
    mechanism: "Dragon's Lair -> Trial of Fire -> DragonFi 2.0",
    description:
      "QuickSwap cycled from low-yield staking to a total burn policy on Polygon. The chart tests whether increasingly aggressive token burns ever overcame the lack of sufficient protocol scale.",
    accrualMetricLabel: "Burn rate",
    accrualMetricKind: "burnRate",
    accrualRateMilestones: [
      { date: "2021-04-30", value: 0 },
      { date: "2022-06-01", value: 0 },
      { date: "2024-10-01", value: 8 },
      { date: "2025-06-25", value: 20 },
      { date: "2025-07-01", value: 22 },
      { date: "2026-03-01", value: 18 },
    ],
    stakeRateMilestones: [
      { date: "2021-04-30", value: 6 },
      { date: "2022-06-01", value: 4 },
      { date: "2024-10-01", value: 1 },
      { date: "2025-07-01", value: 0 },
      { date: "2026-03-01", value: 0 },
    ],
    storyPoints: [
      {
        date: "2021-04-30",
        title: "Old QUICK peak",
        description:
          "The original QUICK token touches roughly $1,590 during peak Polygon DEX mania.",
      },
      {
        date: "2022-06-01",
        title: "Redenomination",
        description:
          "Old QUICK converts into New QUICK at a 1:1000 ratio in an attempt to improve usability.",
      },
      {
        date: "2024-10-01",
        title: "Trial of Fire begins",
        description:
          "QuickSwap directs 100% of protocol revenue toward buying back and burning QUICK.",
      },
      {
        date: "2025-06-25",
        title: "Burns outpace emissions",
        description:
          "QUICK burns run at about 4.25x emissions, with roughly 532K burned per day versus 125K emitted.",
      },
      {
        date: "2025-07-01",
        title: "DragonFi 2.0",
        description:
          "Emissions halt entirely and protocol revenue starts funding farming incentives plus burns.",
      },
    ],
    reportIds: ["quick"],
    summary: {
      athDrawdown: "-95%",
      stakeRate: "Killed",
      buybackYield: "~20% burn/yr",
      outcome: "Scale insufficient",
    },
  },
];

export const VALUE_ACCRUAL_PROTOCOLS = PROTOCOLS;

export const VALUE_ACCRUAL_VISIBLE_PROTOCOLS = PROTOCOLS.filter(
  (protocol) => protocol.isVisible !== false,
);

export const VALUE_ACCRUAL_PROTOCOL_IDS = PROTOCOLS.map(
  (protocol) => protocol.slug,
);

export const VALUE_ACCRUAL_VISIBLE_PROTOCOL_IDS =
  VALUE_ACCRUAL_VISIBLE_PROTOCOLS.map((protocol) => protocol.slug);

export const VALUE_ACCRUAL_PROTOCOL_MAP = Object.fromEntries(
  PROTOCOLS.map((protocol) => [protocol.slug, protocol]),
) as Record<string, ValueAccrualProtocolDefinition>;

type MarketChartResponse = {
  prices: [number, number][];
  market_caps: [number, number][];
};

type MarketChartEntry = {
  isoDate: string;
  bucket: string;
  label: string;
  timestamp: number;
  priceUsd: number;
  marketCap: number | null;
  circulatingSupply: number | null;
};

type MarketChartCandidate = {
  chart: MarketChartResponse;
  firstTimestamp: number;
  lastTimestamp: number;
};

type MarketChartDayEntry = {
  timestamp: number;
  priceUsd: number;
  marketCap: number | null;
  chartFirstTimestamp: number;
  candidateIndex: number;
};

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
const COINGECKO_TODAY_LOOKBACK_DAYS = 1;
const COINGECKO_PUBLIC_LOOKBACK_DAYS = 330;
const SKY_MIGRATION_DATE = "2024-09-18";
const SKY_MIGRATION_RATIO = 24_000;
const protocolDataCache = new Map<
  string,
  Promise<LoadedValueAccrualProtocolData>
>();
const serverProtocolDataCache = new Map<
  string,
  Promise<LoadedValueAccrualProtocolData>
>();
const marketChartCache = new Map<string, Promise<MarketChartResponse>>();
const staticMarketChartCache = new Map<
  string,
  Promise<MarketChartResponse | null>
>();
const todayMarketChartCache = new Map<
  string,
  Promise<MarketChartResponse | null>
>();
let staticMarketChartModulePromise: Promise<
  Record<string, ValueAccrualStaticMarketChartRecord>
> | null = null;

export function getValueAccrualProtocol(protocolId: string) {
  return VALUE_ACCRUAL_PROTOCOL_MAP[protocolId];
}

export function getMetricValue(
  point: ValueAccrualPoint,
  metric: ValueAccrualMetricId,
) {
  switch (metric) {
    case "performance":
      return point.performanceRatio;
    case "accrualRate":
      return point.accrualRate;
    case "circulatingSupply":
      return point.circulatingSupply;
    case "priceUsd":
      return point.priceUsd;
    case "stakeRate":
      return point.stakeRate;
    default:
      return null;
  }
}

export function prepareValueAccrualChartPoints(points: ValueAccrualPoint[]) {
  return points
    .map((point) => ({
      ...point,
      circulatingSupply: sanitizeOptionalNumber(point.circulatingSupply),
      accrualRate: sanitizeOptionalNumber(point.accrualRate),
      stakeRate: sanitizeOptionalNumber(point.stakeRate),
    }))
    .filter(
      (point) =>
        Number.isFinite(point.timestamp) &&
        Number.isFinite(point.priceUsd) &&
        Number.isFinite(point.performanceRatio),
    );
}

export function buildValueAccrualComparisonRows(
  protocolData: LoadedValueAccrualProtocolData[],
  selectedMetric: ValueAccrualMetricId,
) {
  const rowsByBucket = new Map<string, ValueAccrualComparisonRow>();

  for (const dataset of protocolData) {
    const chartPoints = prepareValueAccrualChartPoints(dataset.points);

    for (const point of chartPoints) {
      const current = rowsByBucket.get(point.bucket) ?? {
        bucket: point.bucket,
        label: point.label,
      };
      current[dataset.protocol.slug] = getMetricValue(point, selectedMetric);
      rowsByBucket.set(point.bucket, current);
    }
  }

  return [...rowsByBucket.values()]
    .filter((row) =>
      protocolData.some(
        (dataset) => typeof row[dataset.protocol.slug] === "number",
      ),
    )
    .sort((left, right) =>
      String(left.bucket).localeCompare(String(right.bucket)),
    );
}

export function formatMetricValue(
  metric: ValueAccrualMetricId,
  value: number | null,
) {
  if (value == null || Number.isNaN(value)) {
    return "N/A";
  }

  switch (metric) {
    case "performance":
      return formatPerformanceRatio(value);
    case "accrualRate":
      return `${value.toFixed(1)}%`;
    case "circulatingSupply":
      return formatCompactNumber(value);
    case "priceUsd":
      return formatUsd(value);
    case "stakeRate":
      return `${value.toFixed(1)}%`;
    default:
      return `${value}`;
  }
}

export async function loadValueAccrualProtocolData(protocolId: string) {
  const existing = protocolDataCache.get(protocolId);
  if (existing) {
    return existing;
  }

  const protocol = getValueAccrualProtocol(protocolId);
  if (!protocol) {
    throw new Error(`Unknown protocol: ${protocolId}`);
  }

  const promise = loadValueAccrualProtocolDataFn({
    data: { protocolId },
  }).catch((error) => {
    protocolDataCache.delete(protocolId);
    throw error;
  });

  protocolDataCache.set(protocolId, promise);
  return promise;
}

const loadValueAccrualProtocolDataFn = createServerFn({ method: "POST" })
  .inputValidator((data: { protocolId: string }) => data)
  .handler(async ({ data }) => {
    const existing = serverProtocolDataCache.get(data.protocolId);
    if (existing) {
      return existing;
    }

    const protocol = getValueAccrualProtocol(data.protocolId);
    if (!protocol) {
      throw new Error(`Unknown protocol: ${data.protocolId}`);
    }

    const promise = Promise.all([
      fetchProtocolMarketChart(protocol),
      fetchMarketChartWithFallback(
        protocol.betaAssetIds,
        protocol.chartStartDate,
      ),
    ])
      .then(([protocolChart, betaChart]) =>
        buildProtocolDataset(protocol, protocolChart, betaChart),
      )
      .catch((error) => {
        serverProtocolDataCache.delete(data.protocolId);
        throw error;
      });

    serverProtocolDataCache.set(data.protocolId, promise);
    return promise;
  });

async function fetchMarketChartWithFallback(ids: string[], startDate: string) {
  const successfulCharts: MarketChartCandidate[] = [];
  let lastError: Error | null = null;

  for (const id of ids) {
    try {
      const chart = await loadBestAvailableMarketChart(id);
      const summary = summarizeMarketChart(chart);

      if (!summary) {
        continue;
      }

      successfulCharts.push({
        chart,
        firstTimestamp: summary.firstTimestamp,
        lastTimestamp: summary.lastTimestamp,
      });
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  if (successfulCharts.length === 0) {
    throw (
      lastError ??
      new Error(
        `Unable to load CoinGecko market chart. Run pnpm fetch:value-accrual-data to generate static history.`,
      )
    );
  }

  return mergeCandidateMarketCharts(successfulCharts, startDate);
}

async function fetchProtocolMarketChart(
  protocol: ValueAccrualProtocolDefinition,
) {
  if (protocol.slug === "sky") {
    return fetchSkyNormalizedMarketChart(protocol.chartStartDate);
  }

  return fetchMarketChartWithFallback(
    protocol.coingeckoIds,
    protocol.chartStartDate,
  );
}

async function loadBestAvailableMarketChart(coinId: string) {
  const existing = marketChartCache.get(coinId);
  if (existing) {
    return existing;
  }

  const request = loadBestAvailableMarketChartUncached(coinId).catch(
    (error) => {
      marketChartCache.delete(coinId);
      throw error;
    },
  );
  marketChartCache.set(coinId, request);
  return request;
}

async function loadBestAvailableMarketChartUncached(coinId: string) {
  const staticChart = await loadStaticMarketChart(coinId);

  if (staticChart) {
    const todayChart = await fetchTodayMarketChart(coinId).catch(() => null);
    return mergeMarketChartResponses(staticChart, todayChart);
  }

  return fetchLimitedPublicMarketChart(coinId, getPublicLookbackDays());
}

async function loadStaticMarketChart(coinId: string) {
  const existing = staticMarketChartCache.get(coinId);
  if (existing) {
    return existing;
  }

  const request = loadStaticMarketChartUncached(coinId).catch((error) => {
    staticMarketChartCache.delete(coinId);
    throw error;
  });
  staticMarketChartCache.set(coinId, request);
  return request;
}

async function loadStaticMarketChartUncached(coinId: string) {
  const registry = await loadStaticMarketChartRegistry();
  const record = registry[coinId];

  if (!record) {
    return null;
  }

  return {
    prices: record.prices,
    market_caps: record.market_caps,
  } satisfies MarketChartResponse;
}

async function loadStaticMarketChartRegistry() {
  if (staticMarketChartModulePromise) {
    return staticMarketChartModulePromise;
  }

  staticMarketChartModulePromise = import(
    "../data/value-accrual-market-charts.generated"
  )
    .then((module) => module.VALUE_ACCRUAL_STATIC_MARKET_CHARTS ?? {})
    .catch((error) => {
      staticMarketChartModulePromise = null;
      throw error;
    });

  return staticMarketChartModulePromise;
}

async function fetchTodayMarketChart(coinId: string) {
  const todayIsoDate = getTodayIsoDate();
  const cacheKey = `${coinId}:${todayIsoDate}`;
  const existing = todayMarketChartCache.get(cacheKey);
  if (existing) {
    return existing;
  }

  const request = fetchLimitedPublicMarketChart(
    coinId,
    COINGECKO_TODAY_LOOKBACK_DAYS,
  )
    .then((chart) => keepOnlyIsoDate(chart, todayIsoDate))
    .catch((error) => {
      todayMarketChartCache.delete(cacheKey);
      throw error;
    });

  todayMarketChartCache.set(cacheKey, request);
  return request;
}

async function fetchLimitedPublicMarketChart(coinId: string, days: number) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (response.ok) {
      return (await response.json()) as MarketChartResponse;
    }

    const errorText = await response.text().catch(() => "");

    if (response.status === 429 && attempt < 2) {
      await sleep(600 * (attempt + 1));
      continue;
    }

    throw new Error(
      `CoinGecko request failed for ${coinId}: ${response.status} ${errorText}`,
    );
  }

  throw new Error(`CoinGecko request failed for ${coinId}`);
}

function buildProtocolDataset(
  protocol: ValueAccrualProtocolDefinition,
  protocolChart: MarketChartResponse,
  betaChart: MarketChartResponse,
): LoadedValueAccrualProtocolData {
  const protocolEntries = bucketEntriesByMonth(
    protocolChart,
    protocol.chartStartDate,
  );
  const betaEntries = bucketEntriesByMonth(betaChart, protocol.chartStartDate);
  const betaEntriesByBucket = new Map(
    betaEntries.map((entry) => [entry.bucket, entry]),
  );

  const alignedEntries = protocolEntries
    .map((entry) => {
      const betaEntry = betaEntriesByBucket.get(entry.bucket);
      if (!betaEntry) {
        return null;
      }

      return { protocolEntry: entry, betaEntry };
    })
    .filter(
      (
        entry,
      ): entry is {
        protocolEntry: MarketChartEntry;
        betaEntry: MarketChartEntry;
      } => Boolean(entry),
    );

  const firstAlignedEntry = alignedEntries[0];

  if (!firstAlignedEntry) {
    return {
      protocol,
      points: [],
      latestPoint: null,
      windowStartDate: null,
      windowEndDate: null,
      isWindowLimited: false,
    };
  }

  const points = alignedEntries.map(({ protocolEntry, betaEntry }) => {
    const performanceRatio =
      betaEntry.priceUsd === 0
        ? 0
        : protocolEntry.priceUsd / betaEntry.priceUsd;

    return {
      bucket: protocolEntry.bucket,
      label: protocolEntry.label,
      isoDate: protocolEntry.isoDate,
      timestamp: protocolEntry.timestamp,
      priceUsd: protocolEntry.priceUsd,
      circulatingSupply: protocolEntry.circulatingSupply,
      performanceRatio,
      accrualRate: interpolateMilestoneValue(
        protocolEntry.timestamp,
        protocol.accrualRateMilestones,
      ),
      stakeRate: protocol.stakeRateMilestones
        ? interpolateMilestoneValue(
            protocolEntry.timestamp,
            protocol.stakeRateMilestones,
          )
        : null,
      annotations: [],
    };
  });

  const annotationBuckets = new Map<string, ValueAccrualStoryPoint[]>();
  const firstPointTimestamp = points[0]?.timestamp ?? 0;
  const lastPointTimestamp = points.at(-1)?.timestamp ?? 0;

  for (const storyPoint of protocol.storyPoints) {
    const targetTimestamp = toTimestamp(storyPoint.date);
    if (
      targetTimestamp < firstPointTimestamp ||
      targetTimestamp > lastPointTimestamp
    ) {
      continue;
    }
    const nearestPoint = findNearestPoint(points, targetTimestamp);
    if (!nearestPoint) {
      continue;
    }

    const existing = annotationBuckets.get(nearestPoint.bucket) ?? [];
    existing.push(storyPoint);
    annotationBuckets.set(nearestPoint.bucket, existing);
  }

  const annotatedPoints = points.map((point) => ({
    ...point,
    annotations: annotationBuckets.get(point.bucket) ?? [],
  }));

  return {
    protocol,
    points: annotatedPoints,
    latestPoint: annotatedPoints.at(-1) ?? null,
    windowStartDate: annotatedPoints[0]?.isoDate ?? null,
    windowEndDate: annotatedPoints.at(-1)?.isoDate ?? null,
    isWindowLimited:
      Boolean(annotatedPoints[0]?.isoDate) &&
      toTimestamp(annotatedPoints[0].isoDate) -
        toTimestamp(protocol.chartStartDate) >
        1000 * 60 * 60 * 24 * 45,
  };
}

function bucketEntriesByMonth(
  chart: MarketChartResponse,
  startDate: string,
): MarketChartEntry[] {
  const dayEntries = new Map<string, MarketChartEntry>();
  const marketCapsByDay = new Map<string, number>();
  const startTimestamp = toTimestamp(startDate);

  for (const [timestamp, marketCap] of chart.market_caps) {
    const isoDate = toIsoDate(timestamp);
    marketCapsByDay.set(isoDate, marketCap);
  }

  for (const [timestamp, priceUsd] of chart.prices) {
    const isoDate = toIsoDate(timestamp);
    const dayTimestamp = toTimestamp(isoDate);

    if (dayTimestamp < startTimestamp) {
      continue;
    }

    const marketCap = marketCapsByDay.get(isoDate) ?? null;
    const circulatingSupply =
      marketCap != null && marketCap > 0 && priceUsd > 0
        ? marketCap / priceUsd
        : null;

    dayEntries.set(isoDate, {
      isoDate,
      bucket: isoDate.slice(0, 7),
      label: formatMonthLabel(isoDate),
      timestamp: dayTimestamp,
      priceUsd,
      marketCap,
      circulatingSupply,
    });
  }

  const monthEntries = new Map<string, MarketChartEntry>();

  for (const entry of dayEntries.values()) {
    const current = monthEntries.get(entry.bucket);

    if (!current || current.timestamp < entry.timestamp) {
      monthEntries.set(entry.bucket, entry);
    }
  }

  return [...monthEntries.values()].sort((a, b) => a.timestamp - b.timestamp);
}

function interpolateMilestoneValue(
  targetTimestamp: number,
  milestones: ValueAccrualMilestone[],
) {
  const sortedMilestones = milestones
    .map((milestone) => ({
      timestamp: toTimestamp(milestone.date),
      value: milestone.value,
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  const first = sortedMilestones[0];
  const last = sortedMilestones.at(-1);

  if (!first || !last) {
    return null;
  }

  if (targetTimestamp <= first.timestamp) {
    return first.value;
  }

  if (targetTimestamp >= last.timestamp) {
    return last.value;
  }

  for (let index = 1; index < sortedMilestones.length; index += 1) {
    const previous = sortedMilestones[index - 1];
    const next = sortedMilestones[index];

    if (targetTimestamp <= next.timestamp) {
      const range = next.timestamp - previous.timestamp;
      const progress =
        range === 0 ? 0 : (targetTimestamp - previous.timestamp) / range;
      return previous.value + (next.value - previous.value) * progress;
    }
  }

  return last.value;
}

function findNearestPoint(points: ValueAccrualPoint[], timestamp: number) {
  let nearestPoint: ValueAccrualPoint | null = null;
  let smallestDistance = Number.POSITIVE_INFINITY;

  for (const point of points) {
    const distance = Math.abs(point.timestamp - timestamp);

    if (distance < smallestDistance) {
      smallestDistance = distance;
      nearestPoint = point;
    }
  }

  return nearestPoint;
}

function summarizeMarketChart(chart: MarketChartResponse) {
  const timestamps = chart.prices
    .map(([timestamp]) => timestamp)
    .filter((timestamp) => Number.isFinite(timestamp))
    .sort((left, right) => left - right);

  const firstTimestamp = timestamps[0];
  const lastTimestamp = timestamps.at(-1);

  if (firstTimestamp == null || lastTimestamp == null) {
    return null;
  }

  return {
    firstTimestamp,
    lastTimestamp,
  };
}

async function fetchSkyNormalizedMarketChart(startDate: string) {
  const [makerChart, skyChart] = await Promise.all([
    loadBestAvailableMarketChart("maker").catch(() => null),
    loadBestAvailableMarketChart("sky").catch(() => null),
  ]);

  if (!makerChart && !skyChart) {
    throw new Error(
      "Unable to load market data for SKY normalization. Expected maker and/or sky history.",
    );
  }

  const makerEntriesByIsoDate = makerChart
    ? buildDailyMarketChartEntryMap(makerChart, startDate)
    : new Map<
        string,
        { timestamp: number; priceUsd: number; marketCap: number | null }
      >();
  const skyEntriesByIsoDate = skyChart
    ? buildDailyMarketChartEntryMap(skyChart, startDate)
    : new Map<
        string,
        { timestamp: number; priceUsd: number; marketCap: number | null }
      >();
  const allIsoDates = [
    ...new Set([
      ...makerEntriesByIsoDate.keys(),
      ...skyEntriesByIsoDate.keys(),
    ]),
  ].sort();

  const prices: [number, number][] = [];
  const marketCaps: [number, number][] = [];

  for (const isoDate of allIsoDates) {
    const makerEntry = makerEntriesByIsoDate.get(isoDate) ?? null;
    const skyEntry = skyEntriesByIsoDate.get(isoDate) ?? null;
    const isPostMigration = isoDate >= SKY_MIGRATION_DATE;
    const normalizedPrice = isPostMigration
      ? getSkyPostMigrationPrice(skyEntry, makerEntry)
      : getSkyPreMigrationPrice(makerEntry);
    const normalizedMarketCap = isPostMigration
      ? getSkyPostMigrationMarketCap(skyEntry, makerEntry)
      : getSkyPreMigrationMarketCap(makerEntry);
    const timestamp =
      skyEntry?.timestamp ?? makerEntry?.timestamp ?? toTimestamp(isoDate);

    if (normalizedPrice != null && Number.isFinite(normalizedPrice)) {
      prices.push([timestamp, normalizedPrice]);
    }

    if (
      normalizedMarketCap != null &&
      Number.isFinite(normalizedMarketCap) &&
      normalizedMarketCap > 0
    ) {
      marketCaps.push([timestamp, normalizedMarketCap]);
    }
  }

  return {
    prices,
    market_caps: marketCaps,
  } satisfies MarketChartResponse;
}

function mergeCandidateMarketCharts(
  candidates: MarketChartCandidate[],
  startDate: string,
): MarketChartResponse {
  const startTimestamp = toTimestamp(startDate);
  const mergedEntriesByIsoDate = new Map<string, MarketChartDayEntry>();

  for (const [candidateIndex, candidate] of candidates.entries()) {
    const marketCapsByIsoDate = new Map<string, number>();

    for (const [timestamp, marketCap] of candidate.chart.market_caps) {
      if (!Number.isFinite(timestamp) || !Number.isFinite(marketCap)) {
        continue;
      }

      const isoDate = toIsoDate(timestamp);
      const dayTimestamp = toTimestamp(isoDate);

      if (dayTimestamp < startTimestamp) {
        continue;
      }

      marketCapsByIsoDate.set(isoDate, marketCap);
    }

    for (const [timestamp, priceUsd] of candidate.chart.prices) {
      if (!Number.isFinite(timestamp) || !Number.isFinite(priceUsd)) {
        continue;
      }

      const isoDate = toIsoDate(timestamp);
      const dayTimestamp = toTimestamp(isoDate);

      if (dayTimestamp < startTimestamp) {
        continue;
      }

      const nextEntry: MarketChartDayEntry = {
        timestamp: dayTimestamp,
        priceUsd,
        marketCap: marketCapsByIsoDate.get(isoDate) ?? null,
        chartFirstTimestamp: candidate.firstTimestamp,
        candidateIndex,
      };
      const currentEntry = mergedEntriesByIsoDate.get(isoDate);

      if (
        !currentEntry ||
        compareMarketChartDayEntries(nextEntry, currentEntry) > 0
      ) {
        mergedEntriesByIsoDate.set(isoDate, nextEntry);
      }
    }
  }

  const mergedEntries = [...mergedEntriesByIsoDate.values()].sort(
    (left, right) => left.timestamp - right.timestamp,
  );

  return {
    prices: mergedEntries.map((entry) => [entry.timestamp, entry.priceUsd]),
    market_caps: mergedEntries
      .filter(
        (entry) => entry.marketCap != null && Number.isFinite(entry.marketCap),
      )
      .map((entry) => [entry.timestamp, entry.marketCap as number]),
  };
}

function buildDailyMarketChartEntryMap(
  chart: MarketChartResponse,
  startDate: string,
) {
  const startTimestamp = toTimestamp(startDate);
  const marketCapsByIsoDate = new Map<string, number>();
  const entriesByIsoDate = new Map<
    string,
    { timestamp: number; priceUsd: number; marketCap: number | null }
  >();

  for (const [timestamp, marketCap] of chart.market_caps) {
    if (!Number.isFinite(timestamp) || !Number.isFinite(marketCap)) {
      continue;
    }

    const isoDate = toIsoDate(timestamp);
    const dayTimestamp = toTimestamp(isoDate);

    if (dayTimestamp < startTimestamp) {
      continue;
    }

    marketCapsByIsoDate.set(isoDate, marketCap);
  }

  for (const [timestamp, priceUsd] of chart.prices) {
    if (!Number.isFinite(timestamp) || !Number.isFinite(priceUsd)) {
      continue;
    }

    const isoDate = toIsoDate(timestamp);
    const dayTimestamp = toTimestamp(isoDate);

    if (dayTimestamp < startTimestamp) {
      continue;
    }

    entriesByIsoDate.set(isoDate, {
      timestamp: dayTimestamp,
      priceUsd,
      marketCap: marketCapsByIsoDate.get(isoDate) ?? null,
    });
  }

  return entriesByIsoDate;
}

function getSkyPreMigrationPrice(makerEntry: { priceUsd: number } | null) {
  if (!makerEntry || !Number.isFinite(makerEntry.priceUsd)) {
    return null;
  }

  return makerEntry.priceUsd / SKY_MIGRATION_RATIO;
}

function getSkyPreMigrationMarketCap(
  makerEntry: { marketCap: number | null } | null,
) {
  if (
    !makerEntry ||
    makerEntry.marketCap == null ||
    !Number.isFinite(makerEntry.marketCap) ||
    makerEntry.marketCap <= 0
  ) {
    return null;
  }

  return makerEntry.marketCap;
}

function getSkyPostMigrationPrice(
  skyEntry: { priceUsd: number } | null,
  makerEntry: { priceUsd: number } | null,
) {
  if (skyEntry && Number.isFinite(skyEntry.priceUsd) && skyEntry.priceUsd > 0) {
    return skyEntry.priceUsd;
  }

  if (
    makerEntry &&
    Number.isFinite(makerEntry.priceUsd) &&
    makerEntry.priceUsd > 0
  ) {
    return makerEntry.priceUsd / SKY_MIGRATION_RATIO;
  }

  return null;
}

function getSkyPostMigrationMarketCap(
  skyEntry: { marketCap: number | null } | null,
  makerEntry: { marketCap: number | null } | null,
) {
  if (
    skyEntry &&
    skyEntry.marketCap != null &&
    Number.isFinite(skyEntry.marketCap) &&
    skyEntry.marketCap > 0
  ) {
    return skyEntry.marketCap;
  }

  if (
    makerEntry &&
    makerEntry.marketCap != null &&
    Number.isFinite(makerEntry.marketCap) &&
    makerEntry.marketCap > 0
  ) {
    return makerEntry.marketCap;
  }

  return null;
}

function compareMarketChartDayEntries(
  left: MarketChartDayEntry,
  right: MarketChartDayEntry,
) {
  const leftHasPositiveMarketCap = left.marketCap != null && left.marketCap > 0;
  const rightHasPositiveMarketCap =
    right.marketCap != null && right.marketCap > 0;

  if (leftHasPositiveMarketCap !== rightHasPositiveMarketCap) {
    return leftHasPositiveMarketCap ? 1 : -1;
  }

  const leftHasMarketCap =
    left.marketCap != null && Number.isFinite(left.marketCap);
  const rightHasMarketCap =
    right.marketCap != null && Number.isFinite(right.marketCap);

  if (leftHasMarketCap !== rightHasMarketCap) {
    return leftHasMarketCap ? 1 : -1;
  }

  if (left.chartFirstTimestamp !== right.chartFirstTimestamp) {
    return left.chartFirstTimestamp > right.chartFirstTimestamp ? 1 : -1;
  }

  const leftMarketCap = left.marketCap ?? Number.NEGATIVE_INFINITY;
  const rightMarketCap = right.marketCap ?? Number.NEGATIVE_INFINITY;

  if (leftMarketCap !== rightMarketCap) {
    return leftMarketCap > rightMarketCap ? 1 : -1;
  }

  if (left.candidateIndex !== right.candidateIndex) {
    return left.candidateIndex < right.candidateIndex ? 1 : -1;
  }

  return left.priceUsd > right.priceUsd ? 1 : -1;
}

function mergeMarketChartResponses(
  baseChart: MarketChartResponse,
  patchChart: MarketChartResponse | null,
): MarketChartResponse {
  if (!patchChart) {
    return baseChart;
  }

  return {
    prices: mergeTimedSeries(baseChart.prices, patchChart.prices),
    market_caps: mergeTimedSeries(
      baseChart.market_caps,
      patchChart.market_caps,
    ),
  };
}

function mergeTimedSeries(
  baseEntries: [number, number][],
  patchEntries: [number, number][],
) {
  const entriesByIsoDate = new Map<string, [number, number]>();

  for (const entry of baseEntries) {
    if (!isValidTimedValue(entry)) {
      continue;
    }
    entriesByIsoDate.set(toIsoDate(entry[0]), entry);
  }

  for (const entry of patchEntries) {
    if (!isValidTimedValue(entry)) {
      continue;
    }
    entriesByIsoDate.set(toIsoDate(entry[0]), entry);
  }

  return [...entriesByIsoDate.values()].sort(
    (left, right) => left[0] - right[0],
  );
}

function keepOnlyIsoDate(chart: MarketChartResponse, targetIsoDate: string) {
  const prices = chart.prices.filter(
    (entry) =>
      isValidTimedValue(entry) && toIsoDate(entry[0]) === targetIsoDate,
  );
  const marketCaps = chart.market_caps.filter(
    (entry) =>
      isValidTimedValue(entry) && toIsoDate(entry[0]) === targetIsoDate,
  );

  if (prices.length === 0) {
    return null;
  }

  return {
    prices,
    market_caps: marketCaps,
  } satisfies MarketChartResponse;
}

function isValidTimedValue(entry: [number, number] | undefined) {
  return Boolean(
    entry && Number.isFinite(entry[0]) && Number.isFinite(entry[1]),
  );
}

function toIsoDate(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function toTimestamp(dateString: string) {
  return new Date(`${dateString}T00:00:00Z`).getTime();
}

function getPublicLookbackDays() {
  return COINGECKO_PUBLIC_LOOKBACK_DAYS;
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function sanitizeOptionalNumber(value: number | null) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function formatMonthLabel(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${dateString}T00:00:00Z`));
}

export function formatUsd(value: number) {
  if (value >= 1000) {
    return `$${Math.round(value).toLocaleString("en-US")}`;
  }

  if (value >= 1) {
    return `$${value.toFixed(2)}`;
  }

  return `$${value.toFixed(4)}`;
}

export function formatPerformanceRatio(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: value >= 1 ? 5 : 4,
  }).format(value);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: value >= 100 ? 0 : 1,
  }).format(value);
}
