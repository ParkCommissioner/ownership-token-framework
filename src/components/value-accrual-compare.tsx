"use client";

import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon, CheckIcon, XIcon } from "lucide-react";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ComparisonValueAccrualChart,
  ValueAccrualChartSkeleton,
} from "@/components/value-accrual-chart";
import { ValueAccrualProtocolNav } from "@/components/value-accrual-protocol-nav";
import { ValueAccrualSummaryTable } from "@/components/value-accrual-summary-table";
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
  buildValueAccrualComparisonRows,
  VALUE_ACCRUAL_COMPARE_METRICS,
  VALUE_ACCRUAL_VISIBLE_PROTOCOLS,
  loadValueAccrualProtocolData,
  type LoadedValueAccrualProtocolData,
  type ValueAccrualMetricId,
} from "@/lib/value-accrual-data";
import { cn } from "@/lib/utils";

const DEFAULT_PROTOCOL_SELECTION = ["aave", "sky", "hype", "jup"];

export function ValueAccrualComparisonPage() {
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>(
    DEFAULT_PROTOCOL_SELECTION,
  );
  const [selectedMetric, setSelectedMetric] =
    useState<ValueAccrualMetricId>("performance");
  const [datasetsById, setDatasetsById] = useState<
    Record<string, LoadedValueAccrualProtocolData>
  >({});
  const [loadingIds, setLoadingIds] = useState<string[]>(
    DEFAULT_PROTOCOL_SELECTION,
  );
  const [errorById, setErrorById] = useState<Record<string, string>>({});

  const deferredProtocols = useDeferredValue(selectedProtocols);
  const selectedKey = deferredProtocols.join("|");
  const loadedKey = Object.keys(datasetsById).sort().join("|");
  const errorKey = Object.keys(errorById).sort().join("|");

  useEffect(() => {
    let cancelled = false;
    const missingIds = deferredProtocols.filter(
      (protocolId) => !datasetsById[protocolId] && !errorById[protocolId],
    );

    if (missingIds.length === 0) {
      setLoadingIds((current) =>
        current.filter((protocolId) => deferredProtocols.includes(protocolId)),
      );
      return () => {
        cancelled = true;
      };
    }

    setLoadingIds((current) => [...new Set([...current, ...missingIds])]);

    for (const protocolId of missingIds) {
      loadValueAccrualProtocolData(protocolId)
        .then((dataset) => {
          if (cancelled) {
            return;
          }

          setDatasetsById((current) => ({
            ...current,
            [protocolId]: dataset,
          }));
        })
        .catch((error) => {
          if (cancelled) {
            return;
          }

          setErrorById((current) => ({
            ...current,
            [protocolId]:
              error instanceof Error ? error.message : "Unknown loading error",
          }));
        })
        .finally(() => {
          if (cancelled) {
            return;
          }

          setLoadingIds((current) =>
            current.filter((currentId) => currentId !== protocolId),
          );
        });
    }

    return () => {
      cancelled = true;
    };
  }, [selectedKey, loadedKey, errorKey]);

  const selectedDatasets = deferredProtocols
    .map((protocolId) => datasetsById[protocolId])
    .filter((dataset): dataset is LoadedValueAccrualProtocolData =>
      Boolean(dataset),
    );
  const comparisonRows = useMemo(
    () => buildValueAccrualComparisonRows(selectedDatasets, selectedMetric),
    [selectedDatasets, selectedMetric],
  );
  const limitedDatasets = selectedDatasets.filter(
    (dataset) => dataset.isWindowLimited,
  );
  const hasLoadingSelection = deferredProtocols.some((protocolId) =>
    loadingIds.includes(protocolId),
  );

  function toggleProtocolSelection(protocolId: string, nextChecked?: boolean) {
    startTransition(() => {
      setSelectedProtocols((current) => {
        const isSelected = current.includes(protocolId);
        const shouldSelect = nextChecked ?? !isSelected;

        if (shouldSelect) {
          return isSelected ? current : [...current, protocolId];
        }

        return current.filter(
          (currentProtocol) => currentProtocol !== protocolId,
        );
      });
    });
  }

  function selectAllProtocols() {
    startTransition(() => {
      setSelectedProtocols(
        VALUE_ACCRUAL_VISIBLE_PROTOCOLS.map((protocol) => protocol.slug),
      );
    });
  }

  function clearProtocolSelection() {
    startTransition(() => {
      setSelectedProtocols([]);
    });
  }

  return (
    <PageWrapper className="bg-[#020617] text-slate-100">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.16),_transparent_40%),linear-gradient(180deg,_#020617,_#050b16)]">
        <Container className="py-10">
          <Link
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white"
            to="/value-accrual"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to value accrual overview
          </Link>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                Protocol value accrual comparison
              </h1>
              <p className="max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
                Compare the active protocol set on the same monthly timeline.
                Use the checkboxes to choose the basket, switch the metric view,
                then export the chart directly for decks.
              </p>
            </div>
            <Link
              className={buttonVariants({ size: "sm", variant: "overlay" })}
              params={{ protocolId: "aave" }}
              to="/value-accrual/$protocolId"
            >
              Open a single protocol page
            </Link>
          </div>
          <ValueAccrualProtocolNav activeSection="compare" className="mt-4" />
        </Container>
      </section>

      <section className="pb-16 pt-8">
        <Container className="space-y-6">
          <Card className="border-white/10 bg-white/5 text-slate-100">
            <CardHeader className="gap-2 border-b border-white/10">
              <CardTitle className="text-lg text-white">Controls</CardTitle>
              <CardDescription className="text-slate-400">
                The chart lazily fetches market data for selected protocols from
                CoinGecko and layers in interpolated research milestones for
                staking and burn series.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 pt-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Protocol selector
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-white/15 hover:text-white"
                      onClick={selectAllProtocols}
                      type="button"
                    >
                      Select all
                    </button>
                    <button
                      className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-white/15 hover:text-white"
                      onClick={clearProtocolSelection}
                      type="button"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {VALUE_ACCRUAL_VISIBLE_PROTOCOLS.map((protocol) => {
                    const checked = selectedProtocols.includes(protocol.slug);
                    return (
                      <button
                        aria-pressed={checked}
                        className={cn(
                          "flex cursor-pointer items-start justify-between gap-3 rounded-2xl border p-3 text-left transition-colors",
                          checked
                            ? "border-sky-400/30 bg-white/10 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.15)]"
                            : "border-white/10 bg-black/10 hover:border-white/15",
                        )}
                        key={protocol.slug}
                        onClick={() => toggleProtocolSelection(protocol.slug)}
                        type="button"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="size-2 rounded-full"
                              style={{ backgroundColor: protocol.accentColor }}
                            />
                            <span className="font-medium text-white">
                              {protocol.symbol}
                            </span>
                            <span className="text-sm text-slate-400">
                              {protocol.name}
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-slate-400">
                            {protocol.mechanism}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                            checked
                              ? "border-sky-300/60 bg-sky-300/15 text-sky-100"
                              : "border-white/10 bg-black/20 text-transparent",
                          )}
                        >
                          <CheckIcon className="size-3.5" />
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-medium text-slate-500">
                    Selected:
                  </span>
                  {selectedProtocols.length > 0 ? (
                    VALUE_ACCRUAL_VISIBLE_PROTOCOLS.filter((protocol) =>
                      selectedProtocols.includes(protocol.slug),
                    ).map((protocol) => (
                      <button
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-white/15 hover:text-white"
                        key={protocol.slug}
                        onClick={() =>
                          toggleProtocolSelection(protocol.slug, false)
                        }
                        type="button"
                      >
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: protocol.accentColor }}
                        />
                        <span>{protocol.symbol}</span>
                        <XIcon className="size-3" />
                      </button>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">
                      No protocols selected.
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Metric selector
                </p>
                <div className="grid gap-2">
                  {VALUE_ACCRUAL_COMPARE_METRICS.map((metric) => {
                    const active = selectedMetric === metric.id;
                    return (
                      <button
                        className={cn(
                          "cursor-pointer rounded-2xl border px-4 py-3 text-left transition-colors",
                          active
                            ? "border-sky-400/30 bg-sky-400/10"
                            : "border-white/10 bg-black/10 hover:border-white/15",
                        )}
                        key={metric.id}
                        onClick={() => {
                          startTransition(() => setSelectedMetric(metric.id));
                        }}
                        type="button"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium text-white">
                            {metric.label}
                          </span>
                          <span
                            className={cn(
                              "size-2 rounded-full transition-opacity",
                              active ? "opacity-100" : "opacity-30",
                            )}
                            style={{
                              backgroundColor: active ? "#38BDF8" : "#64748B",
                            }}
                          />
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {metric.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedDatasets.length === 0 && hasLoadingSelection ? (
            <ValueAccrualChartSkeleton />
          ) : (
            <ComparisonValueAccrualChart
              chartRows={comparisonRows}
              protocolData={selectedDatasets}
              selectedMetric={selectedMetric}
            />
          )}

          {limitedDatasets.length > 0 ? (
            <Card className="border-amber-400/20 bg-amber-400/10 text-amber-100">
              <CardContent className="py-4 text-sm leading-6">
                CoinGecko public API now exposes only a recent historical window
                on the free tier. Some selected protocols are clipped to recent
                history instead of their full launch dates.
              </CardContent>
            </Card>
          ) : null}

          {Object.keys(errorById).length > 0 ? (
            <Card className="border-amber-400/20 bg-amber-400/10 text-amber-100">
              <CardContent className="py-4 text-sm leading-6">
                {Object.entries(errorById).map(([protocolId, message]) => (
                  <p key={protocolId}>
                    {protocolId.toUpperCase()}: {message}
                  </p>
                ))}
              </CardContent>
            </Card>
          ) : null}

          <ValueAccrualSummaryTable
            description="Static research synthesis from the protocol reports. CAKE and QUICK are hidden from the surfaced comparison for now."
            selectedProtocolIds={selectedProtocols}
            theme="dark"
          />
        </Container>
      </section>
    </PageWrapper>
  );
}
