"use client"

import {
  ToolCallbacks,
  CreateItineraryResult,
  ToolSuccessCallbackProps,
  ToolErrorCallbackProps,
} from "./types"

export const createTravelItineraryCallbacks: ToolCallbacks = {
  onSuccess: async ({
    invocation,
    result,
    store,
  }: ToolSuccessCallbackProps) => {
    console.log("createTravelItinerary success:", result)
    const itineraryResult = result as CreateItineraryResult
    if (!itineraryResult.itinerary) {
      console.error("No itinerary returned, skipping update")
      return
    }

    store.updateItinerary(itineraryResult.itinerary)
  },

  onError: async ({ invocation, error, store }: ToolErrorCallbackProps) => {
    console.error("createTravelItinerary error:", error)
    // Reset state or handle error as needed
  },
}
