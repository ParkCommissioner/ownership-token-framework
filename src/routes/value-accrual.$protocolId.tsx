import { createFileRoute } from "@tanstack/react-router"
import { ProtocolAnalysis } from "@/components/protocol-analysis"
import { generateOpenGraphMetadata } from "@/lib/metadata"
import { getValueAccrualProtocol } from "@/lib/value-accrual-data"

export const Route = createFileRoute("/value-accrual/$protocolId")({
  head: ({ params }) => {
    const protocol = getValueAccrualProtocol(params.protocolId)
    const title = protocol
      ? `${protocol.name} value accrual chart`
      : `${params.protocolId.toUpperCase()} - Value Accrual Analysis`
    return {
      meta: generateOpenGraphMetadata({
        title: `${title} - Ownership Token Framework`,
        description: protocol
          ? `Interactive value accrual comparison chart for ${protocol.name}, including indexed performance, supply, price, and research annotations.`
          : `Chronological analysis of value accrual mechanisms for ${params.protocolId}.`,
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
