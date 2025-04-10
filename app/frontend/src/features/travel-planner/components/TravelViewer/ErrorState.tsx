"use client"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Title } from "@/components/atoms/Title"

interface ErrorStateProps {
  error: string
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <Card className="p-4 h-full">
      <div className="h-full flex flex-col">
        <div className="sticky top-0 bg-card pt-2 pb-3 z-10">
          <Title variant="h3" className="mb-2">Travel Dashboard</Title>
        </div>
        
        <div className="flex-1 flex items-start justify-center pt-6">
          <Alert variant="destructive" className="w-full">
            <AlertTitle>Error Loading Itinerary</AlertTitle>
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    </Card>
  )
}