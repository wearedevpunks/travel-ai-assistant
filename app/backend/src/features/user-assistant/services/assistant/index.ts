import { Injectable } from "@nestjs/common"
import { UserAssistantAIConversationHandler } from "../../handlers/ai-conversation"
import { 
  UserAssistantAIChatRequest, 
  UserAssistantTextToSpeechRequest,
  UserAssistantSpeechToTextRequest,
  UserAssistantSpeechToTextResponse
} from "../../handlers/ai-conversation/dto"
import { UserAssistantAIChatAssistantDefinition } from "../../handlers/ai-conversation/types"
import { UserAssistantTextToSpeechHandler } from "../../handlers/text-to-speech"
import { UserAssistantSpeechToTextHandler } from "../../handlers/speech-to-text"

@Injectable()
export class UserAssistantService {
  constructor(
    private readonly userAssistantAIConversationHandler: UserAssistantAIConversationHandler,
    private readonly userAssistantTextToSpeechHandler: UserAssistantTextToSpeechHandler,
    private readonly userAssistantSpeechToTextHandler: UserAssistantSpeechToTextHandler
  ) {}

  async createStreamedCompletion(input: {
    definition: UserAssistantAIChatAssistantDefinition
    userRequest: UserAssistantAIChatRequest
  }) {
    return this.userAssistantAIConversationHandler.execute(input)
  }

  async createTextToSpeech(request: UserAssistantTextToSpeechRequest) {
    return this.userAssistantTextToSpeechHandler.execute(request)
  }

  async createSpeechToText(request: UserAssistantSpeechToTextRequest): Promise<UserAssistantSpeechToTextResponse> {
    return this.userAssistantSpeechToTextHandler.execute(request)
  }
}