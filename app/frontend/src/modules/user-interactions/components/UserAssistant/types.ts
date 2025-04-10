// Base message type
export interface AIMessageType {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  parts?: AIMessagePart[]
  toolInvocations?: ToolInvocation[]
}

// Message part types
export type AIMessagePart = StepStartPart | ToolInvocationPart

export type StepStartPart = {
  type: "step-start"
}

export type ToolInvocationPart = {
  type: "tool-invocation"
  toolInvocation: ToolInvocation
}

// Interface for tool invocation in the message response
export type ToolInvocation = {
  state: "call" | "result" | "error"
  step: number
  toolCallId: string
  toolName: string
  args: Record<string, any>
  result?: any
  error?: any
}

export type AIMessageFinishResponse = {
  id: string
  createdAt: Date
  role: string
  content: string
  parts: any[]
  toolInvocations?: ToolInvocation[]
}
