// Grouped score utilities for Variant 3: Grouped X of Y (3 categories)

import type { Metric } from "@/lib/metrics-data"

export type CategoryIconType = "onchain" | "value" | "offchain"

export interface ScoreCategory {
  id: string
  name: string
  shortName: string
  iconType: CategoryIconType
  metricIds: string[]
  description: string
}

export interface CategoryScore {
  categoryId: string
  categoryName: string
  shortName: string
  iconType: CategoryIconType
  passed: number
  total: number
  percentage: number
  assessment: "strong" | "moderate" | "limited" | "weak"
}

export interface GroupedScore {
  categories: CategoryScore[]
  overall: {
    passed: number
    total: number
    percentage: number
  }
}

// Category definitions mapping framework metrics to three ownership types
export const SCORE_CATEGORIES: ScoreCategory[] = [
  {
    id: "onchain",
    name: "Onchain Ownership",
    shortName: "Onchain",
    iconType: "onchain",
    metricIds: ["onchain-ctrl", "verifiability", "distribution"],
    description: "Governance rights enforced onchain",
  },
  {
    id: "value",
    name: "Value Accrual",
    shortName: "Value",
    iconType: "value",
    metricIds: ["val-accrual"],
    description: "Mechanisms that direct value to holders",
  },
  {
    id: "offchain",
    name: "Offchain Ownership",
    shortName: "Offchain",
    iconType: "offchain",
    metricIds: ["offchain"],
    description: "Rights and influence existing off-chain",
  },
]

function getAssessment(percentage: number): CategoryScore["assessment"] {
  if (percentage >= 80) return "strong"
  if (percentage >= 60) return "moderate"
  if (percentage >= 40) return "limited"
  return "weak"
}

export function calculateGroupedScore(metrics: Metric[]): GroupedScore {
  const categoryScores = SCORE_CATEGORIES.map((category) => {
    const relevantMetrics = metrics.filter((m) =>
      category.metricIds.includes(m.id)
    )
    const criteria = relevantMetrics.flatMap((m) => m.criteria)

    const passed = criteria.filter((c) => c.status === "✅").length
    const total = criteria.length
    const percentage = total > 0 ? Math.round((passed / total) * 100) : 0

    return {
      categoryId: category.id,
      categoryName: category.name,
      shortName: category.shortName,
      iconType: category.iconType,
      passed,
      total,
      percentage,
      assessment: getAssessment(percentage),
    }
  })

  const overall = {
    passed: categoryScores.reduce((sum, c) => sum + c.passed, 0),
    total: categoryScores.reduce((sum, c) => sum + c.total, 0),
    percentage: 0,
  }
  overall.percentage =
    overall.total > 0
      ? Math.round((overall.passed / overall.total) * 100)
      : 0

  return { categories: categoryScores, overall }
}

export function getAssessmentColor(assessment: CategoryScore["assessment"]): {
  bg: string
  text: string
  border: string
} {
  switch (assessment) {
    case "strong":
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
      }
    case "moderate":
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      }
    case "limited":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
      }
    case "weak":
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
      }
  }
}

export function getAssessmentLabel(
  assessment: CategoryScore["assessment"]
): string {
  switch (assessment) {
    case "strong":
      return "Strong"
    case "moderate":
      return "Moderate"
    case "limited":
      return "Limited"
    case "weak":
      return "Weak"
  }
}
