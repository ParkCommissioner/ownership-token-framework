// Qualitative assessment utilities for Variant 4

import type { Metric } from "@/lib/metrics-data"

export type QualitativeRating = "excellent" | "good" | "mixed" | "limited" | "concerning"

export interface QualitativeAssessment {
  rating: QualitativeRating
  label: string
  summary: string
  description: string
  color: {
    bg: string
    text: string
    border: string
    badge: string
  }
}

export interface MetricSummary {
  metricId: string
  metricName: string
  rating: QualitativeRating
  summary: string
  positive: number
  neutral: number
  atRisk: number
  total: number
}

export interface TokenQualitativeProfile {
  overallRating: QualitativeRating
  assessment: QualitativeAssessment
  metricSummaries: MetricSummary[]
  highlightStatement: string
}

const QUALITATIVE_RATINGS: Record<QualitativeRating, QualitativeAssessment> = {
  excellent: {
    rating: "excellent",
    label: "Excellent",
    summary: "This token demonstrates exemplary ownership characteristics across all dimensions.",
    description:
      "The protocol exhibits strong tokenholder control, active value accrual mechanisms, fully verified contracts, distributed ownership, and clear offchain governance structures.",
    color: {
      bg: "bg-emerald-50 dark:bg-emerald-950",
      text: "text-emerald-800 dark:text-emerald-200",
      border: "border-emerald-200 dark:border-emerald-800",
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    },
  },
  good: {
    rating: "good",
    label: "Good",
    summary: "This token shows solid ownership fundamentals with minor areas for improvement.",
    description:
      "Most governance mechanisms are well-established and favor tokenholders. Some areas may benefit from strengthening, but overall the token provides meaningful ownership rights.",
    color: {
      bg: "bg-blue-50 dark:bg-blue-950",
      text: "text-blue-800 dark:text-blue-200",
      border: "border-blue-200 dark:border-blue-800",
      badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
  },
  mixed: {
    rating: "mixed",
    label: "Mixed",
    summary: "This token presents a combination of positive ownership characteristics and areas of concern.",
    description:
      "While some ownership mechanisms are in place, there are notable gaps or concerns that potential holders should evaluate carefully. Both strengths and weaknesses are present.",
    color: {
      bg: "bg-amber-50 dark:bg-amber-950",
      text: "text-amber-800 dark:text-amber-200",
      border: "border-amber-200 dark:border-amber-800",
      badge: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    },
  },
  limited: {
    rating: "limited",
    label: "Limited",
    summary: "This token offers limited ownership benefits with significant gaps in key areas.",
    description:
      "Ownership rights are weak in several important dimensions. Potential holders should be aware that meaningful governance participation or value capture may be restricted.",
    color: {
      bg: "bg-orange-50 dark:bg-orange-950",
      text: "text-orange-800 dark:text-orange-200",
      border: "border-orange-200 dark:border-orange-800",
      badge: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    },
  },
  concerning: {
    rating: "concerning",
    label: "Concerning",
    summary: "This token raises significant concerns about ownership and governance structures.",
    description:
      "Multiple critical areas show weaknesses. Token holders may have minimal effective control or value capture. Careful evaluation is strongly recommended before participation.",
    color: {
      bg: "bg-red-50 dark:bg-red-950",
      text: "text-red-800 dark:text-red-200",
      border: "border-red-200 dark:border-red-800",
      badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
  },
}

function getRatingFromPercentage(percentage: number): QualitativeRating {
  if (percentage >= 85) return "excellent"
  if (percentage >= 70) return "good"
  if (percentage >= 50) return "mixed"
  if (percentage >= 30) return "limited"
  return "concerning"
}

function getMetricRating(positive: number, total: number): QualitativeRating {
  const percentage = total > 0 ? (positive / total) * 100 : 0
  return getRatingFromPercentage(percentage)
}

export function calculateQualitativeProfile(
  token: { name: string; positive: number; neutral: number; atRisk: number; evidenceEntries: number },
  metrics: Metric[]
): TokenQualitativeProfile {
  // Calculate per-metric summaries
  const metricSummaries: MetricSummary[] = metrics.map((metric) => {
    const positive = metric.criteria.filter((c) => c.status === "✅").length
    const neutral = metric.criteria.filter((c) => c.status === "⚠️").length
    const atRisk = metric.criteria.filter((c) => c.status === "❌").length
    const total = metric.criteria.length

    return {
      metricId: metric.id,
      metricName: metric.name.replace(/^Metric \d+:\s*/, ""),
      rating: getMetricRating(positive, total),
      summary: metric.summary || "",
      positive,
      neutral,
      atRisk,
      total,
    }
  })

  // Calculate overall rating
  const overallPercentage =
    token.evidenceEntries > 0
      ? (token.positive / token.evidenceEntries) * 100
      : 0
  const overallRating = getRatingFromPercentage(overallPercentage)
  const assessment = QUALITATIVE_RATINGS[overallRating]

  // Generate highlight statement
  const highlightStatement = generateHighlightStatement(
    token.name,
    overallRating,
    metricSummaries
  )

  return {
    overallRating,
    assessment,
    metricSummaries,
    highlightStatement,
  }
}

function generateHighlightStatement(
  tokenName: string,
  rating: QualitativeRating,
  summaries: MetricSummary[]
): string {
  const strongAreas = summaries
    .filter((s) => s.rating === "excellent" || s.rating === "good")
    .map((s) => s.metricName.toLowerCase())

  const weakAreas = summaries
    .filter((s) => s.rating === "limited" || s.rating === "concerning")
    .map((s) => s.metricName.toLowerCase())

  if (rating === "excellent") {
    return `${tokenName} demonstrates strong ownership characteristics across governance, value accrual, and verifiability.`
  }

  if (rating === "good") {
    if (weakAreas.length > 0) {
      return `${tokenName} shows solid fundamentals${strongAreas.length > 0 ? ` especially in ${strongAreas.slice(0, 2).join(" and ")}` : ""}, with room for improvement in ${weakAreas[0]}.`
    }
    return `${tokenName} exhibits well-designed ownership mechanisms with minor areas for enhancement.`
  }

  if (rating === "mixed") {
    const strongPart =
      strongAreas.length > 0
        ? `Strengths include ${strongAreas.slice(0, 2).join(" and ")}.`
        : ""
    const weakPart =
      weakAreas.length > 0
        ? `Areas of concern include ${weakAreas.slice(0, 2).join(" and ")}.`
        : ""
    return `${tokenName} presents a mixed ownership profile. ${strongPart} ${weakPart}`.trim()
  }

  if (rating === "limited") {
    return `${tokenName} offers limited ownership benefits with notable gaps in ${weakAreas.slice(0, 2).join(" and ") || "key governance areas"}.`
  }

  return `${tokenName} raises concerns about tokenholder rights and governance structures. Careful evaluation recommended.`
}

export function getAssessmentForRating(rating: QualitativeRating): QualitativeAssessment {
  return QUALITATIVE_RATINGS[rating]
}
