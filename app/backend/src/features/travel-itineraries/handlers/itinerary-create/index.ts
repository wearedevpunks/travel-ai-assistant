import { Injectable } from "@nestjs/common"
import {
  TravelItineraryCreateInput,
  TravelItineraryCreateOutput,
} from "./types"

import { searchPexelPicture } from "@/integrations/pictures/pexels"
import { TravelDestination } from "@/collections/mocked/entities/destination.entity"
import { TravelItinerariesRepository } from "@/collections/mocked/repositories/itineraries.repository"
import { TravelDestinationsRepository } from "@/collections/mocked/repositories/destinations.repository"
import { Log } from "@punks/backend-core"

@Injectable()
export class ItineraryCreateHandler {
  private readonly logger = Log.getLogger(ItineraryCreateHandler.name)

  constructor(
    private readonly destinationsRepository: TravelDestinationsRepository,
    private readonly itinerariesRepository: TravelItinerariesRepository
  ) {}

  async execute(
    input: TravelItineraryCreateInput
  ): Promise<TravelItineraryCreateOutput> {
    const destination = await this.resolveDestination(input.destinationName)
    const picture = await this.resolvePicture(destination)

    const itineraryId = await this.itinerariesRepository.createItinerary({
      ...destination,
      picture,
    })

    // Create the specified number of empty days
    for (let i = 0; i < input.numberOfDays; i++) {
      await this.itinerariesRepository.addDayToItinerary(itineraryId, [])
    }

    return {
      itineraryId,
    }
  }

  private async resolveDestination(destinationName: string) {
    const destinationByName =
      await this.destinationsRepository.search(destinationName)

    if (destinationByName.length === 0) {
      throw new Error(`No destinations found matching "${destinationName}"`)
    }

    return destinationByName[0]
  }

  private async resolvePicture(destination: TravelDestination) {
    try {
      return await searchPexelPicture(`${destination.name} city image`)
    } catch (error) {
      this.logger.exception(
        `Error searching for picture ${destination.name}`,
        error
      )
      return undefined
    }
  }
}
