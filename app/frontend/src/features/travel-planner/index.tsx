"use client"

import { TravelPlannerAssistant } from "./components/TravelPlannerAssistant"
import { TravelViewer } from "./components/TravelViewer"
import { Separator } from "@/components/ui/separator"

export const TravelPlanner = () => {
  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">
      {/* Main content area - chat interface */}
      <div className="flex-1 h-full">
        <TravelPlannerAssistant />
      </div>

      {/* Vertical separator */}
      <Separator orientation="vertical" className="h-full" />

      {/* Lateral sidebar - travel viewer */}
      <div className="w-96 h-full">
        <TravelViewer />
      </div>
    </div>
  )
}
