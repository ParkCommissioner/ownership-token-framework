import { cn } from "@/lib/utils"
import type { LetterGradeProfile, MetricGrade } from "@/lib/letter-grade-utils"

function MetricGradeRow({ metric }: { metric: MetricGrade }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg font-bold text-sm",
            metric.info.color.bg,
            metric.info.color.text
          )}
        >
          {metric.grade}
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm truncate">{metric.metricName}</div>
          <div className="text-xs text-muted-foreground">
            {metric.passed} of {metric.total} criteria passed
          </div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground tabular-nums shrink-0 ml-2">
        {metric.info.percentage}%
      </div>
    </div>
  )
}

interface LetterGradeCardProps {
  profile: LetterGradeProfile
  className?: string
}

export function LetterGradeCard({ profile, className }: LetterGradeCardProps) {
  const { overallGrade, overallInfo, gpa, metricGrades } = profile

  return (
    <div
      className={cn("rounded-lg border bg-background overflow-hidden", className)}
    >
      {/* Header with grade */}
      <div
        className={cn(
          "p-4 md:p-6",
          overallInfo.color.bg,
          overallInfo.color.border,
          "border-b"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Ownership Grade
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <span
                className={cn(
                  "text-5xl font-bold",
                  overallInfo.color.text
                )}
              >
                {overallGrade}
              </span>
              <div className="text-sm">
                <div className="flex items-baseline gap-1">
                  <span className="font-semibold tabular-nums">{gpa.toFixed(1)}</span>
                  <span className="text-muted-foreground">GPA</span>
                </div>
                <div className="text-muted-foreground">
                  {overallInfo.percentage}% overall
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className={cn("mt-3 text-sm", overallInfo.color.text)}>
          {overallInfo.description}
        </p>
      </div>

      {/* Metric grades */}
      <div className="p-4 md:px-6">
        <h3 className="text-sm font-medium mb-2">By Metric</h3>
        <div className="divide-y">
          {metricGrades.map((metric) => (
            <MetricGradeRow key={metric.metricId} metric={metric} />
          ))}
        </div>
      </div>

      {/* Grade scale legend */}
      <div className="p-4 md:px-6 md:pb-6 border-t bg-muted/30">
        <h3 className="text-xs font-medium text-muted-foreground mb-2">
          Grade Scale
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 text-xs">
          {[
            { grade: "A+", min: "97%" },
            { grade: "A", min: "93%" },
            { grade: "A-", min: "90%" },
            { grade: "B+", min: "87%" },
            { grade: "B", min: "83%" },
            { grade: "B-", min: "80%" },
            { grade: "C+", min: "77%" },
          ].map((item) => (
            <div
              key={item.grade}
              className="flex flex-col items-center py-1 rounded bg-background"
            >
              <span className="font-medium">{item.grade}</span>
              <span className="text-muted-foreground text-[10px]">
                {item.min}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
