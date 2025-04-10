import { create } from "zustand"
import { TravelItinerary, travelPlannerItineraryGet } from "@/api/backend"

// Define the store state interface
interface TravelPlannerState {
  // State
  currentItineraryId: string | null
  itinerary: TravelItinerary | null
  isLoading: boolean
  error: string | null

  // Actions
  setItineraryId: (id: string | null) => void
  loadItinerary: () => Promise<TravelPlannerState | void>
  clearItinerary: () => void
  updateItinerary: (itineraryData: TravelItinerary) => void
}

export const useTravelPlannerStore = create<TravelPlannerState>((set, get) => ({
  // Initial state
  currentItineraryId: null,
  itinerary: null,
  isLoading: false,
  error: null,

  // Set the current itinerary ID
  setItineraryId: (id: string | null) => {
    console.log("Setting itinerary ID in store:", id)
    set({ currentItineraryId: id })

    if (!id) {
      console.log("Clearing itinerary data (null ID)")
      set({ itinerary: null })
    }
  },

  // Load the itinerary data from the API
  loadItinerary: async () => {
    const { currentItineraryId } = get()
    console.log(
      "loadItinerary called with currentItineraryId:",
      currentItineraryId
    )

    // Exit if no ID is set
    if (!currentItineraryId) {
      console.log("No itinerary ID set, clearing data")
      set({ itinerary: null })
      return
    }

    // Set loading state
    console.log("Setting loading state")
    set({ isLoading: true, error: null })

    try {
      // Load the itinerary data
      console.log("Fetching itinerary with ID:", currentItineraryId)
      const { data: itinerary } = await travelPlannerItineraryGet({
        path: {
          id: currentItineraryId,
        },
      })
      console.log("Itinerary data received:", itinerary)
      set({ itinerary })
    } catch (error) {
      console.error("Failed to load itinerary:", error)
      set({
        error: "Failed to load itinerary. Please try again.",
        itinerary: null,
      })
    } finally {
      console.log("Finished loading, setting isLoading: false")
      set({ isLoading: false })
    }

    // Return the current state for debugging
    return get()
  },

  // Clear the current itinerary
  clearItinerary: () => {
    set({
      currentItineraryId: null,
      itinerary: null,
      error: null,
    })
  },

  // Directly update itinerary data from tool response
  updateItinerary: (itineraryData: TravelItinerary) => {
    if (!itineraryData) return

    set({
      itinerary: itineraryData,
      isLoading: false,
      error: null,
    })
  },
}))

export type TravelPlannerStore = ReturnType<typeof useTravelPlannerStore>
