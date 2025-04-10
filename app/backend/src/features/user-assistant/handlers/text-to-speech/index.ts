import { Injectable } from "@nestjs/common"
import { AiOpenaiSpeechService } from "@/integrations/ai/openai/services/speech"
import { UserAssistantTextToSpeechRequest } from "../ai-conversation/dto"
import { Log } from "@punks/backend-core"

@Injectable()
export class UserAssistantTextToSpeechHandler {
  private readonly logger = Log.getLogger(UserAssistantTextToSpeechHandler.name)

  constructor(private readonly aiOpenaiSpeechService: AiOpenaiSpeechService) {}

  async execute(request: UserAssistantTextToSpeechRequest) {
    try {
      return await this.aiOpenaiSpeechService.convertTextToSpeech({
        model: "tts-1",
        input: request.text,
        voice: request.voice || "alloy",
        response_format: request.responseFormat || ("mp3" as const),
        speed: request.speed || 1.0,
        instructions: request.instructions,
      })
    } catch (error) {
      this.logger.exception("Error in text-to-speech handler", error as any)
      throw error
    }
  }
}
