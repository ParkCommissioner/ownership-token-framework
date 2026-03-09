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

interface GroupedScoreCardProps {
  scores: GroupedScore
  className?: string
}

export function GroupedScoreCard({ scores, className }: GroupedScoreCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 md:p-6", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Ownership Profile
        </h2>
        <div className="flex items-baseline gap-2 text-sm">
          <span className="font-semibold tabular-nums text-lg">
            {scores.overall.percentage}%
          </span>
          <span className="text-muted-foreground">
            ({scores.overall.passed}/{scores.overall.total} criteria)
          </span>
        </div>
      </div>

      {/* Compact table */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left font-medium text-muted-foreground px-3 py-2">Category</th>
              <th className="text-right font-medium text-muted-foreground px-3 py-2 hidden sm:table-cell">Score</th>
              <th className="text-right font-medium text-muted-foreground px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {scores.categories.map((category) => {
              const colors = getAssessmentColor(category.assessment)
              const assessmentLabel = getAssessmentLabel(category.assessment)
              return (
                <tr key={category.categoryId} className="bg-background">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <CategoryIcon type={category.iconType} className="size-4 text-muted-foreground" />
                      <span className="font-medium">
                        <span className="hidden sm:inline">{category.categoryName}</span>
                        <span className="sm:hidden">{category.shortName}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums hidden sm:table-cell">
                    <span className="font-medium">{category.passed}</span>
                    <span className="text-muted-foreground">/{category.total}</span>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <span className="tabular-nums font-medium sm:hidden">
                        {category.passed}/{category.total}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium",
                          colors.bg,
                          colors.text
                        )}
                      >
                        {assessmentLabel}
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
