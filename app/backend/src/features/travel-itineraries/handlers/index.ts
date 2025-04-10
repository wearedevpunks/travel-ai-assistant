import { ItineraryCreateHandler } from "./itinerary-create"
import { ItineraryAddActivityHandler } from "./itinerary-add-activity"
import { ItineraryAddDayHandler } from "./itinerary-add-day"
import { ItineraryRemoveDayHandler } from "./itinerary-remove-day"
import { ItineraryMoveDayHandler } from "./itinerary-move-day"
import { ItineraryShareHandler } from "../services/itineraries/handlers/itinerary-share-handler"

export const TravelItinerariesHandlers = [
  ItineraryCreateHandler,
  ItineraryAddActivityHandler,
  ItineraryAddDayHandler,
  ItineraryRemoveDayHandler,
  ItineraryMoveDayHandler,
  ItineraryShareHandler
]

export * from "./itinerary-create"
export * from "./itinerary-add-activity"
export * from "./itinerary-add-day"
export * from "./itinerary-remove-day"
export * from "./itinerary-move-day"
export { ItineraryShareHandler }
