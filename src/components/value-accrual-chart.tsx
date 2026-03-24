"use client"

import { DownloadIcon, PinIcon, CopyIcon } from "lucide-react"
import { useRef, useState, type RefObject } from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  formatCompactNumber,
  formatMetricValue,
  formatPerformanceRatio,
  formatUsd,
  type LoadedValueAccrualProtocolData,
  type ValueAccrualComparisonRow,
  type ValueAccrualMetricId,
  type ValueAccrualPoint,
} from "@/lib/value-accrual-data"
import { cn } from "@/lib/utils"

const METRIC_COLORS: Record<Exclude<ValueAccrualMetricId, "performance">, string> = {
  accrualRate: "#22C55E",
  circulatingSupply: "#8B5CF6",
  priceUsd: "#38BDF8",
  stakeRate: "#F97316",
}

const METRIC_LABELS: Record<Exclude<ValueAccrualMetricId, "performance">, string> = {
  accrualRate: "Accrual rate",
  circulatingSupply: "Circulating supply",
  priceUsd: "USD price",
  stakeRate: "Stake rate",
}

const SVG_EXPORT_BACKGROUND = "#071120"

export function ProtocolValueAccrualChart({
  data,
  chartPoints,
}: {
  data: LoadedValueAccrualProtocolData
  chartPoints: ValueAccrualPoint[]
}) {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const [visibleMetrics, setVisibleMetrics] = useState<ValueAccrualMetricId[]>(() => {
    const defaults: ValueAccrualMetricId[] = ["performance", "accrualRate"]
    if (data.protocol.stakeRateMilestones) {
      defaults.push("stakeRate")
    } else {
      defaults.push("priceUsd")
    }
    return defaults
  })
  const [hoveredAnnotationBucket, setHoveredAnnotationBucket] = useState<string | null>(null)
  const [pinnedAnnotationBucket, setPinnedAnnotationBucket] = useState<string | null>(null)

  const annotationBucket = pinnedAnnotationBucket ?? hoveredAnnotationBucket
  const activeAnnotationPoint =
    chartPoints.find((point) => point.bucket === annotationBucket) ?? null

  const performanceValues = visibleMetrics.includes("performance")
    ? chartPoints.map((point) => point.performanceRatio)
    : []
  const rateValues = chartPoints.flatMap((point) => {
    const values: number[] = []
    if (visibleMetrics.includes("accrualRate") && point.accrualRate != null) {
      values.push(point.accrualRate)
    }
    if (visibleMetrics.includes("stakeRate") && point.stakeRate != null) {
      values.push(point.stakeRate)
    }
    return values
  })
  const priceValues = visibleMetrics.includes("priceUsd")
    ? chartPoints.map((point) => point.priceUsd)
    : []
  const supplyValues = visibleMetrics.includes("circulatingSupply")
    ? chartPoints
        .map((point) => point.circulatingSupply)
        .filter((value): value is number => value != null)
    : []

  const performanceDomain = getNumericDomain(performanceValues, 0.18)
  const rateDomain = getNumericDomain(rateValues, 0.18)
  const priceDomain = getNumericDomain(priceValues, 0.2)
  const supplyDomain = getNumericDomain(supplyValues, 0.12)

  const annotations = chartPoints.filter((point) => point.annotations.length > 0)
  const hasRateAxis =
    visibleMetrics.includes("accrualRate") || visibleMetrics.includes("stakeRate")

  return (
    <Card className="border-white/10 bg-[#071120] text-slate-100 shadow-2xl shadow-black/30">
      <CardHeader className="gap-3 border-b border-white/10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg text-white">Protocol comparison chart</CardTitle>
            <CardDescription className="max-w-3xl text-slate-400">
              Performance is plotted as a single {data.protocol.symbol}/{data.protocol.betaSymbol} line
              using the raw price ratio, so higher means {data.protocol.symbol} is outperforming{" "}
              {data.protocol.betaSymbol}. Accrual-rate and stake-rate series are interpolated from
              research milestones; supply is estimated from CoinGecko market cap divided by price.
            </CardDescription>
          </div>
          <ChartExportButtons
            chartRef={chartRef}
            fileName={`value-accrual-${data.protocol.slug}`}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <LegendButton
            active={visibleMetrics.includes("performance")}
            color={data.protocol.accentColor}
            label={`${data.protocol.symbol} / ${data.protocol.betaSymbol}`}
            onClick={() =>
              setVisibleMetrics((current) =>
                toggleMetric(current, "performance")
              )
            }
          />
          <LegendButton
            active={visibleMetrics.includes("accrualRate")}
            color={METRIC_COLORS.accrualRate}
            label={data.protocol.accrualMetricLabel}
            onClick={() =>
              setVisibleMetrics((current) =>
                toggleMetric(current, "accrualRate")
              )
            }
          />
          <LegendButton
            active={visibleMetrics.includes("circulatingSupply")}
            color={METRIC_COLORS.circulatingSupply}
            label="Circulating supply"
            onClick={() =>
              setVisibleMetrics((current) =>
                toggleMetric(current, "circulatingSupply")
              )
            }
          />
          <LegendButton
            active={visibleMetrics.includes("priceUsd")}
            color={METRIC_COLORS.priceUsd}
            label="USD price"
            onClick={() =>
              setVisibleMetrics((current) => toggleMetric(current, "priceUsd"))
            }
          />
          {data.protocol.stakeRateMilestones ? (
            <LegendButton
              active={visibleMetrics.includes("stakeRate")}
              color={METRIC_COLORS.stakeRate}
              label="Stake rate"
              onClick={() =>
                setVisibleMetrics((current) =>
                  toggleMetric(current, "stakeRate")
                )
              }
            />
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(2,6,23,0.95))] p-3"
            ref={chartRef}
          >
            <div className="h-[420px] w-full md:h-[520px]">
              {chartPoints.length > 0 ? (
                <ResponsiveContainer height="100%" width="100%">
                  <ComposedChart
                    data={chartPoints}
                    margin={{ top: 18, right: 24, left: 8, bottom: 8 }}
                  >
                    <defs>
                      <linearGradient id="stake-rate-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={METRIC_COLORS.stakeRate} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={METRIC_COLORS.stakeRate} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke="rgba(148,163,184,0.15)"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      axisLine={false}
                      dataKey="bucket"
                      minTickGap={24}
                      tick={{ fill: "#94A3B8", fontSize: 11 }}
                      tickFormatter={(value) => formatBucketLabel(value)}
                      tickLine={false}
                    />
                    <YAxis domain={[0, 1]} hide yAxisId="annotation" />
                    {visibleMetrics.includes("performance") ? (
                      <YAxis
                        axisLine={false}
                        domain={performanceDomain}
                        tick={{ fill: data.protocol.accentColor, fontSize: 11 }}
                        tickFormatter={(value: number) => formatPerformanceRatio(value)}
                        tickLine={false}
                        width={72}
                        yAxisId="performance"
                      />
                    ) : null}
                    {hasRateAxis ? (
                      <YAxis
                        axisLine={false}
                        domain={rateDomain}
                        orientation={visibleMetrics.includes("performance") ? "left" : "right"}
                        tick={{ fill: "#22C55E", fontSize: 11 }}
                        tickFormatter={(value: number) => `${value.toFixed(0)}%`}
                        tickLine={false}
                        width={58}
                        yAxisId="rate"
                      />
                    ) : null}
                    {visibleMetrics.includes("priceUsd") ? (
                      <YAxis
                        axisLine={false}
                        domain={priceDomain}
                        orientation="right"
                        tick={{ fill: METRIC_COLORS.priceUsd, fontSize: 11 }}
                        tickFormatter={(value: number) => formatUsdTick(value)}
                        tickLine={false}
                        width={66}
                        yAxisId="price"
                      />
                    ) : null}
                    {visibleMetrics.includes("circulatingSupply") ? (
                      <YAxis
                        axisLine={false}
                        domain={supplyDomain}
                        orientation="right"
                        tick={{ fill: METRIC_COLORS.circulatingSupply, fontSize: 11 }}
                        tickFormatter={(value: number) => formatCompactNumber(value)}
                        tickLine={false}
                        width={70}
                        yAxisId="supply"
                      />
                    ) : null}
                    <Tooltip
                      content={
                        <ProtocolTooltipContent
                          protocol={data.protocol}
                          visibleMetrics={visibleMetrics}
                        />
                      }
                      cursor={{ stroke: "rgba(148,163,184,0.2)", strokeDasharray: "4 4" }}
                    />

                    {annotations.map((point) => {
                      const isActive = point.bucket === annotationBucket
                      return (
                        <ReferenceLine
                          key={point.bucket}
                          stroke={isActive ? "rgba(248,250,252,0.55)" : "rgba(248,250,252,0.14)"}
                          strokeDasharray="4 4"
                          x={point.bucket}
                          yAxisId="annotation"
                        />
                      )
                    })}

                    {annotations.map((point) => {
                      const isActive = point.bucket === annotationBucket
                      return (
                        <ReferenceDot
                          fill={isActive ? "#F8FAFC" : "#94A3B8"}
                          ifOverflow="visible"
                          key={`${point.bucket}-dot`}
                          onClick={() =>
                            setPinnedAnnotationBucket((current) =>
                              current === point.bucket ? null : point.bucket
                            )
                          }
                          onMouseEnter={() => setHoveredAnnotationBucket(point.bucket)}
                          onMouseLeave={() => setHoveredAnnotationBucket(null)}
                          r={isActive ? 6 : 4}
                          stroke={isActive ? data.protocol.accentColor : "rgba(248,250,252,0.45)"}
                          strokeWidth={2}
                          x={point.bucket}
                          y={0.96}
                          yAxisId="annotation"
                        />
                      )
                    })}

                    {visibleMetrics.includes("accrualRate") ? (
                      <Line
                        connectNulls
                        dataKey="accrualRate"
                        dot={false}
                        name={data.protocol.accrualMetricLabel}
                        stroke={METRIC_COLORS.accrualRate}
                        strokeWidth={2.3}
                        type="monotone"
                        yAxisId="rate"
                      />
                    ) : null}
                    {visibleMetrics.includes("stakeRate") ? (
                      <Area
                        connectNulls
                        dataKey="stakeRate"
                        fill="url(#stake-rate-fill)"
                        name="Stake rate"
                        stroke={METRIC_COLORS.stakeRate}
                        strokeWidth={1.8}
                        type="monotone"
                        yAxisId="rate"
                      />
                    ) : null}
                    {visibleMetrics.includes("priceUsd") ? (
                      <Line
                        connectNulls
                        dataKey="priceUsd"
                        dot={false}
                        name="USD price"
                        stroke={METRIC_COLORS.priceUsd}
                        strokeWidth={2}
                        type="monotone"
                        yAxisId="price"
                      />
                    ) : null}
                    {visibleMetrics.includes("circulatingSupply") ? (
                      <Line
                        connectNulls
                        dataKey="circulatingSupply"
                        dot={false}
                        name="Circulating supply"
                        stroke={METRIC_COLORS.circulatingSupply}
                        strokeWidth={2}
                        type="monotone"
                        yAxisId="supply"
                      />
                    ) : null}
                    {visibleMetrics.includes("performance") ? (
                      <Line
                        connectNulls
                        dataKey="performanceRatio"
                        dot={false}
                        name={`${data.protocol.symbol} / ${data.protocol.betaSymbol}`}
                        stroke={data.protocol.accentColor}
                        strokeWidth={2.8}
                        type="monotone"
                        yAxisId="performance"
                      />
                    ) : null}
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/10 p-6 text-sm text-slate-400">
                  No computed chart data is available for the current history window.
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <Card className="border-white/10 bg-white/5 text-slate-100">
              <CardHeader className="gap-1 border-b border-white/10">
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  Story points
                  {pinnedAnnotationBucket ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                      <PinIcon className="size-3" />
                      pinned
                    </span>
                  ) : null}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Hover an annotation marker or pin one to keep the research note open while presenting.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {activeAnnotationPoint ? (
                  <AnnotationPanel
                    point={activeAnnotationPoint}
                    onClear={() => setPinnedAnnotationBucket(null)}
                    pinned={Boolean(pinnedAnnotationBucket)}
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-white/10 bg-black/10 p-4 text-sm text-slate-400">
                    Hover a marker on the chart to inspect the mechanism change or narrative shift attached to that period.
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <MetricSnapshot
                label={`${data.protocol.symbol} / ${data.protocol.betaSymbol}`}
                tone={data.protocol.accentColor}
                value={
                  data.latestPoint
                    ? formatPerformanceRatio(data.latestPoint.performanceRatio)
                    : "N/A"
                }
                subtitle="raw price ratio"
              />
              <MetricSnapshot
                label={data.protocol.accrualMetricLabel}
                tone={METRIC_COLORS.accrualRate}
                value={
                  data.latestPoint
                    ? formatMetricValue("accrualRate", data.latestPoint.accrualRate)
                    : "N/A"
                }
                subtitle={data.protocol.accrualMetricKind === "burnRate" ? "annualized burn" : "annualized accrual"}
              />
              <MetricSnapshot
                label="Circulating supply"
                tone={METRIC_COLORS.circulatingSupply}
                value={
                  data.latestPoint?.circulatingSupply != null
                    ? formatCompactNumber(data.latestPoint.circulatingSupply)
                    : "N/A"
                }
                subtitle="market cap / price estimate"
              />
              <MetricSnapshot
                label="USD price"
                tone={METRIC_COLORS.priceUsd}
                value={data.latestPoint ? formatUsd(data.latestPoint.priceUsd) : "N/A"}
                subtitle="CoinGecko market data"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ComparisonValueAccrualChart({
  protocolData,
  chartRows,
  selectedMetric,
}: {
  protocolData: LoadedValueAccrualProtocolData[]
  chartRows: ValueAccrualComparisonRow[]
  selectedMetric: ValueAccrualMetricId
}) {
  const chartRef = useRef<HTMLDivElement | null>(null)

  if (protocolData.length === 0 || chartRows.length === 0) {
    return (
      <Card className="border-white/10 bg-[#071120] text-slate-100">
        <CardContent className="py-16 text-center text-slate-400">
          Select at least one protocol with computed chart data to render the comparison chart.
        </CardContent>
      </Card>
    )
  }

  const values = chartRows.flatMap((row) =>
    protocolData
      .map((dataset) => row[dataset.protocol.slug])
      .filter((value): value is number => typeof value === "number")
  )

  const domain = getNumericDomain(values, 0.16)

  return (
    <Card className="border-white/10 bg-[#071120] text-slate-100 shadow-2xl shadow-black/30">
      <CardHeader className="gap-3 border-b border-white/10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg text-white">Comparison chart</CardTitle>
            <CardDescription className="max-w-3xl text-slate-400">
              {getMetricDescription(selectedMetric)}
            </CardDescription>
          </div>
          <ChartExportButtons chartRef={chartRef} fileName={`value-accrual-compare-${selectedMetric}`} />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div
          className="overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.1),_transparent_35%),linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(2,6,23,0.95))] p-3"
          ref={chartRef}
        >
          <div className="h-[420px] w-full md:h-[520px]">
            <ResponsiveContainer height="100%" width="100%">
              <ComposedChart data={chartRows} margin={{ top: 18, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid
                  stroke="rgba(148,163,184,0.15)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  axisLine={false}
                  dataKey="bucket"
                  minTickGap={24}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  tickFormatter={(value) => formatBucketLabel(value)}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  domain={domain}
                  tick={{ fill: "#E2E8F0", fontSize: 11 }}
                  tickFormatter={(value: number) => formatComparisonTick(selectedMetric, value)}
                  tickLine={false}
                  width={72}
                />
                <Tooltip
                  content={
                    <ComparisonTooltipContent
                      protocolData={protocolData}
                      selectedMetric={selectedMetric}
                    />
                  }
                  cursor={{ stroke: "rgba(148,163,184,0.2)", strokeDasharray: "4 4" }}
                />
                {protocolData.map((dataset) => (
                  <Line
                    connectNulls
                    dataKey={dataset.protocol.slug}
                    dot={false}
                    key={dataset.protocol.slug}
                    name={dataset.protocol.symbol}
                    stroke={dataset.protocol.accentColor}
                    strokeWidth={2.4}
                    type="monotone"
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ValueAccrualChartSkeleton() {
  return (
    <Card className="border-white/10 bg-[#071120] text-slate-100">
      <CardHeader className="space-y-3 border-b border-white/10">
        <Skeleton className="h-6 w-52 bg-white/10" />
        <Skeleton className="h-4 w-full max-w-2xl bg-white/10" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-40 rounded-full bg-white/10" />
          <Skeleton className="h-8 w-32 rounded-full bg-white/10" />
          <Skeleton className="h-8 w-36 rounded-full bg-white/10" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Skeleton className="h-[420px] rounded-2xl bg-white/10 md:h-[520px]" />
          <div className="space-y-4">
            <Skeleton className="h-64 rounded-2xl bg-white/10" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Skeleton className="h-24 rounded-2xl bg-white/10" />
              <Skeleton className="h-24 rounded-2xl bg-white/10" />
              <Skeleton className="h-24 rounded-2xl bg-white/10" />
              <Skeleton className="h-24 rounded-2xl bg-white/10" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function LegendButton({
  active,
  color,
  label,
  onClick,
}: {
  active: boolean
  color: string
  label: string
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-white/10 bg-white/10 text-white"
          : "border-white/10 bg-black/10 text-slate-400 hover:text-white"
      )}
      onClick={onClick}
      type="button"
    >
      <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </button>
  )
}

function ProtocolTooltipContent({
  active,
  payload,
  protocol,
  visibleMetrics,
}: {
  active?: boolean
  payload?: Array<{
    dataKey: string
    name: string
    value: number
    payload?: ValueAccrualPoint
  }>
  protocol: LoadedValueAccrualProtocolData["protocol"]
  visibleMetrics: ValueAccrualMetricId[]
}) {
  if (!active || !payload?.length) {
    return null
  }

  const point = payload[0]?.payload

  if (!point) {
    return null
  }

  return (
    <div className="min-w-[220px] rounded-xl border border-white/10 bg-[#020617]/95 p-3 text-xs text-slate-200 shadow-2xl shadow-black/30 backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="font-semibold text-white">{formatLongMonthLabel(point.isoDate)}</span>
        <span className="text-slate-400">{point.isoDate}</span>
      </div>
      <div className="space-y-1.5">
        {visibleMetrics.includes("performance") ? (
          <TooltipRow
            color={protocol.accentColor}
            label={`${protocol.symbol} / ${protocol.betaSymbol}`}
            value={formatPerformanceRatio(point.performanceRatio)}
          />
        ) : null}
        {visibleMetrics.includes("accrualRate") && point.accrualRate != null ? (
          <TooltipRow
            color={METRIC_COLORS.accrualRate}
            label={protocol.accrualMetricLabel}
            value={formatMetricValue("accrualRate", point.accrualRate)}
          />
        ) : null}
        {visibleMetrics.includes("circulatingSupply") && point.circulatingSupply != null ? (
          <TooltipRow
            color={METRIC_COLORS.circulatingSupply}
            label={METRIC_LABELS.circulatingSupply}
            value={formatCompactNumber(point.circulatingSupply)}
          />
        ) : null}
        {visibleMetrics.includes("priceUsd") ? (
          <TooltipRow
            color={METRIC_COLORS.priceUsd}
            label={METRIC_LABELS.priceUsd}
            value={formatUsd(point.priceUsd)}
          />
        ) : null}
        {visibleMetrics.includes("stakeRate") && point.stakeRate != null ? (
          <TooltipRow
            color={METRIC_COLORS.stakeRate}
            label={METRIC_LABELS.stakeRate}
            value={formatMetricValue("stakeRate", point.stakeRate)}
          />
        ) : null}
      </div>
    </div>
  )
}

function ComparisonTooltipContent({
  active,
  payload,
  protocolData,
  selectedMetric,
}: {
  active?: boolean
  payload?: Array<{
    dataKey: string
    value: number
  }>
  protocolData: LoadedValueAccrualProtocolData[]
  selectedMetric: ValueAccrualMetricId
}) {
  if (!active || !payload?.length) {
    return null
  }

  const rows = payload
    .filter((entry) => typeof entry.value === "number")
    .map((entry) => {
      const dataset = protocolData.find(
        (candidate) => candidate.protocol.slug === entry.dataKey
      )
      return dataset
        ? {
            color: dataset.protocol.accentColor,
            label: dataset.protocol.symbol,
            value: formatMetricValue(selectedMetric, entry.value),
          }
        : null
    })
    .filter((row): row is { color: string; label: string; value: string } => Boolean(row))

  const labelSource = payload[0] as { payload?: { bucket?: string } }
  const bucket = labelSource.payload?.bucket

  return (
    <div className="min-w-[220px] rounded-xl border border-white/10 bg-[#020617]/95 p-3 text-xs text-slate-200 shadow-2xl shadow-black/30 backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="font-semibold text-white">
          {bucket ? formatBucketLabel(bucket) : "Selected period"}
        </span>
        <span className="text-slate-400">{rows.length} protocols</span>
      </div>
      <div className="space-y-1.5">
        {rows.map((row) => (
          <TooltipRow
            color={row.color}
            key={row.label}
            label={row.label}
            value={row.value}
          />
        ))}
      </div>
    </div>
  )
}

function TooltipRow({
  color,
  label,
  value,
}: {
  color: string
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 text-slate-300">
        <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
        <span>{label}</span>
      </span>
      <span className="font-mono font-semibold text-white">{value}</span>
    </div>
  )
}

function AnnotationPanel({
  point,
  pinned,
  onClear,
}: {
  point: ValueAccrualPoint
  pinned: boolean
  onClear: () => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{formatLongMonthLabel(point.isoDate)}</p>
          <p className="text-xs text-slate-400">{point.isoDate}</p>
        </div>
        {pinned ? (
          <Button onClick={onClear} size="xs" variant="overlay">
            Unpin
          </Button>
        ) : null}
      </div>
      <div className="space-y-2">
        {point.annotations.map((annotation) => (
          <div
            className="rounded-xl border border-white/10 bg-black/15 p-3"
            key={`${annotation.date}-${annotation.title}`}
          >
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {annotation.date}
              </span>
            </div>
            <p className="text-sm font-semibold text-white">{annotation.title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              {annotation.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function MetricSnapshot({
  label,
  subtitle,
  tone,
  value,
}: {
  label: string
  subtitle: string
  tone: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white" style={{ color: tone }}>
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
    </div>
  )
}

function ChartExportButtons({
  chartRef,
  fileName,
}: {
  chartRef: RefObject<HTMLDivElement | null>
  fileName: string
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle")

  async function handleCopy() {
    const svgMarkup = getChartSvgMarkup(chartRef.current)

    if (!svgMarkup) {
      setCopyState("failed")
      return
    }

    try {
      if (typeof window !== "undefined" && "ClipboardItem" in globalThis) {
        const clipboardItem = new globalThis.ClipboardItem({
          "image/svg+xml": new Blob([svgMarkup], { type: "image/svg+xml" }),
        })
        await navigator.clipboard.write([clipboardItem])
      } else {
        await navigator.clipboard.writeText(svgMarkup)
      }

      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }

    window.setTimeout(() => setCopyState("idle"), 1800)
  }

  function handleDownload() {
    const svgMarkup = getChartSvgMarkup(chartRef.current)

    if (!svgMarkup) {
      return
    }

    const blob = new Blob([svgMarkup], { type: "image/svg+xml" })
    const objectUrl = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = objectUrl
    anchor.download = `${fileName}.svg`
    anchor.click()
    URL.revokeObjectURL(objectUrl)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={handleCopy} size="sm" variant="overlay">
        <CopyIcon className="size-3.5" />
        {copyState === "copied"
          ? "Copied"
          : copyState === "failed"
            ? "Copy failed"
            : "Copy chart"}
      </Button>
      <Button onClick={handleDownload} size="sm" variant="overlay">
        <DownloadIcon className="size-3.5" />
        Download SVG
      </Button>
    </div>
  )
}

function getMetricDescription(metric: ValueAccrualMetricId) {
  switch (metric) {
    case "performance":
      return "Each line is asset divided by its beta asset price: token / ETH for most protocols and JUP / SOL for Jupiter. Higher means outperformance."
    case "accrualRate":
      return "Protocol-specific staking APR, burn rate, buyback yield, or reward rate reconstructed from research milestones."
    case "circulatingSupply":
      return "Circulating supply uses CoinGecko market cap divided by token price, which captures net dilution and buybacks at the market-data level."
    case "priceUsd":
      return "Raw USD token price from CoinGecko market data."
    case "stakeRate":
      return "Percent of circulating supply staked or locked where that mechanism exists."
    default:
      return ""
  }
}

function toggleMetric(
  currentMetrics: ValueAccrualMetricId[],
  metric: ValueAccrualMetricId
) {
  if (currentMetrics.includes(metric)) {
    return currentMetrics.length === 1
      ? currentMetrics
      : currentMetrics.filter((item) => item !== metric)
  }

  return [...currentMetrics, metric]
}

function getNumericDomain(values: number[], paddingRatio: number) {
  if (values.length === 0) {
    return [0, 100]
  }

  const min = Math.min(...values)
  const max = Math.max(...values)

  if (min === max) {
    const padding = min === 0 ? 10 : Math.abs(min) * 0.2
    return [Math.max(0, min - padding), max + padding]
  }

  const padding = (max - min) * paddingRatio
  return [Math.max(0, min - padding), max + padding]
}

function getChartSvgMarkup(chartElement: HTMLDivElement | null) {
  const svg = chartElement?.querySelector("svg")

  if (!svg) {
    return null
  }

  const clone = svg.cloneNode(true) as SVGSVGElement
  const frame = getExportFrame(clone, chartElement)

  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink")
  clone.setAttribute("viewBox", `${frame.x} ${frame.y} ${frame.width} ${frame.height}`)
  clone.setAttribute("width", `${frame.width}`)
  clone.setAttribute("height", `${frame.height}`)
  clone.setAttribute(
    "style",
    `background:${SVG_EXPORT_BACKGROUND};font-family:Inter,ui-sans-serif,system-ui,sans-serif`
  )

  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect")
  background.setAttribute("x", `${frame.x}`)
  background.setAttribute("y", `${frame.y}`)
  background.setAttribute("width", `${frame.width}`)
  background.setAttribute("height", `${frame.height}`)
  background.setAttribute("fill", SVG_EXPORT_BACKGROUND)

  const defs = clone.querySelector("defs")
  if (defs?.nextSibling) {
    clone.insertBefore(background, defs.nextSibling)
  } else {
    clone.prepend(background)
  }

  const serialized = new XMLSerializer().serializeToString(clone)
  return serialized.includes('xmlns="http://www.w3.org/2000/svg"')
    ? serialized
    : serialized.replace(
        "<svg",
        '<svg xmlns="http://www.w3.org/2000/svg"'
      )
}

function getExportFrame(svg: SVGSVGElement, chartElement: HTMLDivElement | null) {
  const viewBox = svg.getAttribute("viewBox")?.split(/\s+/).map(Number)
  if (viewBox?.length === 4 && viewBox.every((value) => Number.isFinite(value))) {
    return {
      x: viewBox[0],
      y: viewBox[1],
      width: viewBox[2],
      height: viewBox[3],
    }
  }

  const rect = (chartElement ?? svg).getBoundingClientRect()
  const fallbackWidth = Number(svg.getAttribute("width")) || Math.round(rect.width) || 960
  const fallbackHeight = Number(svg.getAttribute("height")) || Math.round(rect.height) || 520

  return {
    x: 0,
    y: 0,
    width: fallbackWidth,
    height: fallbackHeight,
  }
}

function formatBucketLabel(bucket: string) {
  const [year, month] = bucket.split("-")
  const date = new Date(`${year}-${month}-01T00:00:00Z`)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(date)
}

function formatLongMonthLabel(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${dateString}T00:00:00Z`))
}

function formatComparisonTick(metric: ValueAccrualMetricId, value: number) {
  if (metric === "performance") {
    return formatPerformanceRatio(value)
  }

  if (metric === "circulatingSupply") {
    return formatCompactNumber(value)
  }

  if (metric === "priceUsd") {
    return formatUsdTick(value)
  }

  return `${value.toFixed(0)}%`
}

function formatUsdTick(value: number) {
  if (value >= 1000) {
    return `$${Math.round(value).toLocaleString("en-US")}`
  }

  if (value >= 10) {
    return `$${value.toFixed(0)}`
  }

  if (value >= 1) {
    return `$${value.toFixed(1)}`
  }

  return formatUsd(value)
}
