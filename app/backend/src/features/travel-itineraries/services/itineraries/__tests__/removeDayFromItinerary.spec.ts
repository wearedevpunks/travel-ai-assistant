import { Test, TestingModule } from "@nestjs/testing"
import { TravelItinerariesService } from "../index"
import { TravelItinerariesRepository } from "@/collections/mocked/repositories/itineraries.repository"
import { TravelDestinationsRepository } from "@/collections/mocked/repositories/destinations.repository"
import { ItineraryCreateHandler } from "../../../handlers/itinerary-create"
import { ItineraryAddActivityHandler } from "../../../handlers/itinerary-add-activity"
import { ItineraryAddDayHandler } from "../../../handlers/itinerary-add-day"
import { ItineraryRemoveDayHandler } from "../../../handlers/itinerary-remove-day"
import { ItineraryMoveDayHandler } from "../../../handlers/itinerary-move-day"
import { ItineraryRemoveDayInput } from "../../../handlers/itinerary-remove-day/types"

// Import common test utilities
import "./test-utils"

describe("TravelItinerariesService - removeDayFromItinerary", () => {
  let service: TravelItinerariesService
  let itinerariesRepository: TravelItinerariesRepository
  let destinationsRepository: TravelDestinationsRepository
  let itineraryRemoveDayHandler: ItineraryRemoveDayHandler
  let itineraryId: string
  let dayId: string

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TravelItinerariesService,
        TravelItinerariesRepository,
        TravelDestinationsRepository,
        {
          provide: ItineraryCreateHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ItineraryAddActivityHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ItineraryAddDayHandler,
          useValue: { execute: jest.fn() },
        },
        ItineraryRemoveDayHandler,
        {
          provide: ItineraryMoveDayHandler,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile()

    service = module.get<TravelItinerariesService>(TravelItinerariesService)
    itinerariesRepository = module.get<TravelItinerariesRepository>(
      TravelItinerariesRepository
    )
    destinationsRepository = module.get<TravelDestinationsRepository>(
      TravelDestinationsRepository
    )
    itineraryRemoveDayHandler = module.get<ItineraryRemoveDayHandler>(
      ItineraryRemoveDayHandler
    )

    // Initialize mock data
    await destinationsRepository.onModuleInit()

    // Create a test itinerary with one day
    const destinations = await destinationsRepository.getAll()
    itineraryId = await itinerariesRepository.createItinerary({
      id: destinations[0].id,
      name: destinations[0].name,
      country: destinations[0].country,
      continent: destinations[0].continent,
    })

    // Add a day to the itinerary
    dayId = await itinerariesRepository.addDayToItinerary(itineraryId, [
      "Visit Local Museum",
    ])
  })

  it("should remove a day from the itinerary", async () => {
    // We need to spy on the execute method after it's been initialized
    const executeSpy = jest.spyOn(itineraryRemoveDayHandler, "execute")

    // Arrange
    const input: ItineraryRemoveDayInput = {
      itineraryId,
      dayId,
    }

    // Verify the day exists before removal
    const itineraryBefore = await service.getItinerary(itineraryId)
    expect(itineraryBefore.days.some((d) => d.id === dayId)).toBe(true)

    // Act
    await service.removeDayFromItinerary(input)

    // Assert
    expect(executeSpy).toHaveBeenCalledWith(input)

    // Get the updated itinerary to verify
    const itineraryAfter = await service.getItinerary(itineraryId)
    expect(itineraryAfter.days.some((d) => d.id === dayId)).toBe(false)
  })

  it("should throw error when itinerary does not exist", async () => {
    // Arrange
    const nonExistentId = "non-existent-id"
    const input: ItineraryRemoveDayInput = {
      itineraryId: nonExistentId,
      dayId,
    }

    // Act & Assert
    await expect(service.removeDayFromItinerary(input)).rejects.toThrow(
      `Itinerary with ID ${nonExistentId} not found`
    )
  })

  it("should throw error when day does not exist", async () => {
    // Arrange
    const nonExistentDayId = "non-existent-day-id"
    const input: ItineraryRemoveDayInput = {
      itineraryId,
      dayId: nonExistentDayId,
    }

    // Act & Assert
    await expect(service.removeDayFromItinerary(input)).rejects.toThrow(
      `Day with ID ${nonExistentDayId} not found in itinerary ${itineraryId}`
    )
  })
})
