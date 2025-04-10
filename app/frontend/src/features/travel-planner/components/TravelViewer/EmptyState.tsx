"use client"

import { Card } from "@/components/ui/card"
import { Title } from "@/components/atoms/Title"

export const EmptyState = () => {
  return (
    <Card className="p-4 h-full">
      <div className="h-full flex flex-col">
        <div className="sticky top-0 bg-card pt-2 pb-3 z-10">
          <Title variant="h3" className="mb-2">Travel Dashboard</Title>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <Title variant="h4" className="text-lg mb-2">No Itinerary Yet</Title>
          <p className="text-gray-600 text-sm">
            Chat with the assistant to plan your next adventure and create a travel itinerary.
          </p>
          <div className="mt-4 animate-bounce text-3xl">✈️</div>
        </div>
      </div>
    </Card>
  )
}
