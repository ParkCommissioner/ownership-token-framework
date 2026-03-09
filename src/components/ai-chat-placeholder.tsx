"use client"

import { MessageSquareIcon } from "lucide-react"

interface AIChatPlaceholderProps {
  tokenName?: string
}

export function AIChatPlaceholder({ tokenName }: AIChatPlaceholderProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <MessageSquareIcon className="size-5 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-medium">AI Summary</h3>
          {tokenName && (
            <p className="text-sm text-muted-foreground">{tokenName}</p>
          )}
        </div>
      </div>
      <div className="rounded-md border border-dashed border-muted-foreground/25 bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground text-center">
          AI Chatbot summary is not yet configured and has not been tested.
        </p>
      </div>
    </div>
  )
}
