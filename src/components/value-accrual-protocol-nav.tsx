"use client";

import { Link } from "@tanstack/react-router";
import { VALUE_ACCRUAL_VISIBLE_PROTOCOLS } from "@/lib/value-accrual-data";
import { cn } from "@/lib/utils";

type ValueAccrualProtocolNavProps = {
  activeProtocolId?: string;
  activeSection?: "overview" | "compare" | "flowchart";
  theme?: "dark" | "light";
  className?: string;
};

export function ValueAccrualProtocolNav({
  activeProtocolId,
  activeSection,
  theme = "dark",
  className,
}: ValueAccrualProtocolNavProps) {
  const isDark = theme === "dark";
  const baseClassName = isDark
    ? "border-white/10 bg-black/10 text-slate-300 hover:border-white/15 hover:text-white"
    : "border-border bg-background text-muted-foreground hover:border-foreground/15 hover:text-foreground";
  const activeClassName = isDark
    ? "border-sky-400/30 bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(56,189,248,0.15)]"
    : "border-sky-500/30 bg-sky-500/10 text-foreground shadow-[inset_0_0_0_1px_rgba(14,165,233,0.15)]";

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Link
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
          activeSection === "overview" ? activeClassName : baseClassName,
        )}
        to="/value-accrual"
      >
        Overview
      </Link>
      <Link
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
          activeSection === "compare" ? activeClassName : baseClassName,
        )}
        to="/value-accrual/compare"
      >
        Compare
      </Link>
      <Link
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
          activeSection === "flowchart" ? activeClassName : baseClassName,
        )}
        to="/value-accrual/flowchart"
      >
        Flowchart
      </Link>
      {VALUE_ACCRUAL_VISIBLE_PROTOCOLS.map((protocol) => (
        <Link
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            activeProtocolId === protocol.slug
              ? activeClassName
              : baseClassName,
          )}
          key={protocol.slug}
          params={{ protocolId: protocol.slug }}
          to="/value-accrual/$protocolId"
        >
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: protocol.accentColor }}
          />
          <span>{protocol.symbol}</span>
        </Link>
      ))}
    </div>
  );
}
