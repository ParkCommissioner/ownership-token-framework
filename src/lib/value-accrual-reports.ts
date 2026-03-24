export type ValueAccrualReportId =
  | "aave"
  | "sky"
  | "snx"
  | "hype"
  | "hypeCritical"
  | "jup"
  | "cake"
  | "xsushi"
  | "oneInch"
  | "psp"
  | "quick";

export interface ValueAccrualReport {
  id: ValueAccrualReportId;
  title: string;
  sourceFile: string;
  markdown: string;
}

const REPORT_LOADERS: Record<
  ValueAccrualReportId,
  () => Promise<ValueAccrualReport>
> = {
  aave: async () => ({
    id: "aave",
    title:
      "AAVE value accrual: five years from governance receipt to buyback machine",
    sourceFile: "aave_value_accrual_report.md",
    markdown: (
      await import(
        "@/data/value-accrual-reports/aave_value_accrual_report.md?raw"
      )
    ).default,
  }),
  sky: async () => ({
    id: "sky",
    title: "SKY / MKR: Automated buybacks through the migration",
    sourceFile: "sky_value_accrual_report.md",
    markdown: (
      await import(
        "@/data/value-accrual-reports/sky_value_accrual_report.md?raw"
      )
    ).default,
  }),
  snx: async () => ({
    id: "snx",
    title:
      "Synthetix (SNX): Seven Years of Staking Mechanism Evolution — From Inflation Engine to Protocol-Owned Debt",
    sourceFile: "synthetix_snx_value_accrual_report.md",
    markdown: (
      await import(
        "@/data/value-accrual-reports/synthetix_snx_value_accrual_report.md?raw"
      )
    ).default,
  }),
  hype: async () => ({
    id: "hype",
    title: "Hyperliquid (HYPE): The Purest Buyback Machine in DeFi",
    sourceFile: "hyperliquid_hype_value_accrual_report.md",
    markdown: (
      await import(
        "@/data/value-accrual-reports/hyperliquid_hype_value_accrual_report.md?raw"
      )
    ).default,
  }),
  hypeCritical: async () => ({
    id: "hypeCritical",
    title: "Do HYPE Buybacks Actually Drive Price? A Critical Interrogation",
    sourceFile: "hype_buyback_critical_analysis.md",
    markdown: (
      await import(
        "@/data/value-accrual-reports/hype_buyback_critical_analysis.md?raw"
      )
    ).default,
  }),
  jup: async () => ({
    id: "jup",
    title: "Jupiter (JUP): When $70M in Buybacks Doesn't Move the Price",
    sourceFile: "jupiter_jup_value_accrual_report.md",
    markdown: (
      await import(
        "@/data/value-accrual-reports/jupiter_jup_value_accrual_report.md?raw"
      )
    ).default,
  }),
  cake: async () => ({
    id: "cake",
    title:
      "PancakeSwap (CAKE): From veTokenomics to Buyback-and-Burn — Why They Killed Their Own Staking System",
    sourceFile: "pancakeswap_cake_value_accrual_report.md",
    markdown: (
      await import(
        "@/data/value-accrual-reports/pancakeswap_cake_value_accrual_report.md?raw"
      )
    ).default,
  }),
  xsushi: async () => ({
    id: "xsushi",
    title: "xSUSHI: The DeFi Staking Mechanism That Should Have Worked",
    sourceFile: "xsushi_research_report.md",
    markdown: (
      await import("@/data/value-accrual-reports/xsushi_research_report.md?raw")
    ).default,
  }),
  oneInch: async () => ({
    id: "oneInch",
    title: "1INCH: a case study in aggregator value accrual failure",
    sourceFile: "1inch_value_accrual_report.md",
    markdown: (
      await import(
        "@/data/value-accrual-reports/1inch_value_accrual_report.md?raw"
      )
    ).default,
  }),
  psp: async () => ({
    id: "psp",
    title: "ParaSwap (PSP/VLR): The Terminal Aggregator Failure Case",
    sourceFile: "paraswap_psp_value_accrual_report.md",
    markdown: (
      await import(
        "@/data/value-accrual-reports/paraswap_psp_value_accrual_report.md?raw"
      )
    ).default,
  }),
  quick: async () => ({
    id: "quick",
    title:
      "QuickSwap (QUICK): Fair Launch, Dragon's Lair, and the $1.2M Buyback Experiment",
    sourceFile: "quickswap_quick_value_accrual_report.md",
    markdown: (
      await import(
        "@/data/value-accrual-reports/quickswap_quick_value_accrual_report.md?raw"
      )
    ).default,
  }),
};

export async function loadValueAccrualReports(
  reportIds: ValueAccrualReportId[],
) {
  return Promise.all(reportIds.map((reportId) => REPORT_LOADERS[reportId]()));
}
