"use client";

import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  ProtocolValueAccrualChart,
  ValueAccrualChartSkeleton,
} from "@/components/value-accrual-chart";
import { ValueAccrualProtocolNav } from "@/components/value-accrual-protocol-nav";
import { ValueAccrualReportViewer } from "@/components/value-accrual-report-viewer";
import { PageWrapper } from "@/components/page-wrapper";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  formatPerformanceRatio,
  VALUE_ACCRUAL_PROTOCOL_IDS,
  formatUsd,
  getValueAccrualProtocol,
  loadValueAccrualProtocolData,
  prepareValueAccrualChartPoints,
  type LoadedValueAccrualProtocolData,
} from "@/lib/value-accrual-data";
import {
  loadValueAccrualReports,
  type ValueAccrualReport,
} from "@/lib/value-accrual-reports";

export const AVAILABLE_PROTOCOLS = new Set(VALUE_ACCRUAL_PROTOCOL_IDS);

export function ProtocolAnalysis({ protocolId }: { protocolId: string }) {
  const protocol = getValueAccrualProtocol(protocolId);
  const [dataset, setDataset] = useState<LoadedValueAccrualProtocolData | null>(
    null,
  );
  const [reports, setReports] = useState<ValueAccrualReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(protocol));

  useEffect(() => {
    if (!protocol) {
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setDataset(null);
    setReports([]);

    Promise.all([
      loadValueAccrualProtocolData(protocolId),
      protocol.reportIds?.length
        ? loadValueAccrualReports(protocol.reportIds)
        : Promise.resolve([]),
    ])
      .then(([nextDataset, nextReports]) => {
        if (!cancelled) {
          setDataset(nextDataset);
          setReports(nextReports);
        }
      })
      .catch((nextError) => {
        if (!cancelled) {
          setError(
            nextError instanceof Error
              ? nextError.message
              : "Unable to load CoinGecko market data.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [protocolId, protocol]);

  if (!protocol) {
    return <MissingProtocolPage protocolId={protocolId} />;
  }

  const latestPoint = dataset?.latestPoint ?? null;
  const chartPoints = useMemo(
    () => (dataset ? prepareValueAccrualChartPoints(dataset.points) : []),
    [dataset],
  );

  return (
    <PageWrapper className="bg-[#020617] text-slate-100">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(182,80,158,0.18),_transparent_36%),linear-gradient(180deg,_#020617,_#050b16)]">
        <Container className="py-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white"
              to="/value-accrual"
            >
              <ArrowLeftIcon className="size-3.5" />
              Back to value accrual overview
            </Link>
            <Link
              className={buttonVariants({ size: "sm", variant: "overlay" })}
              to="/value-accrual/compare"
            >
              Open comparison view
            </Link>
          </div>
          <ValueAccrualProtocolNav
            activeProtocolId={protocol.slug}
            className="mb-6"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: protocol.accentColor }}
                />
                {protocol.symbol}
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                  {protocol.name}
                </h1>
                <p className="max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
                  {protocol.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5">
                  Mechanism: {protocol.mechanism}
                </span>
                <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5">
                  Beta asset: {protocol.betaSymbol}
                  {protocol.secondaryBetaSymbol
                    ? ` (secondary ${protocol.secondaryBetaSymbol})`
                    : ""}
                </span>
                <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5">
                  Start date: {protocol.chartStartDate}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <HeroMetric
                label="ATH drawdown"
                tone={protocol.accentColor}
                value={protocol.summary.athDrawdown}
              />
              <HeroMetric
                label="Stake rate"
                tone="#F97316"
                value={protocol.summary.stakeRate}
              />
              <HeroMetric
                label="Buyback yield"
                tone="#22C55E"
                value={protocol.summary.buybackYield}
              />
              <HeroMetric
                label="Outcome"
                tone="#38BDF8"
                value={protocol.summary.outcome}
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-16 pt-8">
        <Container className="space-y-6">
          {isLoading ? <ValueAccrualChartSkeleton /> : null}

          {!isLoading && error ? (
            <Card className="border-rose-400/20 bg-rose-400/10 text-rose-100">
              <CardContent className="py-4 text-sm leading-6">
                {error}
              </CardContent>
            </Card>
          ) : null}

          {!isLoading && !error && dataset ? (
            <>
              {dataset.isWindowLimited ? (
                <Card className="border-amber-400/20 bg-amber-400/10 text-amber-100">
                  <CardContent className="py-4 text-sm leading-6">
                    CoinGecko public API now exposes only a recent historical
                    window on the free tier. This chart is clipped to{" "}
                    {dataset.windowStartDate} through {dataset.windowEndDate}.
                  </CardContent>
                </Card>
              ) : null}

              <div className="grid gap-3 md:grid-cols-4">
                <HeroMetric
                  label="Current price"
                  tone="#38BDF8"
                  value={latestPoint ? formatUsd(latestPoint.priceUsd) : "N/A"}
                />
                <HeroMetric
                  label="Current supply"
                  tone="#8B5CF6"
                  value={
                    latestPoint?.circulatingSupply != null
                      ? `${Math.round(latestPoint.circulatingSupply).toLocaleString("en-US")}`
                      : "N/A"
                  }
                />
                <HeroMetric
                  label={`${protocol.symbol} / ${protocol.betaSymbol}`}
                  tone={protocol.accentColor}
                  value={
                    latestPoint
                      ? formatPerformanceRatio(latestPoint.performanceRatio)
                      : "N/A"
                  }
                />
                <HeroMetric
                  label={protocol.accrualMetricLabel}
                  tone="#22C55E"
                  value={
                    latestPoint?.accrualRate != null
                      ? `${latestPoint.accrualRate.toFixed(1)}%`
                      : "N/A"
                  }
                />
              </div>

              <ProtocolValueAccrualChart
                chartPoints={chartPoints}
                data={dataset}
              />

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <Card className="border-white/10 bg-white/5 text-slate-100">
                  <CardHeader className="gap-2 border-b border-white/10">
                    <CardTitle className="text-lg text-white">
                      Report-backed story points
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      These annotations are pulled from the research reports and
                      trimmed to the most decision-relevant events. The chart
                      pins each one to the nearest monthly bucket so they stay
                      legible in presentation mode.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    {protocol.storyPoints.map((storyPoint) => (
                      <div
                        className="rounded-2xl border border-white/10 bg-black/10 p-4"
                        key={`${storyPoint.date}-${storyPoint.title}`}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          {storyPoint.date}
                        </p>
                        <p className="mt-2 text-base font-semibold text-white">
                          {storyPoint.title}
                        </p>
                        <p className="mt-1 text-sm leading-7 text-slate-300">
                          {storyPoint.description}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 text-slate-100">
                  <CardHeader className="gap-2 border-b border-white/10">
                    <CardTitle className="text-lg text-white">
                      Methodology
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Presentation-grade rather than execution-grade metrics.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4 text-sm leading-7 text-slate-300">
                    <p>
                      Price and market-cap series come from CoinGecko&apos;s
                      <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-xs">
                        /coins/market_chart
                      </code>
                      endpoint with monthly bucketing for legibility.
                    </p>
                    <p>
                      Circulating supply is estimated as market cap divided by
                      token price. It is directionally useful for buyback and
                      dilution analysis, but it should not be treated as a
                      canonical onchain supply figure.
                    </p>
                    <p>
                      {protocol.accrualMetricLabel} and stake-rate series are
                      hardcoded milestone curves from research notes and
                      interpolated linearly between those points.
                    </p>
                    <p>
                      The performance line is the raw price ratio of{" "}
                      {protocol.symbol} divided by {protocol.betaSymbol}. Higher
                      means {protocol.symbol} is outperforming{" "}
                      {protocol.betaSymbol}; it is not normalized or rebased.
                    </p>
                    {protocol.slug === "sky" ? (
                      <p>
                        Pre-migration MKR history is converted into
                        SKY-equivalent units using the September 18, 2024
                        migration ratio of 1:24,000. Historical MKR market cap
                        is carried across the migration so circulating supply
                        stays continuous.
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              </div>

              {reports.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                      Full research report{reports.length > 1 ? "s" : ""}
                    </h2>
                    <p className="max-w-3xl text-sm leading-7 text-slate-400">
                      Full markdown reports from{" "}
                      <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-xs">
                        files.zip
                      </code>
                      , rendered directly below the chart.
                    </p>
                  </div>

                  {reports.map((report) => (
                    <Card
                      className="border-white/10 bg-white/5 text-slate-100"
                      key={report.id}
                    >
                      <CardHeader className="gap-2 border-b border-white/10">
                        <CardTitle className="text-lg text-white">
                          {report.title}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Source file: {report.sourceFile}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ValueAccrualReportViewer markdown={report.markdown} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : null}
            </>
          ) : null}
        </Container>
      </section>
    </PageWrapper>
  );
}

function MissingProtocolPage({ protocolId }: { protocolId: string }) {
  return (
    <PageWrapper className="bg-[#020617] text-slate-100">
      <section className="py-20">
        <Container className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.16em] text-slate-500">
            Unknown protocol
          </p>
          <h1 className="text-3xl font-semibold text-white">
            No chart page is configured for {protocolId}
          </h1>
          <p className="mx-auto max-w-xl text-slate-400">
            Primary surfaced pages currently cover AAVE, SKY, SNX, HYPE, JUP,
            xSUSHI, 1INCH, and PSP.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              className={buttonVariants({ variant: "overlay" })}
              to="/value-accrual"
            >
              Back to overview
            </Link>
            <Link
              className={buttonVariants({ variant: "default" })}
              to="/value-accrual/compare"
            >
              Open compare page
            </Link>
          </div>
        </Container>
      </section>
    </PageWrapper>
  );
}

function HeroMetric({
  label,
  tone,
  value,
}: {
  label: string;
  tone: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold" style={{ color: tone }}>
        {value}
      </p>
    </div>
  );
}
