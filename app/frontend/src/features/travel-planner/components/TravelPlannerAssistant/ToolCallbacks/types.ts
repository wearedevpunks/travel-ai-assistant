"use client"

import { TravelItinerary, TravelItineraryDestination } from "@/api/backend"

// Define the exact ToolCall type
export interface ToolCall {
  name: string
  state: "loading" | "success" | "error"
  result?: any
}

// Define the base callback interface for success callbacks
export interface ToolSuccessCallbackProps {
  invocation: {
    toolName: string
    args: Record<string, any>
    state: string
  }
  result: any
  store: any // TravelPlannerStore
}

// Define the base callback interface for error callbacks
export interface ToolErrorCallbackProps {
  invocation: {
    toolName: string
    args: Record<string, any>
    state: string
  }
  error: any
  store: any // TravelPlannerStore
}

// Define the type for a tool callback functions
export interface ToolCallbacks {
  onSuccess: (props: ToolSuccessCallbackProps) => Promise<void>
  onError?: (props: ToolErrorCallbackProps) => Promise<void>
}

// Define specific result types for different tools
export interface CreateItineraryResult {
  itinerary: TravelItinerary
}

export interface ModifyItineraryResult {
  itineraryId: string
  success: boolean
  message?: string
}

export interface DestinationsResult {
  destinations: TravelItineraryDestination[]
}

export interface WeatherResult {
  location: string
  forecast: {
    date: string
    conditions: string
    temperature: {
      high: number
      low: number
    }
    precipitation: number
  }[]
}
