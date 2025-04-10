import { SpeechCreateParams } from "openai/resources/audio/speech"

export type AiOpenaiTextToSpeechServiceStreamedSpeech = {
  model: string
  input: string
  voice?: string
  response_format?: SpeechCreateParams["response_format"]
  speed?: number
  instructions?: string
}
