"use client"

import { useState, ReactNode } from "react"
import { useChat } from "@ai-sdk/react"
import { ChatPanel, ChatMessageData } from "@/components/organisms/ChatPanel"
import { AIMessageType, AIMessageFinishResponse } from "./types"

const SYSTEM_ROLES = ["system", "function"]

const isSystemRole = (role: string) => {
  return SYSTEM_ROLES.includes(role)
}

export interface UserAssistantProps {
  initialSystemMessage?: string
  renderMessageActions?: (message: AIMessageType) => ReactNode
  renderExtraContent?: (message: AIMessageType) => ReactNode
  renderMessageContent?: (message: AIMessageType) => ReactNode
  onMessageResponse?: (response: any) => void
  onMessageFinish?: (message: AIMessageFinishResponse) => void
  onMessageError?: (error: any) => void
  onToolCall?: (toolCall: { toolName: string; args: unknown }) => void
  chatEndpoint: string
  ttsEndpoint: string
  sttEndpoint?: string
  silenceThreshold?: number
  voiceType?: string
  autoPlay?: "on" | "off" | null
}

export const UserAssistant = ({
  initialSystemMessage,
  renderMessageActions,
  renderExtraContent,
  renderMessageContent,
  onMessageResponse,
  onMessageFinish,
  onMessageError,
  onToolCall,
  chatEndpoint,
  sttEndpoint,
  silenceThreshold = 2000,
}: UserAssistantProps) => {
  // Local state for input
  const [inputValue, setInputValue] = useState("")

  // Chat functionality using AI SDK
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: chatEndpoint,
    initialMessages: initialSystemMessage
      ? [
          {
            id: "system-1",
            role: "system",
            content: initialSystemMessage,
          },
        ]
      : [],
    onResponse: (response) => {
      console.log("Chat response:", response)
      onMessageResponse?.(response)
    },
    onFinish: (message) => {
      console.log("Chat finished, final message:", message)
      onMessageFinish?.(message as AIMessageFinishResponse)
    },
    onError: (error) => {
      console.error("Chat error:", error)
      onMessageError?.(error)
    },
    onToolCall: ({ toolCall }) => {
      console.log("Tool call:", toolCall)
      onToolCall?.(toolCall)
    },
  })

  console.log("Messages:", messages)

  // Form submission handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) {
      console.log("No input value, skipping submission")
      return
    }

    console.log("Sending message:", inputValue)
    
    // Create a custom event to mimic the handleInputChange
    const inputEvent = {
      target: { value: inputValue }
    } as React.ChangeEvent<HTMLInputElement>;
    
    // First update the input value in the AI SDK
    handleInputChange(inputEvent);
    
    // Then submit the form
    handleSubmit(e)
    setInputValue("")
  }

  // Create adapter between AI messages and the generic ChatMessageData
  const adaptMessagesToGeneric = () => {
    return messages
      .filter((msg) => !isSystemRole(msg.role))
      .map(
        (msg) =>
          ({
            ...msg,
            contentType: msg.role === "assistant" ? "markdown" : "text",
            metadata: { parts: msg.parts },
            role: msg.role,
          } as ChatMessageData)
      )
  }

  // Create the message actions renderer
  const messageActionsRenderer = (message: any) => {
    if (renderMessageActions) {
      return renderMessageActions(message)
    }
  }

  return (
    <ChatPanel
      messages={adaptMessagesToGeneric()}
      inputValue={inputValue}
      onInputChange={(value) => {
        // Update local state
        setInputValue(value);
        
        // Also update AI SDK's input state
        const event = { target: { value } } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(event);
      }}
      onInputValueChange={(e) => {
        // This is called directly from the input element's onChange
        handleInputChange(e as any);
      }}
      onSubmit={handleFormSubmit}
      isSubmitting={status === "streaming"}
      error={status === "error" ? "An error occurred. Please try again." : null}
      renderMessageActions={messageActionsRenderer as any}
      renderExtraContent={renderExtraContent as any}
      renderMessageContent={renderMessageContent as any}
      sttEndpoint={sttEndpoint}
      silenceThreshold={silenceThreshold}
    />
  )
}
