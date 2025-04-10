export type ItineraryAddActivityInput = {
  itineraryId: string
  dayId: string
  activity: string | { description: string; hours?: number }
}

export type ItineraryAddActivityOutput = {
  success: boolean
}