import { cn } from "@/lib/utils"
import { LinkIcon, CoinsIcon, FileTextIcon } from "lucide-react"
import {
  type CategoryScore,
  type CategoryIconType,
  type GroupedScore,
  getAssessmentColor,
  getAssessmentLabel,
} from "@/lib/grouped-score-utils"

function CategoryIcon({ type, className }: { type: CategoryIconType; className?: string }) {
  switch (type) {
    case "onchain":
      return <LinkIcon className={className} />
    case "value":
      return <CoinsIcon className={className} />
    case "offchain":
      return <FileTextIcon className={className} />
  }
}

interface CategoryScoreColumnProps {
  category: CategoryScore
}

function CategoryScoreColumn({ category }: CategoryScoreColumnProps) {
  const colors = getAssessmentColor(category.assessment)
  const assessmentLabel = getAssessmentLabel(category.assessment)

  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg border bg-card">
      {/* Header with icon and name */}
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-md bg-muted">
          <CategoryIcon type={category.iconType} className="size-4 text-muted-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-tight">
            <span className="hidden sm:inline">{category.categoryName}</span>
            <span className="sm:hidden">{category.shortName}</span>
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-chart-4 rounded-full transition-all duration-300"
            style={{ width: `${category.percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium tabular-nums">
            {category.passed}/{category.total}
          </span>
          <span className="text-muted-foreground tabular-nums">{category.percentage}%</span>
        </div>
      </div>

      {/* Assessment badge */}
      <div
        className={cn(
          "self-start px-2 py-0.5 rounded text-xs font-medium",
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
    <div className={cn("rounded-lg border bg-card p-4 md:p-6", className)}>
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
              {scores.overall.passed}/{scores.overall.total}
            </span>
            <span className="text-muted-foreground">criteria met</span>
            <span className="text-muted-foreground tabular-nums">
              ({scores.overall.percentage}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
