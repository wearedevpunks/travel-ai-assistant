// This is a simple in-memory repository for the travel planner.

import { Injectable } from "@nestjs/common"
import {
  TravelItinerary,
  TravelItineraryDay,
  TravelItineraryDestination,
} from "../entities/itinerary.entity"
import { newUuid } from "@punks/backend-core"

// In a real application, this would be replaced with a database.
@Injectable()
export class TravelItinerariesRepository {
  private itineraries: Map<string, TravelItinerary> = new Map()

  async createItinerary(
    destination: TravelItineraryDestination
  ): Promise<string> {
    const id = newUuid()
    const itinerary: TravelItinerary = {
      id,
      destination,
      days: [],
    }

    this.itineraries.set(id, itinerary)
    return id
  }

  async getItinerary(id: string): Promise<TravelItinerary> {
    const itinerary = this.itineraries.get(id)
    if (!itinerary) {
      throw new Error(`Itinerary with ID ${id} not found`)
    }
    return itinerary
  }
  
  async getItineraryIfExists(id: string): Promise<TravelItinerary | null> {
    return this.itineraries.get(id) || null
  }

  async addDayToItinerary(
    itineraryId: string,
    activities: string[] | { description: string; hours?: number }[] = []
  ): Promise<string> {
    const itinerary = this.itineraries.get(itineraryId)
    if (!itinerary) {
      throw new Error(`Itinerary with ID ${itineraryId} not found`)
    }

    const dayId = newUuid()

    // Convert any string activities to activity objects
    const formattedActivities = activities.map((activity) => {
      if (typeof activity === "string") {
        return { description: activity }
      }
      return activity
    })

    const day: TravelItineraryDay = {
      id: dayId,
      activities: formattedActivities,
    }

    itinerary.days.push(day)
    return dayId
  }

  async addActivityToDay(
    itineraryId: string,
    dayId: string,
    activity: string | { description: string; hours?: number }
  ): Promise<void> {
    const itinerary = this.itineraries.get(itineraryId)
    if (!itinerary) {
      throw new Error(`Itinerary with ID ${itineraryId} not found`)
    }

    const day = itinerary.days.find((d) => d.id === dayId)
    if (!day) {
      throw new Error(`Day with ID ${dayId} not found in itinerary ${itineraryId}`)
    }

    // Convert string activity to activity object if needed
    const activityObject =
      typeof activity === "string" ? { description: activity } : activity

    day.activities.push(activityObject)
  }

  async removeDayFromItinerary(
    itineraryId: string,
    dayId: string
  ): Promise<void> {
    const itinerary = this.itineraries.get(itineraryId)
    if (!itinerary) {
      throw new Error(`Itinerary with ID ${itineraryId} not found`)
    }

    const dayExists = itinerary.days.some(day => day.id === dayId)
    if (!dayExists) {
      throw new Error(`Day with ID ${dayId} not found in itinerary ${itineraryId}`)
    }

    // Filter out the day to remove
    itinerary.days = itinerary.days.filter((day) => day.id !== dayId)
  }

  async moveDayInItinerary(
    itineraryId: string,
    fromDayNumber: number,
    toDayNumber: number
  ): Promise<void> {
    const itinerary = this.itineraries.get(itineraryId)
    if (!itinerary) {
      throw new Error(`Itinerary with ID ${itineraryId} not found`)
    }

    // Check if day numbers are valid (1-based)
    if (fromDayNumber < 1 || fromDayNumber > itinerary.days.length) {
      throw new Error(`From day number ${fromDayNumber} is invalid. The itinerary has ${itinerary.days.length} days.`)
    }

    if (toDayNumber < 1 || toDayNumber > itinerary.days.length) {
      throw new Error(`To day number ${toDayNumber} is invalid. The itinerary has ${itinerary.days.length} days.`)
    }

    // No need to move if the positions are the same
    if (fromDayNumber === toDayNumber) return;

    // Convert to 0-based indices
    const fromIndex = fromDayNumber - 1
    const toIndex = toDayNumber - 1

    // Store a copy of the day we're moving
    const dayToMove = { ...itinerary.days[fromIndex] }

    // Create an entirely new array with the correct order
    const newDays = [...itinerary.days]

    // Remove the day from its current position
    newDays.splice(fromIndex, 1)

    // Insert the day at the desired position
    newDays.splice(toIndex, 0, dayToMove)

    // Update the itinerary with the new order
    itinerary.days = newDays
  }
}
