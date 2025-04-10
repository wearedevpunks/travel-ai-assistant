"use client"

import { useEffect } from "react"
import { ToolOutputProps } from "."
import { useTravelPlannerStore } from "../../../store"
import { TravelItinerary } from "@/api/backend"

type AddItemResult = {
  itineraryId: string
  itinerary?: TravelItinerary
  addedItem: string
  hours?: number
  dayNumber: number
}

export const AddItemToItineraryOutput = ({
  toolInvocation,
}: ToolOutputProps) => {
  const { loadItinerary, updateItinerary } = useTravelPlannerStore()

  // Always call useEffect at the component top level
  // but only perform actions if conditions are met
  useEffect(() => {
    if (
      toolInvocation.state === "result" &&
      toolInvocation.result &&
      typeof toolInvocation.result === "object"
    ) {
      const result = toolInvocation.result as AddItemResult

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
      <div className="bg-white border border-gray-200 rounded-lg p-4 my-2">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-gray-100 p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600 animate-spin"
            >
              <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.7 2.8" />
              <path d="M21 12h-4" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-base font-medium text-gray-900">
              Adding item to your itinerary...
            </h3>
            <div className="mt-1 animate-pulse h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // Handle error state
  if (toolInvocation.state === "error") {
    return (
      <div className="bg-white border border-red-200 rounded-lg p-4 my-2">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-red-100 p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-600"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-base font-medium text-gray-900">
              Failed to add item to itinerary
            </h3>
            <div className="mt-1 text-sm text-gray-600">
              {typeof toolInvocation.error === "string"
                ? toolInvocation.error
                : "Unable to add an item to your itinerary. Please try again."}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Cast result to add item data
  const result = toolInvocation.result as AddItemResult

  if (!result || !result.itineraryId) {
    return (
      <div className="bg-white border border-yellow-200 rounded-lg p-4 my-2">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-yellow-100 p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yellow-600"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-base font-medium text-gray-900">
              Item was not added to itinerary
            </h3>
            <div className="mt-1 text-sm text-gray-600">
              {
                "We couldn't add the item to your itinerary. The itinerary or specified day may not exist."
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Get item type icon based on tool parameters
  const getItemIcon = () => {
    if (!toolInvocation.result) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
    }

    const item = (toolInvocation.result.item as string) || ""
    const itemText = item.toLowerCase()

    if (
      itemText.includes("hotel") ||
      itemText.includes("stay") ||
      itemText.includes("lodging")
    ) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
        >
          <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
          <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
          <path d="M12 4v6" />
          <path d="M2 18h20" />
        </svg>
      )
    } else if (
      itemText.includes("restaurant") ||
      itemText.includes("food") ||
      itemText.includes("dining")
    ) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
        >
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      )
    } else if (itemText.includes("flight") || itemText.includes("plane")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
        >
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
      )
    } else if (itemText.includes("train")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M4 11h16" />
          <path d="M12 4v16" />
        </svg>
      )
    } else if (
      itemText.includes("attraction") ||
      itemText.includes("visit") ||
      itemText.includes("sightseeing")
    ) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
        >
          <path d="M2 20V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" />
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <path d="M12 14v4" />
          <path d="M8 14h8" />
        </svg>
      )
    } else if (itemText.includes("activity") || itemText.includes("tour")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
        >
          <circle cx="12" cy="5" r="1" />
          <path d="m9 20 3-6 3 6" />
          <path d="m6 8 6 2 6-2" />
          <path d="M12 10v4" />
        </svg>
      )
    } else if (
      itemText.includes("transport") ||
      itemText.includes("transfer")
    ) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
        >
          <path d="M5 18 1 7h16l-4 11" />
          <path d="M4 15h11.5" />
          <path d="m17 10 4 7" />
          <path d="m17 10 .3-1" />
          <line x1="9" y1="4" x2="9" y2="7" />
          <path d="M12 4v3" />
        </svg>
      )
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
    }
  }

  return (
    <div className="bg-white border border-green-200 rounded-lg p-4 my-2">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-green-100 p-2 rounded-md">
          {getItemIcon()}
        </div>
        <div className="ml-3">
          <h3 className="text-base font-medium text-gray-900">
            Item Added to Itinerary
          </h3>
          <div className="mt-1 text-sm text-gray-600">
            {result.addedItem || toolInvocation.result?.item || "New item"}
            {result.dayNumber
              ? ` added to Day ${result.dayNumber}`
              : " added to itinerary"}
            {result.hours && (
              <span className="ml-2 inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                {result.hours} {result.hours === 1 ? "hour" : "hours"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
