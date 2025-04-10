"use client"

import { useEffect } from "react"
import { ToolOutputProps } from "."
import { useTravelPlannerStore } from "../../../store"
import { TravelItinerary } from "@/api/backend"

type MoveDayResult = {
  itineraryId: string
  itinerary?: TravelItinerary
  movedFromDay: number
  movedToDay: number
  success: boolean
  message: string
}

export const MoveDayInItineraryOutput = ({
  toolInvocation,
}: ToolOutputProps) => {
  const { loadItinerary, updateItinerary } = useTravelPlannerStore()

  // Always call useEffect at the component top level
  useEffect(() => {
    if (
      toolInvocation.state === "result" &&
      toolInvocation.result &&
      typeof toolInvocation.result === "object"
    ) {
      const result = toolInvocation.result as MoveDayResult

      // If we have the full itinerary in the result, update it directly
      if (result.itinerary) {
        updateItinerary(result.itinerary)
      } else if (result.itineraryId) {
        // Otherwise, load it from the API
        loadItinerary()
      }
    }
  }, [
    toolInvocation.state,
    toolInvocation.result,
    loadItinerary,
    updateItinerary,
  ])

  // Handle loading state
  if (toolInvocation.state === "call") {
    return (
      <div className="bg-gray-200 p-3 rounded-md my-2">
        <div className="font-medium text-gray-700">
          Moving day in itinerary...
        </div>
        <div className="animate-pulse h-4 bg-gray-300 rounded mt-2"></div>
      </div>
    )
  }

  // Handle error state
  if (toolInvocation.state === "error") {
    return (
      <div className="bg-red-100 p-3 rounded-md my-2">
        <div className="font-medium text-red-700">
          Failed to move day in itinerary
        </div>
        <div className="text-sm mt-1 text-red-600">
          {typeof toolInvocation.error === "string"
            ? toolInvocation.error
            : "Unable to reorder days in your itinerary. Please try again."}
        </div>
      </div>
    )
  }

  // Cast result to move day data
  const result = toolInvocation.result as MoveDayResult

  if (!result || !result.success) {
    return (
      <div className="bg-yellow-50 p-3 rounded-md my-2">
        <div className="font-medium text-yellow-700">
          Day was not moved in itinerary
        </div>
        <div className="text-sm mt-1">
          {result?.message ||
            "We couldn't move the day in your itinerary. The itinerary or day may not exist."}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-green-50 p-4 rounded-md my-2 border border-green-200">
      <div className="flex items-center">
        <div className="text-2xl mr-3">📅</div>
        <div className="flex-1">
          <div className="font-medium text-green-700">
            Itinerary Day Moved Successfully
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {result.message ||
              `Day ${result.movedFromDay} moved to position ${result.movedToDay}`}
          </div>
          <div className="mt-2 flex items-center text-xs">
            <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded mr-2">
              From: Day {result.movedFromDay}
            </div>
            <div className="flex items-center mx-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>
            <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded ml-2">
              To: Day {result.movedToDay}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
