"use client"

import {
  TextToSpeech,
  UserAssistant,
} from "@/modules/user-interactions/components/UserAssistant"
import { ToolOutput } from "./ToolOutputs"
import { buildBackendUrl } from "@/settings"
import { useTravelPlannerStore } from "../../store"
import { toolCallbacks } from "./ToolCallbacks"
import {
  AIMessageFinishResponse,
  AIMessageType,
} from "@/modules/user-interactions/components/UserAssistant/types"

// Render message actions (like TextToSpeech for assistant messages)
const renderMessageActions = (message: AIMessageType) => {
  // Skip text-to-speech for messages with skipTTS metadata flag
  if (message.role === "assistant" && message.content && !message.metadata?.skipTTS) {
    return (
      <TextToSpeech
        text={message.content}
        endpoint={buildBackendUrl("/v1/travel-planner/tts")}
        autoPlay={true}
        voice="alloy"
      />
    )
  }
  return null
}

// Render extra content (previously tool outputs)
const renderExtraContent = (message: AIMessageType) => {
  if (
    message.parts &&
    message.parts.some((part) => part.type === "tool-invocation")
  ) {
    const toolParts = message.parts.filter(
      (part) => part.type === "tool-invocation"
    )

    // If there are tool parts, render them
    if (toolParts.length > 0) {
      return (
        <>
          {toolParts.map((part, idx) => (
            <div key={`tool-${idx}`}>
              <ToolOutput toolInvocation={part.toolInvocation} />
            </div>
          ))}
        </>
      )
    }
  }

  return null
}

export const TravelPlannerAssistant = () => {
  const store = useTravelPlannerStore()

  // Response handler
  const handleResponse = (response: any) => {
    console.log("Travel planner response:", response)
    // The streaming response might not contain completed tool calls yet
    // We'll process the finalized tool invocations in the handleFinish callback
  }

  const handleFinish = async (message: AIMessageFinishResponse) => {
    console.log("Travel planner message finished:", message)

    // Ensure the complete message is spoken when finished
    if (message.content) {
      console.log("Message finished, will trigger text-to-speech")
    }

    // Process completed tool invocations from the final message
    if (message.toolInvocations && message.toolInvocations.length > 0) {
      console.log(
        "Tool invocations in finish:",
        message.toolInvocations.map((t) => ({
          toolName: t.toolName,
          state: t.state,
          args: t.args,
        }))
      )

      // Debug the UI components mapping
      console.log("Available tool callbacks:", Object.keys(toolCallbacks))

      for (const invocation of message.toolInvocations) {
        // Special case handling for moveDayInItinerary
        if (
          invocation.state === "result" &&
          invocation.toolName === "moveDayInItinerary"
        ) {
          console.log("Found moveDayInItinerary invocation:", invocation)
        }

        // Dynamic handler matching using toolCallbacks dictionary
        if (
          invocation.state === "result" &&
          toolCallbacks[invocation.toolName]
        ) {
          try {
            // Get the handler for this tool
            const handler = toolCallbacks[invocation.toolName]
            console.log(`Executing success handler for ${invocation.toolName}`)

            // Call the success handler with store and result
            await handler.onSuccess({
              invocation,
              result: invocation.result,
              store,
            })
          } catch (error) {
            console.error(
              `Error executing handler for ${invocation.toolName}:`,
              error
            )
          }
        } else if (
          invocation.state === "error" &&
          toolCallbacks[invocation.toolName]?.onError
        ) {
          try {
            // Call the error handler if it exists
            console.log(`Executing error handler for ${invocation.toolName}`)
            await toolCallbacks[invocation.toolName].onError?.({
              invocation,
              error: invocation.error,
              store,
            })
          } catch (error) {
            console.error(
              `Error executing error handler for ${invocation.toolName}:`,
              error
            )
          }
        } else {
          console.warn(
            `No handler found for tool ${invocation.toolName} in state ${invocation.state}`
          )
        }
      }
    }
  }

  const handleError = (error: any) => {
    console.error("Travel planner error:", error)
  }

  return (
    <UserAssistant
      initialUserMessage="Hi, I'm a travel planner assistant, I can help you plan your trip to a destination. You can ask me to show you the available destinations, create a trip, add an activity to a day, or move a day in the itinerary."
      chatEndpoint={buildBackendUrl("/v1/travel-planner/chat")}
      ttsEndpoint={buildBackendUrl("/v1/travel-planner/tts")}
      sttEndpoint={buildBackendUrl("/v1/travel-planner/stt")}
      silenceThreshold={2000} // Auto-submit after 2 seconds of silence
      renderMessageActions={renderMessageActions}
      renderExtraContent={renderExtraContent}
      onMessageResponse={handleResponse}
      onMessageFinish={handleFinish}
      onMessageError={handleError}
      // Removed onToolCall as we now handle tool calls in onMessageFinish
      // Set voice type to Alloy and keep autoplay enabled
      voiceType="alloy"
      autoPlay="on"
    />
  )
}
