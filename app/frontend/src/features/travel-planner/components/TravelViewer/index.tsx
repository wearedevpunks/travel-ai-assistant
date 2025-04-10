"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Title } from "@/components/atoms/Title"
import { useTravelPlannerStore } from "../../store"

// Import UI components
import { LoadingState } from "./LoadingState"
import { ErrorState } from "./ErrorState"
import { EmptyState } from "./EmptyState"
import { DestinationHeader } from "./DestinationHeader"
import { ItineraryDaysList } from "./ItineraryDaysList"

export const TravelViewer = () => {
  // Access store state and actions
  const { itinerary, isLoading, error, loadItinerary, currentItineraryId } =
    useTravelPlannerStore()

  console.log("TravelViewer rendering with state:", {
    hasItinerary: !!itinerary,
    hasDestination: !!itinerary?.destination,
    isLoading,
    hasError: !!error,
    currentItineraryId,
  })

  // Load itinerary data when component mounts or itineraryId changes
  useEffect(() => {
    const loadData = async () => {
      console.log("TravelViewer useEffect triggered, loading itinerary")
      try {
        const state = await loadItinerary()
        console.log(
          "TravelViewer itinerary loaded, current state:",
          state || useTravelPlannerStore.getState()
        )
      } catch (error) {
        console.error("Failed to load itinerary in TravelViewer:", error)
      }
    }

    loadData()
  }, [loadItinerary, currentItineraryId])

  // Show different states based on the application state
  if (isLoading) {
    console.log("TravelViewer showing loading state")
    return <LoadingState />
  }

  if (error) {
    console.log("TravelViewer showing error state:", error)
    return <ErrorState error={error} />
  }

  if (!itinerary) {
    console.log("TravelViewer showing empty state (no itinerary)")
    return <EmptyState />
  }

  // Render the itinerary view when data is available
  console.log("TravelViewer rendering with itinerary:", itinerary)
  return (
    <Card id="travel-itinerary-viewer" className="h-full overflow-hidden !py-0">
      <div className="h-full flex flex-col">
        {/* Sidebar header with fixed position */}
        <div className="sticky top-0 bg-card z-10">
          {/* Destination information comes directly from the itinerary */}
          <DestinationHeader destination={itinerary.destination} />
          <div className="px-4">
            <Separator className="mt-3" />
          </div>
        </div>

        {/* Scrollable itinerary section */}
        <div className="flex-1 overflow-y-auto mt-4 px-4 pb-6">
          <Title variant="h3" className="text-lg mb-3">
            Your Itinerary
          </Title>
          <ItineraryDaysList days={itinerary.days} />
        </div>
      </div>
    </Card>
  )
}
