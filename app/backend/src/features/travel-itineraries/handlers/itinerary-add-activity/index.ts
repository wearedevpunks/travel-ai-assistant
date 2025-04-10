import { Injectable } from "@nestjs/common"
import {
  ItineraryAddActivityInput,
  ItineraryAddActivityOutput,
} from "./types"

import { TravelItinerariesRepository } from "@/collections/mocked/repositories/itineraries.repository"
import { Log } from "@punks/backend-core"

@Injectable()
export class ItineraryAddActivityHandler {
  private readonly logger = Log.getLogger(ItineraryAddActivityHandler.name)

  constructor(
    private readonly itinerariesRepository: TravelItinerariesRepository
  ) {}

  async execute(
    input: ItineraryAddActivityInput
  ): Promise<ItineraryAddActivityOutput> {
    const { itineraryId, dayId, activity } = input
    
    try {
      await this.itinerariesRepository.addActivityToDay(
        itineraryId,
        dayId,
        activity
      )
      
      return {
        success: true
      }
    } catch (error) {
      this.logger.error(`Failed to add activity to day ${dayId} in itinerary ${itineraryId}: ${error.message}`)
      throw error;
    }
  }
}