import Anthropic from "@anthropic-ai/sdk"
import { createServerFn } from "@tanstack/react-start"
import { buildSystemPrompt, type ChatContext, type ChatMessage } from "@/lib/chat-utils"

type ChatRequestData = {
  tokenId: string
  message: string
  history: ChatMessage[]
  context: ChatContext
}

type ChatResponseResult = {
  response: string
}

// Simple in-memory rate limiting
const rateLimiter = new Map<string, number[]>()

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const windowMs = 60000 // 1 minute
  const maxRequests = 10 // 10 requests per minute

  const timestamps = rateLimiter.get(key) || []
  const recentTimestamps = timestamps.filter((t) => now - t < windowMs)

  if (recentTimestamps.length >= maxRequests) {
    return false // Rate limited
  }

  rateLimiter.set(key, [...recentTimestamps, now])
  return true
}

export const chatFn = createServerFn({ method: "POST" })
  .inputValidator((data: ChatRequestData) => data)
  .handler(async ({ data }): Promise<ChatResponseResult> => {
    const { tokenId, message, history, context } = data

    if (!message?.trim()) {
      throw new Error("Message is required")
    }

    // Rate limiting by token (in production, use IP or user ID)
    const rateLimitKey = `chat:${tokenId}`
    if (!checkRateLimit(rateLimitKey)) {
      throw new Error("Rate limit exceeded. Please wait a moment before asking another question.")
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error("AI service not configured")
    }

    try {
      const client = new Anthropic({ apiKey })

      // Build the system prompt with token context
      const systemPrompt = buildSystemPrompt(context)

      // Convert history to Anthropic format
      const messages: Array<{ role: "user" | "assistant"; content: string }> = [
        ...history.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user" as const, content: message },
      ]

      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      })

      const textContent = response.content.find((block) => block.type === "text")
      if (!textContent || textContent.type !== "text") {
        throw new Error("No response from AI")
      }

      return { response: textContent.text }
    } catch (error) {
      console.error("Chat API error:", error)

      if (error instanceof Anthropic.APIError) {
        if (error.status === 429) {
          throw new Error("AI service is busy. Please try again in a moment.")
        }
        if (error.status === 401) {
          throw new Error("AI service authentication error")
        }
      }

      if (error instanceof Error) {
        throw error
      }

      throw new Error("Failed to get AI response")
    }
  })
