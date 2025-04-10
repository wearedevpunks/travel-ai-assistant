"use client"

import { useEffect } from "react"
import {
  BaseToolOutput,
  ToolOutputProps,
  ToolComponentRegistry,
} from "@/modules/user-interactions/components/UserAssistant/BaseToolOutput"
import { TextToSpeech } from "@/modules/user-interactions/components/UserAssistant/TextToSpeech"
import { buildBackendUrl } from "@/settings"

import { TravelDestinationsOutput } from "./TravelDestinationsOutput"
import { TravelItineraryOutput } from "./TravelItineraryOutput"
import { AddDayToItineraryOutput } from "./AddDayToItineraryOutput"
import { RemoveDayFromItineraryOutput } from "./RemoveDayFromItineraryOutput"
import { MoveDayInItineraryOutput } from "./MoveDayInItineraryOutput"
import { AddItemToItineraryOutput } from "./AddItemToItineraryOutput"
import { WhatsAppShareOutput } from "./WhatsAppShareOutput"
import { GenericToolOutput } from "./GenericToolOutput"

// Re-export the types so consumers don't need to import from base
export type { ToolOutputProps }

// Define the travel planner-specific tool components
const travelToolComponents: ToolComponentRegistry = {
  getTravelDestinations: TravelDestinationsOutput,
  createTravelItinerary: TravelItineraryOutput,
  addDayToItinerary: AddDayToItineraryOutput,
  removeDayFromItinerary: RemoveDayFromItineraryOutput,
  moveDayInItinerary: MoveDayInItineraryOutput,
  addItemToItinerary: AddItemToItineraryOutput,
  sendItineraryViaWhatsApp: WhatsAppShareOutput,
  // Add more tool mappings as needed
}

// Component to speak tool success messages
const AutoSpeakToolMessage = ({ message }: { message?: string }) => {
  useEffect(() => {
    // Only attempt to speak if there's a message
    if (!message) {
      console.log("No success message to speak")
      return
    }

    console.log("Auto-speaking tool success message:", message)
  }, [message])

  // This is just for the speech functionality, it doesn't render anything
  // We always want to auto-play success messages for tool outputs
  return message ? (
    <div style={{ display: "none", position: "absolute" }} aria-hidden="true">
      <TextToSpeech
        text={message}
        endpoint={buildBackendUrl("/v1/travel-planner/tts")}
        autoPlay={true}
        voice="alloy"
      />
    </div>
  ) : null
}

export const ToolOutput = ({ toolInvocation }: ToolOutputProps) => {
  // Get success message from result if available and in success state
  const successMessage =
    toolInvocation.state === "result" &&
    toolInvocation.result?.messages?.success
      ? toolInvocation.result.messages.success
      : undefined

  return (
    <>
      {/* Auto-speak the success message if available */}
      <AutoSpeakToolMessage message={successMessage} />

      {/* Render the tool output component */}
      <BaseToolOutput
        toolInvocation={toolInvocation}
        toolComponents={travelToolComponents}
        GenericComponent={GenericToolOutput}
      />
    </>
  )
}
