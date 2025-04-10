export type ItineraryAddDayInput = {
  itineraryId: string
  activities?: string[] | { description: string; hours?: number }[]
}

export type ItineraryAddDayOutput = {
  dayId: string
}
