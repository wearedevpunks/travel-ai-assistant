import { Injectable } from "@nestjs/common"
import { AiVercelCompletionsModel } from "./types"
import { createOpenAI } from "@ai-sdk/openai"
import { Settings } from "@/settings"

@Injectable()
export class AiVercelCompletionModelsProvider {
  resolve(model: AiVercelCompletionsModel) {
    switch (model.provider) {
      case "openai":
        return this.resolveOpenAiModel(model.model)
      default:
        throw new Error(`Unsupported provider: ${model.provider}`)
    }
  }

  private resolveOpenAiModel(model: string) {
    const openai = createOpenAI({
      compatibility: "strict",
      apiKey: Settings.getOpenAiApiKey(),
    })

    return openai(model)
  }
}
