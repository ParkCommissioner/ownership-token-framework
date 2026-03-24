"use client";

import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  VALUE_ACCRUAL_VISIBLE_PROTOCOLS,
  type ValueAccrualProtocolDefinition,
} from "@/lib/value-accrual-data";
import { cn } from "@/lib/utils";

type ValueAccrualSummaryTableProps = {
  protocols?: ValueAccrualProtocolDefinition[];
  selectedProtocolIds?: string[];
  theme?: "dark" | "light";
  title?: string;
  description?: string;
  className?: string;
};

export function ValueAccrualSummaryTable({
  protocols = VALUE_ACCRUAL_VISIBLE_PROTOCOLS,
  selectedProtocolIds,
  theme = "dark",
  title = "Summary table",
  description = "Static research synthesis from the protocol reports and working notes.",
  className,
}: ValueAccrualSummaryTableProps) {
  const isDark = theme === "dark";
  const selectedSet = new Set(selectedProtocolIds ?? []);

  return (
    <Card
      className={cn(
        isDark
          ? "border-white/10 bg-white/5 text-slate-100"
          : "border-border bg-card",
        className,
      )}
    >
      <CardHeader
        className={cn(
          "gap-2",
          isDark ? "border-b border-white/10" : "border-b",
        )}
      >
        <CardTitle
          className={cn("text-lg", isDark ? "text-white" : "text-foreground")}
        >
          {title}
        </CardTitle>
        <CardDescription
          className={isDark ? "text-slate-400" : "text-muted-foreground"}
        >
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Table>
          <TableHeader>
            <TableRow
              className={cn(
                isDark
                  ? "border-white/10 hover:bg-transparent"
                  : "hover:bg-transparent",
              )}
            >
              <TableHead className={isDark ? "text-slate-300" : undefined}>
                Protocol
              </TableHead>
              <TableHead className={isDark ? "text-slate-300" : undefined}>
                Mechanism
              </TableHead>
              <TableHead className={isDark ? "text-slate-300" : undefined}>
                ATH drawdown
              </TableHead>
              <TableHead className={isDark ? "text-slate-300" : undefined}>
                Stake rate
              </TableHead>
              <TableHead className={isDark ? "text-slate-300" : undefined}>
                Buyback yield
              </TableHead>
              <TableHead className={isDark ? "text-slate-300" : undefined}>
                Outcome
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {protocols.map((protocol) => {
              const isSelected =
                selectedSet.size === 0 || selectedSet.has(protocol.slug);
              return (
                <TableRow
                  className={cn(
                    isDark
                      ? "border-white/10 hover:bg-white/5"
                      : "hover:bg-muted/40",
                    selectedSet.size > 0 && !isSelected && "opacity-65",
                    selectedSet.size > 0 &&
                      isSelected &&
                      (isDark ? "bg-white/[0.03]" : "bg-muted/30"),
                  )}
                  key={protocol.slug}
                >
                  <TableCell>
                    <Link
                      className={cn(
                        "inline-flex items-center gap-2 font-medium",
                        isDark
                          ? "text-white hover:text-sky-300"
                          : "text-foreground hover:text-sky-700",
                      )}
                      params={{ protocolId: protocol.slug }}
                      to="/value-accrual/$protocolId"
                    >
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: protocol.accentColor }}
                      />
                      {protocol.symbol}
                    </Link>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "max-w-[280px] whitespace-normal",
                      isDark ? "text-slate-300" : "text-muted-foreground",
                    )}
                  >
                    {protocol.mechanism}
                  </TableCell>
                  <TableCell
                    className={
                      isDark ? "text-slate-300" : "text-muted-foreground"
                    }
                  >
                    {protocol.summary.athDrawdown}
                  </TableCell>
                  <TableCell
                    className={
                      isDark ? "text-slate-300" : "text-muted-foreground"
                    }
                  >
                    {protocol.summary.stakeRate}
                  </TableCell>
                  <TableCell
                    className={
                      isDark ? "text-slate-300" : "text-muted-foreground"
                    }
                  >
                    {protocol.summary.buybackYield}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "max-w-[280px] whitespace-normal",
                      isDark ? "text-slate-300" : "text-muted-foreground",
                    )}
                  >
                    {protocol.summary.outcome}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
