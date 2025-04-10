"use client"

import { ReactNode } from "react"
import { MessageBubble } from "@/components/atoms/MessageBubble"
import { ChatMessageHeader } from "@/components/molecules/ChatMessageHeader"

export interface ChatMessageProps {
  content: string
  variant: "user" | "assistant" | "system"
  author?: string
  headerActions?: ReactNode
  toolOutputs?: ReactNode
  contentRenderer?: () => ReactNode
  className?: string
}

export function ChatMessage({
  content,
  variant,
  author,
  headerActions,
  toolOutputs,
  contentRenderer,
  className,
}: ChatMessageProps) {
  return (
    <MessageBubble variant={variant}>
      {author || headerActions ? (
        <ChatMessageHeader author={author} actions={headerActions} />
      ) : null}

      {toolOutputs && <div className="mb-3">{toolOutputs}</div>}

      {/* Main message content */}
      {content &&
        (contentRenderer ? (
          contentRenderer()
        ) : (
          <div className="whitespace-pre-wrap">{content}</div>
        ))}
    </MessageBubble>
  )
}
