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
      model: {
        model: "gpt-4o-mini",
        provider: "openai",
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
