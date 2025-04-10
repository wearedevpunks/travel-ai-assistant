"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Title } from "@/components/atoms/Title"

export const LoadingState = () => {
  return (
    <Card className="p-4 h-full">
      <div className="space-y-4 h-full flex flex-col">
        <div className="sticky top-0 bg-card pt-2 pb-3 z-10">
          <Title variant="h3" className="mb-2">Travel Dashboard</Title>
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        </div>
        
        {/* Scrollable itinerary section */}
        <div className="flex-1 overflow-y-auto">
          <Title variant="h3" className="text-lg">Your Itinerary</Title>
          <div className="space-y-3 mt-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </Card>
  )
}