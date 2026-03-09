import { cn } from "@/lib/utils"
import {
  type CategoryScore,
  type GroupedScore,
  getAssessmentLabel,
} from "@/lib/grouped-score-utils"

interface GroupedScoreCardProps {
  scores: GroupedScore
  className?: string
}

function getAssessmentTextColor(assessment: CategoryScore["assessment"]): string {
  switch (assessment) {
    case "strong":
      return "text-green-600"
    case "moderate":
      return "text-blue-600"
    case "limited":
      return "text-amber-600"
    case "weak":
      return "text-red-600"
  }
}

export function GroupedScoreCard({ scores, className }: GroupedScoreCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 md:p-6", className)}>
      {/* Header with overall score */}
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Ownership Profile
        </h2>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tabular-nums">
            {scores.overall.passed}
          </span>
          <span className="text-lg text-muted-foreground">
            of {scores.overall.total} criteria met
          </span>
        </div>
      </div>

      {/* Category breakdown - text only */}
      <div className="space-y-3">
        {scores.categories.map((category) => {
          const label = getAssessmentLabel(category.assessment)
          const textColor = getAssessmentTextColor(category.assessment)
          return (
            <div
              key={category.categoryId}
              className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
            >
              <span className="text-sm">
                <span className="hidden sm:inline">{category.categoryName}</span>
                <span className="sm:hidden">{category.shortName}</span>
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm tabular-nums text-muted-foreground">
                  {category.passed}/{category.total}
                </span>
                <span className={cn("text-sm font-medium min-w-[70px] text-right", textColor)}>
                  {label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
