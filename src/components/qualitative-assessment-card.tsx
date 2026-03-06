import { cn } from "@/lib/utils"
import type {
  MetricSummary,
  TokenQualitativeProfile,
} from "@/lib/qualitative-score-utils"
import { getAssessmentForRating } from "@/lib/qualitative-score-utils"

function MetricSummaryRow({ summary }: { summary: MetricSummary }) {
  const assessment = getAssessmentForRating(summary.rating)

  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm truncate">{summary.metricName}</h4>
          <span
            className={cn(
              "px-2 py-0.5 rounded text-xs font-medium shrink-0",
              assessment.color.badge
            )}
          >
            {assessment.label}
          </span>
        </div>
        {summary.summary && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {summary.summary}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
        <span className="tabular-nums">
          {summary.positive}/{summary.total}
        </span>
      </div>
    </div>
  )
}

interface QualitativeAssessmentCardProps {
  profile: TokenQualitativeProfile
  className?: string
}

export function QualitativeAssessmentCard({
  profile,
  className,
}: QualitativeAssessmentCardProps) {
  const { assessment, metricSummaries, highlightStatement } = profile

  return (
    <div className={cn("rounded-lg border bg-background overflow-hidden", className)}>
      {/* Header with rating */}
      <div className={cn("p-4 md:p-6", assessment.color.bg, assessment.color.border, "border-b")}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Ownership Assessment
            </h2>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-2xl font-bold",
                  assessment.color.text
                )}
              >
                {assessment.label}
              </span>
            </div>
          </div>
          <div
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              assessment.color.badge
            )}
          >
            {profile.overallRating.charAt(0).toUpperCase() +
              profile.overallRating.slice(1)}
          </div>
        </div>

        <p className={cn("mt-3 text-sm", assessment.color.text)}>
          {highlightStatement}
        </p>
      </div>

      {/* Summary text */}
      <div className="p-4 md:px-6 bg-muted/30 border-b">
        <p className="text-sm text-muted-foreground">{assessment.summary}</p>
      </div>

      {/* Metric breakdowns */}
      <div className="p-4 md:px-6">
        <h3 className="text-sm font-medium mb-2">By Category</h3>
        <div className="divide-y">
          {metricSummaries.map((summary) => (
            <MetricSummaryRow key={summary.metricId} summary={summary} />
          ))}
        </div>
      </div>
    </div>
  )
}
