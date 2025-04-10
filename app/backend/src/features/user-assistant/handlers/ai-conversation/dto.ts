import { ApiProperty } from "@nestjs/swagger"
import { SpeechCreateParams } from "openai/resources/audio/speech"

export class UserAssistantAIChatMessage {
  @ApiProperty({
    description: "The role of the message sender",
    example: "user",
    enum: ["user", "assistant", "system", "function"],
  })
  role: string

  @ApiProperty({
    description: "The content of the message",
    example: "Hello, how can I help you today?",
  })
  content: string
}

export class UserAssistantAIChatRequest {
  @ApiProperty({
    description: "Array of previous messages in the conversation",
    type: [UserAssistantAIChatMessage],
  })
  messages: UserAssistantAIChatMessage[]

  @ApiProperty({
    description: "Unique identifier for the conversation",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  conversationId?: string
}

export class UserAssistantTextToSpeechRequest {
  @ApiProperty({
    description: "The text to convert to speech",
    example: "Hello, this is text that will be converted to speech.",
  })
  text: string

  @ApiProperty({
    description: "The voice to use for the speech",
    example: "alloy",
    required: false,
    default: "alloy",
  })
  voice?: string

  @ApiProperty({
    description: "The speed of the speech",
    example: 1.0,
    required: false,
    default: 1.0,
  })
  speed?: number

  @ApiProperty({
    description: "Additional instructions for the speech",
    example: "Speak in a friendly and engaging manner",
    required: false,
  })
  instructions?: string

  @ApiProperty({
    description: "The response format of the audio",
    example: "mp3",
    required: false,
    default: "mp3",
  })
  responseFormat?: SpeechCreateParams["response_format"]
}

export class UserAssistantSpeechToTextRequest {
  @ApiProperty({
    description: "The audio file to transcribe (Base64 encoded)",
    type: "string",
    format: "binary",
  })
  audioData: string

  @ApiProperty({
    description: "The language of the audio (optional, auto-detected if not provided)",
    example: "en",
    required: false,
  })
  language?: string

  @ApiProperty({
    description: "The model to use for speech recognition",
    example: "whisper-1",
    required: false,
    default: "whisper-1",
  })
  model?: string
}

export class UserAssistantSpeechToTextResponse {
  @ApiProperty({
    description: "The transcribed text from the audio",
    example: "Hello, this is the transcribed text from the audio file.",
  })
  text: string

  @ApiProperty({
    description: "The detected language of the audio (ISO code)",
    example: "en",
    required: false,
  })
  language?: string
}
