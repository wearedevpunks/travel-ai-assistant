// Base message type
export interface AIMessageType {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  parts?: AIMessagePart[]
}

// Message part types
export type AIMessagePart = StepStartPart | ToolInvocationPart

export type StepStartPart = {
  type: "step-start"
}

export type ToolInvocationPart = {
  type: "tool-invocation"
  toolInvocation: {
    toolName: string
    toolCallId: string
    step: number
    state: "loading" | "result" | "error"
    args: Record<string, any>
    result: any
  }
}
