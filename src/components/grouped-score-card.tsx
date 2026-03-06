import { cn } from "@/lib/utils"
import {
  type CategoryScore,
  type GroupedScore,
  getAssessmentColor,
  getAssessmentLabel,
} from "@/lib/grouped-score-utils"

interface CategoryScoreColumnProps {
  category: CategoryScore
}

function CategoryScoreColumn({ category }: CategoryScoreColumnProps) {
  const colors = getAssessmentColor(category.assessment)
  const assessmentLabel = getAssessmentLabel(category.assessment)

  // Calculate filled segments for progress bar (10 segments)
  const filledSegments = Math.round((category.percentage / 100) * 10)

  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-background">
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <span>{category.icon}</span>
        <span className="hidden sm:inline">{category.categoryName}</span>
        <span className="sm:hidden">{category.shortName}</span>
      </div>

      {/* Progress bar */}
      <div className="flex gap-0.5 w-full max-w-[100px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-2 rounded-sm transition-colors",
              i < filledSegments ? "bg-chart-4" : "bg-muted-foreground/20"
            )}
          />
        ))}
      </div>

      {/* Fraction */}
      <div className="text-lg font-semibold tabular-nums">
        {category.passed} of {category.total}
      </div>

      {/* Percentage */}
      <div className="text-sm text-muted-foreground">{category.percentage}%</div>

      {/* Assessment badge */}
      <div
        className={cn(
          "px-2 py-0.5 rounded text-xs font-medium",
          colors.bg,
          colors.text
        )}
      >
        {assessmentLabel}
      </div>
    </div>
  )
}

interface GroupedScoreCardProps {
  scores: GroupedScore
  className?: string
}

export function GroupedScoreCard({ scores, className }: GroupedScoreCardProps) {
  return (
    <div className={cn("rounded-lg border bg-background p-4 md:p-6", className)}>
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
        Ownership Profile
      </h2>

      {/* Category columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {scores.categories.map((category) => (
          <CategoryScoreColumn key={category.categoryId} category={category} />
        ))}
      </div>

      {/* Overall score */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall</span>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold tabular-nums">
              {scores.overall.passed} of {scores.overall.total}
            </span>
            <span className="text-muted-foreground">criteria met</span>
            <span className="text-muted-foreground">
              ({scores.overall.percentage}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
