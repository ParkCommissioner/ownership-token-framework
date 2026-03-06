// Letter grade utilities for Variant 6

import type { Metric } from "@/lib/metrics-data"

export type LetterGrade = "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D+" | "D" | "D-" | "F"

export interface GradeInfo {
  grade: LetterGrade
  gpaValue: number // 4.0 scale
  percentage: number
  color: {
    bg: string
    text: string
    border: string
  }
  description: string
}

export interface MetricGrade {
  metricId: string
  metricName: string
  grade: LetterGrade
  info: GradeInfo
  passed: number
  total: number
}

export interface LetterGradeProfile {
  overallGrade: LetterGrade
  overallInfo: GradeInfo
  gpa: number
  metricGrades: MetricGrade[]
}

const GRADE_THRESHOLDS: Array<{ min: number; grade: LetterGrade; gpa: number }> = [
  { min: 97, grade: "A+", gpa: 4.0 },
  { min: 93, grade: "A", gpa: 4.0 },
  { min: 90, grade: "A-", gpa: 3.7 },
  { min: 87, grade: "B+", gpa: 3.3 },
  { min: 83, grade: "B", gpa: 3.0 },
  { min: 80, grade: "B-", gpa: 2.7 },
  { min: 77, grade: "C+", gpa: 2.3 },
  { min: 73, grade: "C", gpa: 2.0 },
  { min: 70, grade: "C-", gpa: 1.7 },
  { min: 67, grade: "D+", gpa: 1.3 },
  { min: 63, grade: "D", gpa: 1.0 },
  { min: 60, grade: "D-", gpa: 0.7 },
  { min: 0, grade: "F", gpa: 0.0 },
]

function getGradeColor(grade: LetterGrade): GradeInfo["color"] {
  if (grade.startsWith("A")) {
    return {
      bg: "bg-emerald-100 dark:bg-emerald-900",
      text: "text-emerald-800 dark:text-emerald-200",
      border: "border-emerald-200 dark:border-emerald-800",
    }
  }
  if (grade.startsWith("B")) {
    return {
      bg: "bg-blue-100 dark:bg-blue-900",
      text: "text-blue-800 dark:text-blue-200",
      border: "border-blue-200 dark:border-blue-800",
    }
  }
  if (grade.startsWith("C")) {
    return {
      bg: "bg-amber-100 dark:bg-amber-900",
      text: "text-amber-800 dark:text-amber-200",
      border: "border-amber-200 dark:border-amber-800",
    }
  }
  if (grade.startsWith("D")) {
    return {
      bg: "bg-orange-100 dark:bg-orange-900",
      text: "text-orange-800 dark:text-orange-200",
      border: "border-orange-200 dark:border-orange-800",
    }
  }
  return {
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-800 dark:text-red-200",
    border: "border-red-200 dark:border-red-800",
  }
}

function getGradeDescription(grade: LetterGrade): string {
  if (grade === "A+" || grade === "A") return "Excellent ownership characteristics"
  if (grade === "A-") return "Very strong ownership profile"
  if (grade.startsWith("B")) return "Good ownership fundamentals"
  if (grade.startsWith("C")) return "Average ownership characteristics"
  if (grade.startsWith("D")) return "Below average ownership profile"
  return "Poor ownership characteristics"
}

export function percentageToGrade(percentage: number): GradeInfo {
  const threshold = GRADE_THRESHOLDS.find((t) => percentage >= t.min) || GRADE_THRESHOLDS[GRADE_THRESHOLDS.length - 1]

  return {
    grade: threshold.grade,
    gpaValue: threshold.gpa,
    percentage,
    color: getGradeColor(threshold.grade),
    description: getGradeDescription(threshold.grade),
  }
}

export function calculateLetterGradeProfile(
  token: { positive: number; evidenceEntries: number },
  metrics: Metric[]
): LetterGradeProfile {
  // Calculate per-metric grades
  const metricGrades: MetricGrade[] = metrics.map((metric) => {
    const passed = metric.criteria.filter((c) => c.status === "✅").length
    const total = metric.criteria.length
    const percentage = total > 0 ? Math.round((passed / total) * 100) : 0
    const info = percentageToGrade(percentage)

    return {
      metricId: metric.id,
      metricName: metric.name.replace(/^Metric \d+:\s*/, ""),
      grade: info.grade,
      info,
      passed,
      total,
    }
  })

  // Calculate overall grade from overall percentage
  const overallPercentage =
    token.evidenceEntries > 0
      ? Math.round((token.positive / token.evidenceEntries) * 100)
      : 0
  const overallInfo = percentageToGrade(overallPercentage)

  // Calculate GPA from metric grades
  const gpa =
    metricGrades.length > 0
      ? metricGrades.reduce((sum, m) => sum + m.info.gpaValue, 0) / metricGrades.length
      : 0

  return {
    overallGrade: overallInfo.grade,
    overallInfo,
    gpa: Math.round(gpa * 10) / 10, // Round to 1 decimal
    metricGrades,
  }
}

export function getGradeForPercentage(positive: number, total: number): GradeInfo {
  const percentage = total > 0 ? Math.round((positive / total) * 100) : 0
  return percentageToGrade(percentage)
}
