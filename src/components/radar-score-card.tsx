"use client"

import { AlertTriangleIcon } from "lucide-react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils"
import type { RadarScoreData, RiskFlag } from "@/lib/radar-score-utils"
import { getRiskFlagColor } from "@/lib/radar-score-utils"

function RiskFlagItem({ flag }: { flag: RiskFlag }) {
  const colors = getRiskFlagColor(flag.severity)

  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        colors.bg,
        colors.border
      )}
    >
      <div className="flex items-start gap-2">
        <AlertTriangleIcon className={cn("size-4 mt-0.5 shrink-0", colors.icon)} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("font-medium text-sm", colors.text)}>
              {flag.criteriaName}
            </span>
            <span className="text-xs text-muted-foreground">
              {flag.metricName}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {flag.notes}
          </p>
        </div>
      </div>
    </div>
  )
}

interface RadarScoreCardProps {
  data: RadarScoreData
  className?: string
}

export function RadarScoreCard({ data, className }: RadarScoreCardProps) {
  const { dimensions, riskFlags, overallScore } = data

  // Prepare data for recharts
  const chartData = dimensions.map((dim) => ({
    subject: dim.shortName,
    value: dim.value,
    fullMark: 100,
  }))

  const hasRisks = riskFlags.length > 0

  return (
    <div className={cn("rounded-lg border bg-background overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 md:p-6 border-b">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Ownership Profile
            </h2>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold tabular-nums">{overallScore}</span>
              <span className="text-muted-foreground">/100</span>
            </div>
          </div>
          {hasRisks && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 text-sm">
              <AlertTriangleIcon className="size-4" />
              <span>
                {riskFlags.length} risk{riskFlags.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="p-4 md:px-6">
        <div className="h-[280px] sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
                tickCount={5}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="var(--color-chart-4)"
                fill="var(--color-chart-4)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Dimension breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
          {dimensions.map((dim) => (
            <div
              key={dim.id}
              className="flex items-center justify-between text-sm p-2 rounded bg-muted/50"
            >
              <span className="text-muted-foreground truncate">{dim.name}</span>
              <span className="font-medium tabular-nums ml-2">{dim.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Flags */}
      {hasRisks && (
        <div className="p-4 md:px-6 md:pb-6 border-t bg-muted/30">
          <h3 className="text-sm font-medium mb-3">
            Risk Flags ({riskFlags.length})
          </h3>
          <div className="space-y-2">
            {riskFlags.map((flag) => (
              <RiskFlagItem key={flag.id} flag={flag} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
