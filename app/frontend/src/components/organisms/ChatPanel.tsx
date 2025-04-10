"use client"

import React, { ReactNode, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChatMessage } from "@/components/organisms/ChatMessage"
import { ChatInputForm } from "@/components/molecules/ChatInputForm"
import { MarkdownRenderer } from "@/components/molecules/MarkdownRenderer"

// Generic message type that can be extended by specific implementations
export interface ChatMessageData {
  id: string
  content: string
  contentType?: "text" | "markdown" | "custom"
  metadata?: Record<string, any>
  role?: string // For backward compatibility until migration is complete
}

// Voice option interface
export interface VoiceOptionItem {
  id: string
  label: string
}

interface ChatPanelProps<T extends ChatMessageData = ChatMessageData> {
  messages: T[]
  inputValue: string
  onInputChange: (value: string) => void
  onInputValueChange: (e: React.FormEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting?: boolean
  error?: string | null
  emptyStateMessage?: string
  renderMessageActions?: (message: T) => ReactNode
  renderMessageContent?: (message: T) => ReactNode
  renderExtraContent?: (message: T) => ReactNode
  sttEndpoint?: string
  silenceThreshold?: number
  className?: string
}

export function ChatPanel<T extends ChatMessageData>({
  messages,
  inputValue,
  onInputChange,
  onInputValueChange,
  onSubmit,
  isSubmitting = false,
  error,
  emptyStateMessage = "Start a conversation",
  renderMessageActions,
  renderMessageContent,
  renderExtraContent,
  sttEndpoint,
  silenceThreshold = 2000,
  className,
}: ChatPanelProps<T>) {
  // Default content renderer based on contentType
  const defaultRenderContent = (message: T) => {
    if (message.contentType === "markdown") {
      return <MarkdownRenderer content={message.content} />
    }
    return <div className="whitespace-pre-wrap">{message.content}</div>
  }

  // Add useRef and useEffect for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <Card
      className={`flex flex-col h-full w-full max-w-4xl mx-auto overflow-hidden !py-0 ${className}`}
    >
      {/* Messages container */}
      <div className="flex-1 p-4 pt-6 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            {emptyStateMessage}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                author={
                  message.role === "user"
                    ? "You"
                    : message.role === "assistant"
                    ? "Assistant"
                    : message.role
                    ? message.role.charAt(0).toUpperCase() +
                      message.role.slice(1)
                    : "Assistant"
                }
                variant={
                  message.role === "user" ||
                  message.role === "assistant" ||
                  message.role === "system"
                    ? message.role
                    : "assistant"
                }
                content={message.content}
                headerActions={
                  renderMessageActions
                    ? renderMessageActions(message)
                    : undefined
                }
                toolOutputs={
                  renderExtraContent ? renderExtraContent(message) : undefined
                }
                contentRenderer={
                  renderMessageContent
                    ? () => renderMessageContent(message)
                    : () => defaultRenderContent(message)
                }
              />
            ))}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <Separator />

      {/* Input area */}
      <div className="p-4 pb-6">
        <div className="flex flex-col space-y-3">
          <ChatInputForm
            ref={(inputFormRef) => {
              // Store the ref for later use if needed
              (window as any).__chatInputFormRef = inputFormRef;
            }}
            value={inputValue}
            onChange={onInputChange}
            onInput={onInputValueChange}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            error={error}
            sttEndpoint={sttEndpoint}
            silenceThreshold={silenceThreshold}
          />
        </div>
      </div>
    </Card>
  )
}
