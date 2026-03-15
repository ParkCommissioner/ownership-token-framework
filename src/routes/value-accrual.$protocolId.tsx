import { createFileRoute } from "@tanstack/react-router"
import { ProtocolAnalysis } from "@/components/protocol-analysis"
import { generateOpenGraphMetadata } from "@/lib/metadata"

const PROTOCOL_TITLES: Record<string, string> = {
  aave: "stkAAVE Safety Module - Chronological Analysis",
  aerodrome: "veAERO Vote-Escrow - Chronological Analysis",
}

export const Route = createFileRoute("/value-accrual/$protocolId")({
  head: ({ params }) => {
    const title =
      PROTOCOL_TITLES[params.protocolId] ??
      `${params.protocolId.toUpperCase()} - Value Accrual Analysis`
    return {
      meta: generateOpenGraphMetadata({
        title: `${title} - Ownership Token Framework`,
        description: `Chronological analysis of value accrual mechanisms for ${params.protocolId}.`,
        twitterCard: "summary_large_image",
        url: `/value-accrual/${params.protocolId}`,
      }),
    }
  },
  component: ProtocolAnalysisPage,
})

function ProtocolAnalysisPage() {
  const { protocolId } = Route.useParams()
  return <ProtocolAnalysis protocolId={protocolId} />
}
