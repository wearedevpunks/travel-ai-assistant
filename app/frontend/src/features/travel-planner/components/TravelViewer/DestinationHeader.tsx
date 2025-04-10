"use client"

import { TravelItineraryDestination } from "@/api/backend"
import { Title } from "@/components/atoms/Title"

interface DestinationHeaderProps {
  destination?: TravelItineraryDestination | null
}

export const DestinationHeader = ({ destination }: DestinationHeaderProps) => {
  return (
    <div>
      {/* Destination cover image */}
      {destination?.picture?.url && (
        <div className="relative h-48 overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
          <img
            src={destination.picture.url}
            alt={destination.picture.alt || "Destination"}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

          {/* Destination name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-xl font-bold">{destination.name}</h3>
            <p className="text-white text-sm opacity-90">
              {destination.country}, {destination.continent}
            </p>
          </div>

          {/* Photo attribution if available */}
          {destination.picture.photographer && (
            <div className="absolute bottom-1 right-2 text-xs text-white opacity-70">
              Photo: {destination.picture.photographer}
            </div>
          )}
        </div>
      )}

      {/* If no image is available, show a text-only header */}
      {!destination?.picture?.url && (
        <div className="px-4 pt-4">
          <Title variant="h4" className="text-lg">
            {destination?.name || "Your Destination"}
          </Title>
          <p className="text-gray-600 text-sm">
            {destination
              ? `${destination.country}, ${destination.continent}`
              : "Loading destination details..."}
          </p>
        </div>
      )}

      {/* Description - shown regardless of whether there's an image */}
      {destination?.name && (
        <p className="text-gray-700 text-sm px-4 pt-3 line-clamp-3 hover:line-clamp-none transition-all">
          {destination.name}
        </p>
      )}
    </div>
  )
}
