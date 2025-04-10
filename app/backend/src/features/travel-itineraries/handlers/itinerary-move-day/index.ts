import { Injectable } from "@nestjs/common"
import { ItineraryMoveDayInput, ItineraryMoveDayOutput } from "./types"

import { TravelItinerariesRepository } from "@/collections/mocked/repositories/itineraries.repository"
import { Log } from "@punks/backend-core"

@Injectable()
export class ItineraryMoveDayHandler {
  private readonly logger = Log.getLogger(ItineraryMoveDayHandler.name)

  constructor(
    private readonly itinerariesRepository: TravelItinerariesRepository
  ) {}

  async execute(input: ItineraryMoveDayInput): Promise<ItineraryMoveDayOutput> {
    const { itineraryId, fromDayNumber, toDayNumber } = input

    try {
      await this.itinerariesRepository.moveDayInItinerary(
        itineraryId,
        fromDayNumber,
        toDayNumber
      )

      return {
        success: true,
      }
    } catch (error) {
      this.logger.error(
        `Failed to move day ${fromDayNumber} to position ${toDayNumber} in itinerary ${itineraryId}: ${error.message}`
      )
      throw error
    }
  }
}
