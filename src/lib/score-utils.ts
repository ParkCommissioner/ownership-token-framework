// Score calculation utilities for Variant 1: Simple X of Y

export interface ScoreResult {
  passed: number
  total: number
  percentage: number
}

export interface TokenScoreBreakdown {
  positive: number
  neutral: number
  atRisk: number
  total: number
}

/**
 * Calculate simple X of Y score from token data
 * "Passed" counts only positive (✅) indicators
 */
export function calculateSimpleScore(token: {
  positive: number
  neutral: number
  atRisk: number
  evidenceEntries: number
}): ScoreResult {
  const passed = token.positive
  const total = token.evidenceEntries
  const percentage = total > 0 ? Math.round((passed / total) * 100) : 0
  return { passed, total, percentage }
}

/**
 * Get the score breakdown for display
 */
export function getScoreBreakdown(token: {
  positive: number
  neutral: number
  atRisk: number
  evidenceEntries: number
}): TokenScoreBreakdown {
  return {
    positive: token.positive,
    neutral: token.neutral,
    atRisk: token.atRisk,
    total: token.evidenceEntries,
  }
}

/**
 * Format score as display string
 */
export function formatScoreDisplay(score: ScoreResult): string {
  return `${score.passed} of ${score.total}`
}

/**
 * Format score as fraction string
 */
export function formatScoreFraction(score: ScoreResult): string {
  return `${score.passed}/${score.total}`
}
