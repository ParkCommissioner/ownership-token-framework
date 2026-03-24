import { createFileRoute } from "@tanstack/react-router"
import { ValueAccrualComparisonPage } from "@/components/value-accrual-compare"
import { generateOpenGraphMetadata } from "@/lib/metadata"

export const Route = createFileRoute("/value-accrual/compare")({
  head: () => ({
    meta: generateOpenGraphMetadata({
      title: "Value Accrual Comparison Charts - Ownership Token Framework",
      description:
        "Compare indexed performance, stake rates, burn rates, supply, and price across DeFi value accrual mechanisms.",
      twitterCard: "summary_large_image",
      url: "/value-accrual/compare",
    }),
  }),
  component: ValueAccrualComparisonPage,
})

