import { AiVercelCompletionsService } from "@/integrations/ai/vercel/services/completions"
import { Injectable } from "@nestjs/common"
import { UserAssistantAIChatRequest } from "./dto"
import { UserAssistantAIChatAssistantDefinition } from "./types"
import { Settings } from "@/settings"

@Injectable()
export class UserAssistantAIConversationHandler {
  constructor(private readonly vercelAiService: AiVercelCompletionsService) {}

  async execute({
    definition,
    userRequest,
  }: {
    definition: UserAssistantAIChatAssistantDefinition
    userRequest: UserAssistantAIChatRequest
  }) {
    return await this.vercelAiService.createStreamedCompletion({
      model: definition.model ?? {
        model: Settings.getUserAssistantDefaultModel()!,
        provider: Settings.getUserAssistantDefaultModelProvider()!,
      },
      prompt: {
        system: definition.systemPrompt,
        messages: userRequest.messages as any,
        tools: {
          ...((definition?.additionalTools ?? {}) as any),
        },
      },
    })
  }
}
