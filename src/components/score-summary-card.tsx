import { cn } from "@/lib/utils"
import { ProgressBar } from "./ui/progress-bar"

interface ScoreSummaryCardProps {
  passed: number
  total: number
  percentage: number
  positive: number
  neutral: number
  atRisk: number
  className?: string
}

export function ScoreSummaryCard({
  passed,
  total,
  percentage,
  positive,
  neutral,
  atRisk,
  className,
}: ScoreSummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-background p-4 md:p-6",
        className
      )}
    >
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
        Ownership Score
      </h2>

      <div className="space-y-4">
        {/* Main score display */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <ProgressBar
            value={percentage}
            segments={10}
            className="flex-1"
            size="lg"
          />
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold tabular-nums">
              {passed} of {total}
            </span>
            <span className="text-muted-foreground">criteria met</span>
          </div>
        </div>

        {/* Percentage */}
        <div className="text-sm text-muted-foreground">
          {percentage}% pass rate
        </div>

        {/* Breakdown */}
        <div className="flex flex-wrap gap-4 pt-2 border-t text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-base">✅</span>
            <span className="tabular-nums font-medium">{positive}</span>
            <span className="text-muted-foreground">positive</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base">⚠️</span>
            <span className="tabular-nums font-medium">{neutral}</span>
            <span className="text-muted-foreground">neutral</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base">❌</span>
            <span className="tabular-nums font-medium">{atRisk}</span>
            <span className="text-muted-foreground">at risk</span>
          </div>
        </div>
      </div>
    </div>
  )
}
