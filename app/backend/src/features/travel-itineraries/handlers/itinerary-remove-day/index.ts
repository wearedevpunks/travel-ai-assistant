import { Injectable } from "@nestjs/common"
import { ItineraryRemoveDayInput, ItineraryRemoveDayOutput } from "./types"

import { TravelItinerariesRepository } from "@/collections/mocked/repositories/itineraries.repository"
import { Log } from "@punks/backend-core"

@Injectable()
export class ItineraryRemoveDayHandler {
  private readonly logger = Log.getLogger(ItineraryRemoveDayHandler.name)

  constructor(
    private readonly itinerariesRepository: TravelItinerariesRepository
  ) {}

  async execute(
    input: ItineraryRemoveDayInput
  ): Promise<ItineraryRemoveDayOutput> {
    const { itineraryId, dayId } = input

    try {
      await this.itinerariesRepository.removeDayFromItinerary(
        itineraryId,
        dayId
      )

      return {
        success: true,
      }
    } catch (error) {
      this.logger.error(
        `Failed to remove day ${dayId} from itinerary ${itineraryId}: ${error.message}`
      )
      throw error
    }
  }
}
