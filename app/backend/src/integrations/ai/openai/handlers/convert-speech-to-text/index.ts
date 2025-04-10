import { Injectable } from "@nestjs/common"
import { AiOpenaiSpeechToTextServiceStreamedSpeech } from "./types"
import { Log } from "@punks/backend-core"
import OpenAI from "openai"
import { Settings } from "@/settings"

@Injectable()
export class OpenaiSpeechToTextHandler {
  private readonly logger = Log.getLogger(OpenaiSpeechToTextHandler.name)

  async convertSpeechToText(input: AiOpenaiSpeechToTextServiceStreamedSpeech) {
    const openai = new OpenAI({
      apiKey: Settings.getOpenAiApiKey(),
    })

    try {
      const response = await openai.audio.transcriptions.create({
        model: input.model || "whisper-1",
        file: input.input,
        language: input.language,
      })

      return response
    } catch (error) {
      this.logger.exception("OpenAI error in speech-to-text", error as any)
      throw error
    }
  }
}
