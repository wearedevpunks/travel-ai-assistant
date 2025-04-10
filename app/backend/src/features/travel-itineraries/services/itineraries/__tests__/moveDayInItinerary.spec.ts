import { Test, TestingModule } from "@nestjs/testing"
import { TravelItinerariesService } from "../index"
import { TravelItinerariesRepository } from "@/collections/mocked/repositories/itineraries.repository"
import { TravelDestinationsRepository } from "@/collections/mocked/repositories/destinations.repository"
import { ItineraryCreateHandler } from "../../../handlers/itinerary-create"
import { ItineraryAddActivityHandler } from "../../../handlers/itinerary-add-activity"
import { ItineraryAddDayHandler } from "../../../handlers/itinerary-add-day"
import { ItineraryRemoveDayHandler } from "../../../handlers/itinerary-remove-day"
import { ItineraryMoveDayHandler } from "../../../handlers/itinerary-move-day"
import { ItineraryMoveDayInput } from "../../../handlers/itinerary-move-day/types"

// Import common test utilities
import "./test-utils"

describe("TravelItinerariesService - moveDayInItinerary", () => {
  let service: TravelItinerariesService
  let itinerariesRepository: TravelItinerariesRepository
  let destinationsRepository: TravelDestinationsRepository
  let itineraryMoveDayHandler: ItineraryMoveDayHandler
  let itineraryId: string
  let firstDayId: string
  let secondDayId: string

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
        {
          provide: ItineraryRemoveDayHandler,
          useValue: { execute: jest.fn() },
        },
        ItineraryMoveDayHandler,
      ],
    }).compile()

    service = module.get<TravelItinerariesService>(TravelItinerariesService)
    itinerariesRepository = module.get<TravelItinerariesRepository>(
      TravelItinerariesRepository
    )
    destinationsRepository = module.get<TravelDestinationsRepository>(
      TravelDestinationsRepository
    )
    itineraryMoveDayHandler = module.get<ItineraryMoveDayHandler>(
      ItineraryMoveDayHandler
    )

    // Initialize mock data
    await destinationsRepository.onModuleInit()

    // Create a test itinerary with two days
    const destinations = await destinationsRepository.getAll()
    itineraryId = await itinerariesRepository.createItinerary({
      id: destinations[0].id,
      name: destinations[0].name,
      country: destinations[0].country,
      continent: destinations[0].continent,
    })

    // Add two days to the itinerary
    firstDayId = await itinerariesRepository.addDayToItinerary(itineraryId, [
      "Visit Museum",
    ])
    secondDayId = await itinerariesRepository.addDayToItinerary(itineraryId, [
      "Beach Day",
    ])
  })

  it("should move a day within the itinerary", async () => {
    // We need to spy on the execute method after it's been initialized
    const executeSpy = jest.spyOn(itineraryMoveDayHandler, "execute")

    // Arrange
    const input: ItineraryMoveDayInput = {
      itineraryId,
      fromDayNumber: 1, // 1-based index
      toDayNumber: 2, // 1-based index
    }

    // Verify the initial order of days
    const itineraryBefore = await service.getItinerary(itineraryId)
    expect(itineraryBefore.days[0].id).toBe(firstDayId)
    expect(itineraryBefore.days[1].id).toBe(secondDayId)

    // Act
    await service.moveDayInItinerary(input)

    // Assert
    expect(executeSpy).toHaveBeenCalledWith(input)

    // Get the updated itinerary to verify the new order
    const itineraryAfter = await service.getItinerary(itineraryId)
    expect(itineraryAfter.days[0].id).toBe(secondDayId)
    expect(itineraryAfter.days[1].id).toBe(firstDayId)
  })

  it("should throw error when itinerary does not exist", async () => {
    // Arrange
    const nonExistentId = "non-existent-id"
    const input: ItineraryMoveDayInput = {
      itineraryId: nonExistentId,
      fromDayNumber: 1,
      toDayNumber: 2,
    }

    // Act & Assert
    await expect(service.moveDayInItinerary(input)).rejects.toThrow(
      `Itinerary with ID ${nonExistentId} not found`
    )
  })

  it("should throw error when day number is invalid", async () => {
    // Arrange
    const invalidDayNumber = 10 // There are only 2 days in the itinerary
    const input: ItineraryMoveDayInput = {
      itineraryId,
      fromDayNumber: invalidDayNumber,
      toDayNumber: 1,
    }

    // Act & Assert
    await expect(service.moveDayInItinerary(input)).rejects.toThrow(
      `From day number ${invalidDayNumber} is invalid. The itinerary has 2 days.`
    )
  })

  it("should not make changes when source and destination positions are the same", async () => {
    // Arrange
    const input: ItineraryMoveDayInput = {
      itineraryId,
      fromDayNumber: 1,
      toDayNumber: 1,
    }

    // Get the initial state
    const itineraryBefore = await service.getItinerary(itineraryId)

    // Act
    await service.moveDayInItinerary(input)

    // Assert - the order should remain unchanged
    const itineraryAfter = await service.getItinerary(itineraryId)
    expect(itineraryAfter.days[0].id).toBe(itineraryBefore.days[0].id)
    expect(itineraryAfter.days[1].id).toBe(itineraryBefore.days[1].id)
  })
})
