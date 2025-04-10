import { Injectable } from "@nestjs/common"
import {
  TravelItinerary,
  TravelItineraryDay,
  TravelItineraryDestination,
} from "../entities/itinerary.entity"
import { newUuid } from "@punks/backend-core"
import Redis from "ioredis"
import { Settings } from "../../../settings"

@Injectable()
export class TravelItinerariesRepository {
  private readonly redis: Redis
  private readonly itineraryKey = "itinerary:"

  constructor() {
    this.redis = new Redis(Settings.getRedisUrl())
  }

  async createItinerary(
    destination: TravelItineraryDestination
  ): Promise<string> {
    const id = newUuid()
    const itinerary: TravelItinerary = {
      id,
      destination,
      days: [],
    }

    // Store the complete itinerary object
    await this.redis.set(`${this.itineraryKey}${id}`, JSON.stringify(itinerary))

    // Add to all itineraries set for quick lookup
    await this.redis.sadd("itineraries:all", id)

    return id
  }

  async getItinerary(id: string): Promise<TravelItinerary> {
    const itinerary = await this.getItineraryIfExists(id)
    if (!itinerary) {
      throw new Error(`Itinerary with ID ${id} not found`)
    }
    return itinerary
  }

  async getItineraryIfExists(id: string): Promise<TravelItinerary | null> {
    const itineraryJson = await this.redis.get(`${this.itineraryKey}${id}`)

    if (!itineraryJson) {
      return null
    }

    return JSON.parse(itineraryJson)
  }

  async addDayToItinerary(
    itineraryId: string,
    activities: string[] | { description: string; hours?: number }[] = []
  ): Promise<string> {
    // Get the current itinerary
    const itinerary = await this.getItinerary(itineraryId)

    const dayId = newUuid()

    // Convert any string activities to activity objects
    const formattedActivities = activities.map((activity) => {
      if (typeof activity === "string") {
        return { description: activity }
      }
      return activity
    })

    // Create new day
    const newDay: TravelItineraryDay = {
      id: dayId,
      activities: formattedActivities,
    }

    // Add day to itinerary
    itinerary.days.push(newDay)

    // Save updated itinerary
    await this.redis.set(
      `${this.itineraryKey}${itineraryId}`,
      JSON.stringify(itinerary)
    )

    return dayId
  }

  async addActivityToDay(
    itineraryId: string,
    dayId: string,
    activity: string | { description: string; hours?: number }
  ): Promise<void> {
    // Get the current itinerary
    const itinerary = await this.getItinerary(itineraryId)

    // Find the day
    const day = itinerary.days.find((d) => d.id === dayId)
    if (!day) {
      throw new Error(
        `Day with ID ${dayId} not found in itinerary ${itineraryId}`
      )
    }

    // Convert string activity to activity object if needed
    const activityObject =
      typeof activity === "string" ? { description: activity } : activity

    // Add activity to day
    day.activities.push(activityObject)

    // Save updated itinerary
    await this.redis.set(
      `${this.itineraryKey}${itineraryId}`,
      JSON.stringify(itinerary)
    )
  }

  async removeDayFromItinerary(
    itineraryId: string,
    dayId: string
  ): Promise<void> {
    // Get the current itinerary
    const itinerary = await this.getItinerary(itineraryId)

    // Check if day exists
    const dayExists = itinerary.days.some((day) => day.id === dayId)
    if (!dayExists) {
      throw new Error(
        `Day with ID ${dayId} not found in itinerary ${itineraryId}`
      )
    }

    // Remove day from itinerary
    itinerary.days = itinerary.days.filter((day) => day.id !== dayId)

    // Save updated itinerary
    await this.redis.set(
      `${this.itineraryKey}${itineraryId}`,
      JSON.stringify(itinerary)
    )
  }

  async moveDayInItinerary(
    itineraryId: string,
    fromDayNumber: number,
    toDayNumber: number
  ): Promise<void> {
    // Get the current itinerary
    const itinerary = await this.getItinerary(itineraryId)

    // Check if day numbers are valid (1-based)
    if (fromDayNumber < 1 || fromDayNumber > itinerary.days.length) {
      throw new Error(
        `From day number ${fromDayNumber} is invalid. The itinerary has ${itinerary.days.length} days.`
      )
    }

    if (toDayNumber < 1 || toDayNumber > itinerary.days.length) {
      throw new Error(
        `To day number ${toDayNumber} is invalid. The itinerary has ${itinerary.days.length} days.`
      )
    }

    // No need to move if the positions are the same
    if (fromDayNumber === toDayNumber) return

    // Convert to 0-based indices
    const fromIndex = fromDayNumber - 1
    const toIndex = toDayNumber - 1

    // Store a copy of the day we're moving
    const dayToMove = { ...itinerary.days[fromIndex] }

    // Remove the day from its current position
    itinerary.days.splice(fromIndex, 1)

    // Insert the day at the desired position
    itinerary.days.splice(toIndex, 0, dayToMove)

    // Save updated itinerary
    await this.redis.set(
      `${this.itineraryKey}${itineraryId}`,
      JSON.stringify(itinerary)
    )
  }
}
