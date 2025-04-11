import { z } from "zod"
import { tool } from "ai"

import { TravelItinerariesService } from "../../features/travel-itineraries/services/itineraries"
import { estimateActivityHours } from "./travelPlanner.utils"
import { Log } from "@punks/backend-core"

const logger = Log.getLogger("TravelPlannerTools")

// Service instance will be injected by module
let itinerariesService: TravelItinerariesService

export function setTravelItinerariesService(service: TravelItinerariesService) {
  itinerariesService = service
}

/**
 * A tool that returns a list of available travel destinations.
 */
export const getTravelDestinations = tool({
  description:
    "Returns a list of available travel destinations. Use this tool FIRST to find destination IDs before creating or modifying itineraries. When a user mentions a destination by name (like 'Paris', 'Tokyo', etc.), use this tool without parameters to find the matching destination ID.",
  parameters: z.object({
    continent: z
      .string()
      .optional()
      .describe(
        "Optional. Filter destinations by continent (Europe, Asia, North America, South America, Africa, Oceania)"
      ),
    nameFilter: z
      .string()
      .optional()
      .describe(
        "Optional. Filter destinations by name (case-insensitive partial match)"
      ),
  }),
  execute: async ({ continent, nameFilter }) => {
    logger.info("getTravelDestinations", { continent, nameFilter })

    if (nameFilter) {
      return await itinerariesService.searchDestinations(nameFilter)
    }

    return await itinerariesService.getDestinations(continent)
  },
})

export const createTravelItinerary = tool({
  description:
    "Creates a travel itinerary for a given destination with empty days. You must provide a destination name and the number of days.",
  parameters: z.object({
    destinationName: z
      .string()
      .describe(
        "The name of the destination (city or country) for this itinerary."
      ),
    numberOfDays: z
      .number()
      .int()
      .positive()
      .describe("The number of days to create in the itinerary"),
    successMessage: z
      .string()
      .describe(
        "A thank you message to the user for choosing the destination. This will be spoken after the itinerary is created."
      ),
  }),
  execute: async ({ destinationName, numberOfDays, successMessage }) => {
    logger.info("createTravelItinerary", {
      destinationName,
      numberOfDays,
    })

    const { itineraryId } = await itinerariesService.createItinerary({
      destinationName,
      numberOfDays,
    })
    const itinerary = await itinerariesService.getItinerary(itineraryId)
    return {
      itinerary,
      messages: {
        success: successMessage,
      },
    }
  },
})

export const addItemToItinerary = tool({
  description:
    "Adds an activity item to a specific day in the travel itinerary.",
  parameters: z.object({
    itineraryId: z.string().describe("The ID of the itinerary"),
    dayNumber: z
      .number()
      .int()
      .min(1)
      .describe("The day number (starting from 1)"),
    item: z.string().describe("The activity to add to the day"),
    hours: z
      .number()
      .positive()
      .optional()
      .describe(
        "Optional. Estimated duration of the activity in hours. If not provided, it will be automatically estimated based on the activity type."
      ),
    successMessage: z
      .string()
      .describe(
        "A thank you message to the user for adding the activity. This will be spoken after the activity is added."
      ),
  }),
  execute: async ({ itineraryId, dayNumber, item, hours, successMessage }) => {
    logger.info("addItemToItinerary", { itineraryId, dayNumber, item, hours })

    // Get the itinerary - this will throw an error if not found
    const itinerary = await itinerariesService.getItinerary(itineraryId)

    // Validate day number
    if (dayNumber < 1 || dayNumber > itinerary.days.length) {
      throw new Error(
        `Day number ${dayNumber} is invalid. The itinerary has ${itinerary.days.length} days.`
      )
    }

    // Get the day ID from the day number
    const dayIndex = dayNumber - 1
    const dayId = itinerary.days[dayIndex].id

    // Calculate estimated hours if not provided
    const estimatedHours = estimateActivityHours(item, hours)

    // Add the activity with hours
    const activityWithHours = {
      description: item,
      hours: estimatedHours,
    }

    // This will throw an error if it fails
    await itinerariesService.addActivityToDay({
      itineraryId,
      dayId,
      activity: activityWithHours,
    })

    // Get updated itinerary
    const updatedItinerary = await itinerariesService.getItinerary(itineraryId)
    return {
      itinerary: updatedItinerary,
      addedItem: item,
      hours: estimatedHours,
      dayNumber,
      itineraryId,
      messages: {
        success: successMessage,
      },
    }
  },
})

export const addDayToItinerary = tool({
  description:
    "Adds a new day to the travel itinerary with optional activities.",
  parameters: z.object({
    itineraryId: z.string().describe("The ID of the itinerary"),
    activities: z
      .array(z.string())
      .optional()
      .describe("Optional list of activities for the new day"),
    successMessage: z
      .string()
      .describe(
        "A thank you message to the user for adding the day. This will be spoken after the day is added."
      ),
  }),
  execute: async ({ itineraryId, activities = [], successMessage }) => {
    logger.info("addDayToItinerary", {
      itineraryId,
      activities,
    })

    // Validate itinerary existence - will throw if not found
    await itinerariesService.getItinerary(itineraryId)

    // Add the day through the service - will throw if there's an error
    const dayId = await itinerariesService.addDayToItinerary({
      itineraryId,
      activities,
    })

    // Get updated itinerary
    const itinerary = await itinerariesService.getItinerary(itineraryId)
    return {
      itinerary,
      addedDayId: dayId,
      messages: {
        success: successMessage,
      },
    }
  },
})

export const removeDayFromItinerary = tool({
  description: "Removes a day from the travel itinerary.",
  parameters: z.object({
    itineraryId: z.string().describe("The ID of the itinerary"),
    dayId: z.string().describe("The ID of the day to remove"),
    successMessage: z
      .string()
      .describe(
        "A thank you message to the user for removing the day. This will be spoken after the day is removed."
      ),
  }),
  execute: async ({ itineraryId, dayId, successMessage }) => {
    logger.info("removeDayFromItinerary", { itineraryId, dayId })

    // The service will validate the itinerary and day existence
    // and throw appropriate errors if needed
    await itinerariesService.removeDayFromItinerary({
      itineraryId,
      dayId,
    })

    // Get updated itinerary
    const itinerary = await itinerariesService.getItinerary(itineraryId)
    return {
      itinerary,
      removedDayId: dayId,
      messages: {
        success: successMessage,
      },
    }
  },
})

export const moveDayInItinerary = tool({
  description:
    "Moves a day from one position to another in the travel itinerary.",
  parameters: z.object({
    itineraryId: z.string().describe("The ID of the itinerary"),
    fromDayNumber: z
      .number()
      .int()
      .min(1)
      .describe("The current day number (starting from 1)"),
    toDayNumber: z
      .number()
      .int()
      .min(1)
      .describe("The new day number to move to (starting from 1)"),
    successMessage: z
      .string()
      .describe(
        "A thank you message to the user for moving the day. This will be spoken after the day is moved."
      ),
  }),
  execute: async ({
    itineraryId,
    fromDayNumber,
    toDayNumber,
    successMessage,
  }) => {
    logger.info("moveDayInItinerary", {
      itineraryId,
      fromDayNumber,
      toDayNumber,
    })

    // Get the itinerary - will throw error if not found
    const itineraryBefore = await itinerariesService.getItinerary(itineraryId)

    // No need to move if the positions are the same
    if (fromDayNumber === toDayNumber) {
      return {
        itinerary: itineraryBefore,
        movedFromDay: fromDayNumber,
        movedToDay: toDayNumber,
        itineraryId,
        success: false,
      }
    }

    // Moving the day through the service - will throw appropriate errors for validation
    await itinerariesService.moveDayInItinerary({
      itineraryId,
      fromDayNumber,
      toDayNumber,
    })

    // Get updated itinerary
    const itinerary = await itinerariesService.getItinerary(itineraryId)

    return {
      itinerary,
      movedFromDay: fromDayNumber,
      movedToDay: toDayNumber,
      itineraryId,
      messages: {
        success: successMessage,
      },
    }
  },
})

/**
 * A tool that sends the travel itinerary to a phone number via WhatsApp using Twilio
 */
export const sendItineraryViaWhatsApp = tool({
  description:
    "Sends the travel itinerary to a specified phone number via WhatsApp using Twilio messaging service.",
  parameters: z.object({
    itineraryId: z.string().describe("The ID of the itinerary to send"),
    phoneNumber: z
      .string()
      .describe(
        "The recipient's phone number in international format (e.g., '+1234567890')"
      ),
    customMessage: z
      .string()
      .optional()
      .describe("Optional. A custom message to include with the itinerary."),
    successMessage: z
      .string()
      .describe(
        "A thank you message to the user for sending the itinerary. This will be spoken after the itinerary is sent."
      ),
  }),
  execute: async ({
    itineraryId,
    phoneNumber,
    customMessage,
    successMessage,
  }) => {
    logger.info("sendItineraryViaWhatsApp", {
      itineraryId,
      phoneNumber,
      customMessage,
    })

    try {
      // Use the travel itineraries service to handle the share operation
      // This delegates the responsibility to the proper service implementation
      const result = await itinerariesService.shareItineraryViaWhatsApp({
        itineraryId,
        phoneNumber,
        customMessage,
      })

      // Add dynamic thank you message
      const response = {
        ...result,
        messages: {
          success: successMessage,
        },
      }

      logger.info("WhatsApp share response:", response)
      return response
    } catch (error) {
      logger.exception("Failed to share itinerary via WhatsApp:", error)
      return {
        success: false,
        phoneNumber,
        error: error.message,
      }
    }
  },
})
