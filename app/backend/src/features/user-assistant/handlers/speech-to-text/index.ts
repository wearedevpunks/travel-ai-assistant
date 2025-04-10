import { Injectable } from "@nestjs/common"
import {
  UserAssistantSpeechToTextRequest,
  UserAssistantSpeechToTextResponse,
} from "../ai-conversation/dto"
import { Log } from "@punks/backend-core"
import { AiOpenaiSpeechService } from "@/integrations/ai/openai/services/speech"

@Injectable()
export class UserAssistantSpeechToTextHandler {
  private readonly logger = Log.getLogger(UserAssistantSpeechToTextHandler.name)

  constructor(private readonly aiOpenaiSpeechService: AiOpenaiSpeechService) {}

  async execute(
    request: UserAssistantSpeechToTextRequest
  ): Promise<UserAssistantSpeechToTextResponse> {
    try {
      this.logger.info("Processing speech-to-text request")

      // Convert base64 string to File object
      const base64Data = request.audioData.split(",")[1] || request.audioData
      const binaryData = Buffer.from(base64Data, "base64")
      const blob = new Blob([binaryData], { type: "audio/webm" })

      // Create a File object from the Blob
      const file = new File([blob], "speech.webm", { type: "audio/webm" })

      // Send to OpenAI for transcription
      const result = await this.aiOpenaiSpeechService.convertSpeechToText({
        model: request.model || "whisper-1",
        language: request.language,
        input: file,
      })

      // Create a properly typed response
      const response: UserAssistantSpeechToTextResponse = {
        text: result.text,
        language: request.language,
      }

      return response
    } catch (error) {
      this.logger.exception("Failed to process speech-to-text", error)
      throw error
    }
  }
}
