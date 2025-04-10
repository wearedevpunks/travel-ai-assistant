"use client"

import { ToolOutputProps } from "."
import {
  LoadingOperationOutput,
  ErrorOperationOutput,
  WarningOperationOutput,
} from "@/components/operations"

type Destination = {
  name: string
  description: string
  highlights: string[]
  imageUrl?: string
}

export const TravelDestinationsOutput = ({
  toolInvocation,
}: ToolOutputProps) => {
  // Handle loading state
  if (toolInvocation.state === "call") {
    return (
      <LoadingOperationOutput
        message="Finding travel destinations..."
        skeletonCount={2}
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
            <circle cx="12" cy="12" r="10" />
            <path d="M4.93 4.93c4.66-4.66 12.48-4.66 17.14 0" />
            <path d="M14 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
            <path d="m12 6-2 4h4l-2 4" />
          </svg>
        }
      />
    )
  }

  // Handle error state
  if (toolInvocation.state === "error") {
    return (
      <ErrorOperationOutput
        title="Error finding travel destinations"
        message={
          typeof toolInvocation.result === "string"
            ? toolInvocation.result
            : "We couldn't find any destinations matching your criteria."
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

  // Cast result to array of destinations
  const destinations = toolInvocation.result as Destination[]

  if (!destinations || !destinations.length) {
    return (
      <WarningOperationOutput
        title="No destinations found"
        message="We couldn't find any destinations matching your criteria."
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

  return (
    <div className="bg-white border border-green-200 rounded-lg p-4 my-2">
      <div className="flex items-start mb-4">
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
            <circle cx="12" cy="12" r="10" />
            <path d="M4.93 4.93c4.66-4.66 12.48-4.66 17.14 0" />
            <path d="M14 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
            <path d="m12 6-2 4h4l-2 4" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-base font-medium text-gray-900">
            Travel Destinations
          </h3>
          <div className="mt-1 text-sm text-gray-600">
            {
              "✨ Choose one of these destinations and tell me how many days you'd like to spend there to create your itinerary!"
            }
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {destinations.map((destination, index) => (
          <div
            key={index}
            className="bg-white rounded-md shadow-sm p-3 border border-gray-200"
          >
            <h3 className="font-bold text-gray-800">{destination.name}</h3>
            {destination.imageUrl && (
              <img
                src={destination.imageUrl}
                alt={destination.name}
                className="w-full h-32 object-cover rounded-md my-2"
              />
            )}
            <p className="text-sm text-gray-600 mt-1">
              {destination.description}
            </p>
            {destination.highlights && destination.highlights.length > 0 && (
              <div className="mt-2">
                <div className="text-xs font-medium text-gray-700">
                  Highlights:
                </div>
                <ul className="text-xs mt-1 list-disc list-inside">
                  {destination.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Quick selection button */}
            <div className="mt-2 text-right">
              <span className="inline-block text-xs text-gray-500 italic">
                Try typing: {destination.name} for 5 days
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
