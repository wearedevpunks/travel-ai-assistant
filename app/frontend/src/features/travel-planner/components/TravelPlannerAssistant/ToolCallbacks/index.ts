"use client"

import { createTravelItineraryCallbacks } from "./createTravelItinerary"
import { modifyItineraryCallbacks } from "./modifyItinerary"
import { shareItineraryCallbacks } from "./shareItinerary"
import { ToolCallbacks } from "./types"

// Export the callback map with the new structure
export const toolCallbacks: Record<string, ToolCallbacks> = {
  // Itinerary creation
  createTravelItinerary: createTravelItineraryCallbacks,
  
  // Itinerary modification tools
  addItemToItinerary: modifyItineraryCallbacks,
  addDayToItinerary: modifyItineraryCallbacks,
  removeDayFromItinerary: modifyItineraryCallbacks,
  moveDayInItinerary: modifyItineraryCallbacks,
  
  // Itinerary sharing tools
  sendItineraryViaWhatsApp: shareItineraryCallbacks,
  
  // Travel destinations tool
  getTravelDestinations: createTravelItineraryCallbacks,
}

// Export the types
export * from "./types"
