import { createFileRoute } from "@tanstack/react-router";
import { ValueAccrualOverviewPage } from "@/components/value-accrual-overview";
import { generateOpenGraphMetadata } from "@/lib/metadata";

export const Route = createFileRoute("/value-accrual/")({
  head: () => ({
    meta: generateOpenGraphMetadata({
      title: "Value Accrual Overview - Ownership Token Framework",
      description:
        "Overview of value accrual charts, research synthesis, and navigation across the DeFi protocol comparison set.",
      twitterCard: "summary_large_image",
      url: "/value-accrual",
    }),
  }),
  component: ValueAccrualPage,
});

function ValueAccrualPage() {
  return <ValueAccrualOverviewPage />;
}
