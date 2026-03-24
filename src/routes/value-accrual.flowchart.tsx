import { createFileRoute } from "@tanstack/react-router";
import { ValueAccrualFlowchart } from "@/components/value-accrual-flowchart";
import { generateOpenGraphMetadata } from "@/lib/metadata";

export const Route = createFileRoute("/value-accrual/flowchart")({
  head: () => ({
    meta: generateOpenGraphMetadata({
      title: "Value Accrual Flow Diagram - Ownership Token Framework",
      description:
        "Interactive flow diagram mapping how protocols route value to token holders, with links into the protocol pages where analysis exists.",
      twitterCard: "summary_large_image",
      url: "/value-accrual/flowchart",
    }),
  }),
  component: ValueAccrualFlowchartPage,
});

function ValueAccrualFlowchartPage() {
  return <ValueAccrualFlowchart />;
}
