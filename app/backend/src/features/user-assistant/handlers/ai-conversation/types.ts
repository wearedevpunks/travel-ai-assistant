import { AiVercelCompletionsProvider } from "@/integrations/ai/vercel/providers/completion-models/types"

export type UserAssistantAIChatOptionsModel = {
  provider: AiVercelCompletionsProvider
  model: string
}

export type UserAssistantAIChatAssistantDefinition = {
  model?: UserAssistantAIChatOptionsModel
  systemPrompt?: string
  additionalTools?: any // todo: fix typing //Record<string, ReturnType<typeof tool>[]>
}
