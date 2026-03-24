"use client";

import { Link } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  BarChart3Icon,
  GitBranchIcon,
  Table2Icon,
} from "lucide-react";
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

const OVERVIEW_CARDS = [
  {
    title: "Comparison charts",
    description:
      "Overlay the active protocol set on the same axes and switch between price, supply, stake rate, and value-accrual metrics.",
    href: "/value-accrual/compare" as const,
    icon: BarChart3Icon,
  },
  {
    title: "Value flow diagram",
    description:
      "Use the interactive tree to place protocols by how value reaches token holders and jump out to full protocol pages where we have them.",
    href: "/value-accrual/flowchart" as const,
    icon: GitBranchIcon,
  },
  {
    title: "Protocol summary",
    description:
      "Use the table below as the static synthesis layer from the reports while the charts remain the live market-data view.",
    href: "#summary",
    icon: Table2Icon,
  },
];

export function ValueAccrualOverviewPage() {
  return (
    <PageWrapper>
      <section className="bg-background">
        <Container className="py-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold leading-10 tracking-tight text-accent-foreground md:text-4xl">
              Value accrual overview
            </h1>
            <div className="max-w-[800px] text-lg leading-7 text-accent-foreground">
              <p>
                Use the chart pages for the detailed time-series work, the flow
                diagram for mechanism classification, and the summary table for
                the static research view across the protocol set.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                className={buttonVariants({ size: "sm" })}
                to="/value-accrual/compare"
              >
                Open comparison charts
              </Link>
              <Link
                className={buttonVariants({ size: "sm", variant: "outline" })}
                to="/value-accrual/flowchart"
              >
                Open value flow diagram
              </Link>
            </div>
            <ValueAccrualProtocolNav activeSection="overview" theme="light" />
          </div>
        </Container>
      </section>

      <section className="bg-background pb-8">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {OVERVIEW_CARDS.map((card) => {
              const Icon = card.icon;
              const isAnchor = card.href.startsWith("#");

              return (
                <Card key={card.title}>
                  <CardHeader className="gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl border bg-muted/40">
                      <Icon className="size-4 text-foreground" />
                    </div>
                    <div>
                      <CardTitle>{card.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {card.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isAnchor ? (
                      <a
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                        href={card.href}
                      >
                        Jump to section
                        <ArrowRightIcon className="size-3.5" />
                      </a>
                    ) : (
                      <Link
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                        to={card.href}
                      >
                        Open page
                        <ArrowRightIcon className="size-3.5" />
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-background pb-16" id="summary">
        <Container>
          <ValueAccrualSummaryTable
            description="Static research synthesis surfaced from the protocol reports. CAKE and QUICK stay hidden from the main chart UI for now."
            theme="light"
            title="Protocol summary"
          />
        </Container>
      </section>
    </PageWrapper>
  );
}
