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

interface CategoryPillProps {
  category: CategoryScore
}

function CategoryPill({ category }: CategoryPillProps) {
  const colors = getAssessmentColor(category.assessment)
  const assessmentLabel = getAssessmentLabel(category.assessment)

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-full border",
        colors.border,
        colors.bg
      )}
    >
      {/* Icon */}
      <div className={cn("flex size-8 items-center justify-center rounded-full bg-background/80")}>
        <CategoryIcon type={category.iconType} className={cn("size-4", colors.text)} />
      </div>

      {/* Content */}
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-muted-foreground truncate">
          <span className="hidden sm:inline">{category.categoryName}</span>
          <span className="sm:hidden">{category.shortName}</span>
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className={cn("font-semibold tabular-nums", colors.text)}>
            {category.passed}/{category.total}
          </span>
          <span className={cn("text-xs font-medium", colors.text)}>
            {assessmentLabel}
          </span>
        </div>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Ownership Profile
        </h2>
        <div className="flex items-baseline gap-2 text-sm">
          <span className="font-semibold tabular-nums">
            {scores.overall.passed}/{scores.overall.total}
          </span>
          <span className="text-muted-foreground">criteria met</span>
          <span className="text-muted-foreground tabular-nums">
            ({scores.overall.percentage}%)
          </span>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-3">
        {scores.categories.map((category) => (
          <CategoryPill key={category.categoryId} category={category} />
        ))}
      </div>
    </div>
  )
}
