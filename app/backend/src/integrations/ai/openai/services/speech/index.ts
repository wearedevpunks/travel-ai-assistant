import { Injectable } from "@nestjs/common"
import { AiOpenaiTextToSpeechServiceStreamedSpeech } from "../../handlers/convert-text-to-speech/types"
import { AiOpenaiSpeechToTextServiceStreamedSpeech } from "../../handlers/convert-speech-to-text/types"
import { OpenaiTextToSpeechHandler } from "../../handlers/convert-text-to-speech"
import { OpenaiSpeechToTextHandler } from "../../handlers/convert-speech-to-text"

@Injectable()
export class AiOpenaiSpeechService {
  constructor(
    private readonly convertTextToSpeechHandler: OpenaiTextToSpeechHandler,
    private readonly convertSpeechToTextHandler: OpenaiSpeechToTextHandler
  ) {}

  async convertTextToSpeech(input: AiOpenaiTextToSpeechServiceStreamedSpeech) {
    return this.convertTextToSpeechHandler.convertTextToSpeech(input)
  }

  async convertSpeechToText(input: AiOpenaiSpeechToTextServiceStreamedSpeech) {
    return this.convertSpeechToTextHandler.convertSpeechToText(input)
  }
}
