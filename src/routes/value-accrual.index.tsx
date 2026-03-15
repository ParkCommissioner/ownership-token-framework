import { createFileRoute } from "@tanstack/react-router"
import { ValueAccrualFlowchart } from "@/components/value-accrual-flowchart"
import { generateOpenGraphMetadata } from "@/lib/metadata"

export const Route = createFileRoute("/value-accrual/")({
  head: () => ({
    meta: generateOpenGraphMetadata({
      title: "Value Accrual Mechanisms - Ownership Token Framework",
      description:
        "Interactive comparison of DeFi value accrual mechanisms. Explore how protocols distribute value to token holders through buybacks, burns, staking, and ve-locks.",
      twitterCard: "summary_large_image",
      url: "/value-accrual",
    }),
  }),
  component: ValueAccrualPage,
})

function ValueAccrualPage() {
  return <ValueAccrualFlowchart />
}
