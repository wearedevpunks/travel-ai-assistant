import { Injectable } from "@nestjs/common"
import {
  ItineraryCreateHandler,
  ItineraryAddActivityHandler,
  ItineraryAddDayHandler,
  ItineraryRemoveDayHandler,
  ItineraryMoveDayHandler,
} from "../../handlers"

import { TravelItineraryCreateInput } from "../../handlers/itinerary-create/types"
import { ItineraryAddActivityInput } from "../../handlers/itinerary-add-activity/types"
import { ItineraryAddDayInput } from "../../handlers/itinerary-add-day/types"
import { ItineraryRemoveDayInput } from "../../handlers/itinerary-remove-day/types"
import { ItineraryMoveDayInput } from "../../handlers/itinerary-move-day/types"
import {
  ItineraryShareHandler,
  ItineraryShareOptions,
  ItineraryShareResult,
} from "./handlers/itinerary-share-handler"

import { TravelItinerariesRepository } from "../../../../collections/redis/repositories/itineraries.repository"
import { TravelDestinationsRepository } from "../../../../collections/redis/repositories/destinations.repository"

@Injectable()
export class TravelItinerariesService {
  constructor(
    private readonly itinerariesRepository: TravelItinerariesRepository,
    private readonly destinationsRepository: TravelDestinationsRepository,
    private readonly itineraryCreateHandler: ItineraryCreateHandler,
    private readonly itineraryAddActivityHandler: ItineraryAddActivityHandler,
    private readonly itineraryAddDayHandler: ItineraryAddDayHandler,
    private readonly itineraryRemoveDayHandler: ItineraryRemoveDayHandler,
    private readonly itineraryMoveDayHandler: ItineraryMoveDayHandler,
    private readonly itineraryShareHandler: ItineraryShareHandler
  ) {}

  async getDestinations(continent?: string) {
    return await this.destinationsRepository.getAll(continent)
  }

  async searchDestinations(name: string) {
    return await this.destinationsRepository.search(name)
  }

  async getItinerary(id: string) {
    return await this.itinerariesRepository.getItinerary(id)
  }

  async getItineraryIfExists(id: string) {
    return await this.itinerariesRepository.getItineraryIfExists(id)
  }

  async createItinerary(input: TravelItineraryCreateInput) {
    return await this.itineraryCreateHandler.execute(input)
  }

  async addActivityToDay(input: ItineraryAddActivityInput): Promise<void> {
    await this.itineraryAddActivityHandler.execute(input)
  }

  async addDayToItinerary(input: ItineraryAddDayInput): Promise<void> {
    await this.itineraryAddDayHandler.execute(input)
  }

  async removeDayFromItinerary(input: ItineraryRemoveDayInput): Promise<void> {
    await this.itineraryRemoveDayHandler.execute(input)
  }

  async moveDayInItinerary(input: ItineraryMoveDayInput): Promise<void> {
    await this.itineraryMoveDayHandler.execute(input)
  }

  /**
   * Share a travel itinerary via WhatsApp
   * @param options The share options including itinerary ID and phone number
   * @returns Result of the share operation
   */
  async shareItineraryViaWhatsApp(
    options: ItineraryShareOptions
  ): Promise<ItineraryShareResult> {
    return await this.itineraryShareHandler.shareItineraryViaWhatsApp(options)
  }
}
