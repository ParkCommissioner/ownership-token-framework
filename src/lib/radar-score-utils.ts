// Radar chart utilities for Variant 5: Radar Chart with Risk Flags

import type { Metric } from "@/lib/metrics-data"

export interface RadarDimension {
  id: string
  name: string
  shortName: string
  value: number // 0-100
  metricId: string
}

export interface RiskFlag {
  id: string
  criteriaId: string
  criteriaName: string
  metricName: string
  notes: string
  severity: "high" | "medium" | "low"
}

export interface RadarScoreData {
  dimensions: RadarDimension[]
  riskFlags: RiskFlag[]
  overallScore: number
}

// Map metric IDs to radar dimension names
const DIMENSION_NAMES: Record<string, { name: string; shortName: string }> = {
  "onchain-ctrl": { name: "Onchain Control", shortName: "Control" },
  "val-accrual": { name: "Value Accrual", shortName: "Value" },
  verifiability: { name: "Verifiability", shortName: "Verify" },
  distribution: { name: "Distribution", shortName: "Distrib" },
  offchain: { name: "Offchain", shortName: "Offchain" },
}

function getSeverity(
  positive: number,
  total: number
): RiskFlag["severity"] {
  const percentage = total > 0 ? (positive / total) * 100 : 0
  if (percentage < 33) return "high"
  if (percentage < 66) return "medium"
  return "low"
}

export function calculateRadarScore(metrics: Metric[]): RadarScoreData {
  const dimensions: RadarDimension[] = []
  const riskFlags: RiskFlag[] = []

  for (const metric of metrics) {
    const positive = metric.criteria.filter((c) => c.status === "✅").length
    const total = metric.criteria.length
    const percentage = total > 0 ? Math.round((positive / total) * 100) : 0

    const dimInfo = DIMENSION_NAMES[metric.id] || {
      name: metric.name.replace(/^Metric \d+:\s*/, ""),
      shortName: metric.name.replace(/^Metric \d+:\s*/, "").slice(0, 8),
    }

    dimensions.push({
      id: metric.id,
      name: dimInfo.name,
      shortName: dimInfo.shortName,
      value: percentage,
      metricId: metric.id,
    })

    // Identify risk flags (❌ criteria)
    const atRiskCriteria = metric.criteria.filter((c) => c.status === "❌")
    for (const criteria of atRiskCriteria) {
      const metricPositive = metric.criteria.filter(
        (c) => c.status === "✅"
      ).length
      riskFlags.push({
        id: `${metric.id}__${criteria.id}`,
        criteriaId: criteria.id,
        criteriaName: criteria.name,
        metricName: dimInfo.name,
        notes: criteria.notes || "No additional details available.",
        severity: getSeverity(metricPositive, metric.criteria.length),
      })
    }
  }

  const totalPositive = dimensions.reduce((sum, d) => sum + d.value, 0)
  const overallScore =
    dimensions.length > 0 ? Math.round(totalPositive / dimensions.length) : 0

  return { dimensions, riskFlags, overallScore }
}

export function getRiskFlagColor(severity: RiskFlag["severity"]): {
  bg: string
  text: string
  border: string
  icon: string
} {
  switch (severity) {
    case "high":
      return {
        bg: "bg-red-50 dark:bg-red-950",
        text: "text-red-700 dark:text-red-300",
        border: "border-red-200 dark:border-red-800",
        icon: "text-red-500",
      }
    case "medium":
      return {
        bg: "bg-amber-50 dark:bg-amber-950",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-200 dark:border-amber-800",
        icon: "text-amber-500",
      }
    case "low":
      return {
        bg: "bg-yellow-50 dark:bg-yellow-950",
        text: "text-yellow-700 dark:text-yellow-300",
        border: "border-yellow-200 dark:border-yellow-800",
        icon: "text-yellow-500",
      }
  }
}
