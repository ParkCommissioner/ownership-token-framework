// Chat utilities for Variant 2: AI Chatbot

import type { Metric } from "@/lib/metrics-data"

export interface ChatContext {
  token: {
    id: string
    name: string
    symbol: string
    description: string
    network: string
    address: string
  }
  metrics: Metric[]
  summary: {
    positive: number
    neutral: number
    atRisk: number
    total: number
  }
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export const PRESET_PROMPTS = [
  {
    label: "Summarize token",
    prompt:
      "Give me a brief summary of this token's ownership profile. What are the key strengths and any concerns?",
  },
  {
    label: "What are the risks?",
    prompt:
      "What are the main risks or concerns with this token's governance and ownership structure?",
  },
  {
    label: "How does governance work?",
    prompt:
      "Explain how governance works for this token. Who can vote, how are decisions executed, and what safeguards exist?",
  },
  {
    label: "Compare to ideal",
    prompt:
      "How does this token compare to an ideal ownership token? What would need to change to achieve a perfect score?",
  },
]

export function buildSystemPrompt(context: ChatContext): string {
  const metricsText = context.metrics
    .map((metric) => {
      const criteriaText = metric.criteria
        .map((c) => `  - ${c.name}: ${c.status} ${c.notes || ""}`)
        .join("\n")
      return `## ${metric.name}\n${metric.summary || ""}\n${criteriaText}`
    })
    .join("\n\n")

  return `You are an expert assistant for the Ownership Token Framework (OTF).
You are answering questions about ${context.token.name} (${context.token.symbol}).

The OTF evaluates governance tokens across these metrics:
1. Onchain Control - whether tokenholders control protocol decisions
2. Value Accrual - whether value flows to tokenholders
3. Verifiability - whether contracts are verified and auditable
4. Token Distribution - whether ownership is meaningfully distributed
5. Offchain Dependencies - offchain assets like trademarks, domains, licensing

## Token Details
- Name: ${context.token.name}
- Symbol: ${context.token.symbol}
- Network: ${context.token.network}
- Address: ${context.token.address}
- Description: ${context.token.description}

## Score Summary
- Positive (✅): ${context.summary.positive}
- Neutral (⚠️): ${context.summary.neutral}
- At Risk (❌): ${context.summary.atRisk}
- Total criteria: ${context.summary.total}
- Pass rate: ${Math.round((context.summary.positive / context.summary.total) * 100)}%

## Full Evaluation Data

${metricsText}

## Guidelines
- Be concise but thorough (2-4 paragraphs for summaries)
- Reference specific criteria and evidence when relevant
- Highlight both strengths and risks
- Use the status emoji (✅ ⚠️ ❌) when summarizing criteria
- If asked about something not in the data, say so clearly
- Do not make up information not present in the framework data
- Format responses using markdown for readability`
}

export function formatMetricsForContext(metrics: Metric[]): string {
  return JSON.stringify(
    metrics.map((m) => ({
      id: m.id,
      name: m.name,
      summary: m.summary,
      criteria: m.criteria.map((c) => ({
        name: c.name,
        status: c.status,
        notes: c.notes,
      })),
    })),
    null,
    2
  )
}
