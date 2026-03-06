"use client"

import { useCallback, useRef, useState } from "react"
import { BotIcon, SendIcon, XIcon, Loader2Icon } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Metric } from "@/lib/metrics-data"
import {
  PRESET_PROMPTS,
  type ChatContext,
  type ChatMessage,
} from "@/lib/chat-utils"
import { chatFn } from "@/routes/api.chat"

interface AIChatWidgetProps {
  tokenId: string
  tokenName: string
  tokenSymbol: string
  tokenDescription: string
  tokenNetwork: string
  tokenAddress: string
  metrics: Metric[]
  positive: number
  neutral: number
  atRisk: number
  total: number
}

export function AIChatWidget({
  tokenId,
  tokenName,
  tokenSymbol,
  tokenDescription,
  tokenNetwork,
  tokenAddress,
  metrics,
  positive,
  neutral,
  atRisk,
  total,
}: AIChatWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const context: ChatContext = {
    token: {
      id: tokenId,
      name: tokenName,
      symbol: tokenSymbol,
      description: tokenDescription,
      network: tokenNetwork,
      address: tokenAddress,
    },
    metrics,
    summary: {
      positive,
      neutral,
      atRisk,
      total,
    },
  }

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return

    setError(null)
    const userMessage: ChatMessage = { role: "user", content: messageText }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const result = await chatFn({
        data: {
          tokenId,
          message: messageText,
          history: messages,
          context,
        },
      })

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: result.response,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setTimeout(scrollToBottom, 100)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handlePresetClick = (prompt: string) => {
    sendMessage(prompt)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  if (!isExpanded) {
    return (
      <div className="rounded-lg border bg-background p-4">
        <div className="flex items-center gap-2 mb-3">
          <BotIcon className="size-5 text-chart-4" />
          <h3 className="font-medium">OTF Assistant</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Ask about {tokenName}'s ownership profile
        </p>
        <div className="flex flex-col gap-2">
          {PRESET_PROMPTS.slice(0, 3).map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              className="justify-start text-left h-auto py-2 px-3"
              onClick={() => {
                setIsExpanded(true)
                setTimeout(() => handlePresetClick(preset.prompt), 100)
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3"
          onClick={() => setIsExpanded(true)}
        >
          Open chat
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-background flex flex-col h-[500px] lg:h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <BotIcon className="size-5 text-chart-4" />
          <h3 className="font-medium">OTF Assistant</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => setIsExpanded(false)}
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Ask me anything about {tokenName}'s ownership profile.
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESET_PROMPTS.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetClick(preset.prompt)}
                  disabled={isLoading}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-4 py-2",
                message.role === "user"
                  ? "bg-chart-4 text-white"
                  : "bg-muted"
              )}
            >
              {message.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
              <Loader2Icon className="size-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-2 text-sm">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${tokenName}...`}
            className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chart-4"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            <SendIcon className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
