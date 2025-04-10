import { Injectable } from "@nestjs/common"
import { ItineraryAddDayInput, ItineraryAddDayOutput } from "./types"

import { TravelItinerariesRepository } from "../../../../collections/mocked/repositories/itineraries.repository"
import { Log } from "@punks/backend-core"

@Injectable()
export class ItineraryAddDayHandler {
  private readonly logger = Log.getLogger(ItineraryAddDayHandler.name)

  constructor(
    private readonly itinerariesRepository: TravelItinerariesRepository
  ) {}

  async execute(input: ItineraryAddDayInput): Promise<ItineraryAddDayOutput> {
    const { itineraryId, activities = [] } = input

    try {
      const dayId = await this.itinerariesRepository.addDayToItinerary(
        itineraryId,
        activities
      )

      return {
        dayId,
      }
    } catch (error) {
      this.logger.error(
        `Failed to add day to itinerary ${itineraryId}: ${error.message}`
      )
      throw error
    }
  }
}
