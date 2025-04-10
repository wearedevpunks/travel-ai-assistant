import { Injectable } from "@nestjs/common"
import { AiOpenaiTextToSpeechServiceStreamedSpeech } from "./types"
import { Log } from "@punks/backend-core"
import { Readable } from "stream"
import OpenAI from "openai"
import { Settings } from "../../../../../settings"

@Injectable()
export class OpenaiTextToSpeechHandler {
  private readonly logger = Log.getLogger(OpenaiTextToSpeechHandler.name)

  async convertTextToSpeech(input: AiOpenaiTextToSpeechServiceStreamedSpeech) {
    try {
      const openai = new OpenAI({
        apiKey: Settings.getOpenAiApiKey(),
      })

      const response = await openai.audio.speech.create({
        model: input.model || "tts-1,",
        input: input.input,
        voice: input.voice || "alloy",
        response_format: input.response_format || "mp3",
        speed: input.speed || 1.0,
        instructions: input.instructions,
      })

      // Convert the ArrayBuffer to a Buffer before creating a Readable stream
      const buffer = Buffer.from(await response.arrayBuffer())
      const stream = Readable.from(buffer)

      return { stream, contentType: `audio/${input.response_format || "mp3"}` }
    } catch (error) {
      this.logger.exception("OpenAI error in text-to-speech", error as any)
      throw error
    }
  }
}
