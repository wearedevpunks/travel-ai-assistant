"use client"

import { TravelItinerary } from "@/api/backend"
import {
  ToolCallbacks,
  ToolSuccessCallbackProps,
  ToolErrorCallbackProps,
} from "./types"

// Define the specific result interface for modify itinerary tools
interface ModifyItineraryResult {
  itineraryId: string
  itinerary?: TravelItinerary
}

export const modifyItineraryCallbacks: ToolCallbacks = {
  onSuccess: async ({
    invocation,
    result,
    store,
  }: ToolSuccessCallbackProps) => {
    console.log(`${invocation.toolName} success:`, result)
    
    // Cast to our expected result type
    const modifyResult = result as ModifyItineraryResult
    
    // Update the store with the new itinerary if available
    if (modifyResult.itinerary) {
      console.log("Updating itinerary from tool result:", modifyResult.itinerary)
      store.updateItinerary(modifyResult.itinerary)
    } else if (modifyResult.itineraryId) {
      // Otherwise reload from the API
      console.log("Reloading itinerary with ID:", modifyResult.itineraryId)
      store.setItineraryId(modifyResult.itineraryId)
      await store.loadItinerary()
    }
  },

  onError: async ({ invocation, error, store }: ToolErrorCallbackProps) => {
    console.error(`${invocation.toolName} error:`, error)
    // Optionally refresh the itinerary to ensure UI is in sync
    await store.loadItinerary()
  },
}