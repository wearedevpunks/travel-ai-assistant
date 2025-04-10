"use client"

import { TravelItinerary } from "@/api/backend"
import { ToolOutputProps } from "."
import {
  LoadingOperationOutput,
  ErrorOperationOutput,
  WarningOperationOutput,
} from "@/components/operations"

type ItineraryResult = {
  itinerary: TravelItinerary
}

export const TravelItineraryOutput = ({ toolInvocation }: ToolOutputProps) => {
  // Rendering logic based on component state
  if (toolInvocation.state === "call") {
    return (
      <LoadingOperationOutput
        message="Creating your travel itinerary..."
        skeletonCount={3}
        icon={
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
            className="text-gray-700"
          >
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </svg>
        }
      />
    )
  }

  if (toolInvocation.state === "error") {
    return (
      <ErrorOperationOutput
        title="Failed to create travel itinerary"
        message={
          typeof toolInvocation.result === "string"
            ? toolInvocation.result
            : "Unable to create your travel itinerary. Please try again."
        }
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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
        }
      />
    )
  }

  // Cast result to itinerary data
  const itineraryData = toolInvocation.result as ItineraryResult

  if (!itineraryData || !itineraryData.itinerary) {
    return (
      <WarningOperationOutput
        title="Itinerary creation issue"
        message="No itinerary was created. Please try again with different parameters."
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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
        }
      />
    )
  }

  // Display a simplified success message instead of the destination cover
  return (
    <div className="bg-white border border-green-200 rounded-lg p-4 my-2">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-green-100 p-2 rounded-md">
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
            className="text-green-600"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-base font-medium text-gray-900">
            Travel itinerary created!
          </h3>
          <div className="mt-1 text-sm text-gray-600">
            <p>
              Your {itineraryData.itinerary.days.length}-day itinerary for{" "}
              <span className="font-medium">
                {itineraryData.itinerary.destination?.name || "your destination"}
              </span>{" "}
              is ready. Check the sidebar to view your complete travel plan!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
