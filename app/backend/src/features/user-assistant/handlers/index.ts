import { UserAssistantAIConversationHandler } from "./ai-conversation"
import { UserAssistantSpeechToTextHandler } from "./speech-to-text"
import { UserAssistantTextToSpeechHandler } from "./text-to-speech"

export const UserAssistantHandlers = [
  UserAssistantAIConversationHandler,
  UserAssistantTextToSpeechHandler,
  UserAssistantSpeechToTextHandler,
]
