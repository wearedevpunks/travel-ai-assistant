import { FirstArgument } from "@/types"
import { streamText } from "ai"
import { AiVercelCompletionsModel } from "../../providers/completion-models/types"

export type AiVercelCompletionsServiceStreamedCompletion = {
  model: AiVercelCompletionsModel
  prompt: Omit<
    FirstArgument<typeof streamText>,
    "model" | "onError" | "onFinish" | "onStepFinish"
  >
  callbacks?: {
    onError?: (error: any) => void
    onFinish?: (finalResponse: any) => void
    onStepFinish?: (stepResponse: any) => void
  }
}
