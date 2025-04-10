export type ItineraryMoveDayInput = {
  itineraryId: string
  fromDayNumber: number
  toDayNumber: number
}

export type ItineraryMoveDayOutput = {
  success: boolean
}