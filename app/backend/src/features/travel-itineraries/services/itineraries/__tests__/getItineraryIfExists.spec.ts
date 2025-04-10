import { Test, TestingModule } from "@nestjs/testing"
import { TravelItinerariesService } from "../index"
import { TravelItinerariesRepository } from "@/collections/mocked/repositories/itineraries.repository"
import { TravelDestinationsRepository } from "@/collections/mocked/repositories/destinations.repository"
import { ItineraryCreateHandler } from "../../../handlers/itinerary-create"
import { ItineraryAddActivityHandler } from "../../../handlers/itinerary-add-activity"
import { ItineraryAddDayHandler } from "../../../handlers/itinerary-add-day"
import { ItineraryRemoveDayHandler } from "../../../handlers/itinerary-remove-day"
import { ItineraryMoveDayHandler } from "../../../handlers/itinerary-move-day"

// Import common test utilities
import "./test-utils"

describe("TravelItinerariesService - getItineraryIfExists", () => {
  let service: TravelItinerariesService
  let itinerariesRepository: TravelItinerariesRepository
  let destinationsRepository: TravelDestinationsRepository
  let itineraryId: string

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

    // Initialize mock data
    await destinationsRepository.onModuleInit()

    // Create a test itinerary
    const destinations = await destinationsRepository.getAll()
    itineraryId = await itinerariesRepository.createItinerary({
      id: destinations[0].id,
      name: destinations[0].name,
      country: destinations[0].country,
      continent: destinations[0].continent,
    })
  })

  it("should get an itinerary by id if it exists", async () => {
    // Act
    const result = await service.getItineraryIfExists(itineraryId)

    // Assert
    expect(result).toBeDefined()
    expect(result).not.toBeNull()
    expect(result?.id).toBe(itineraryId)
  })

  it("should return null when itinerary does not exist", async () => {
    // Arrange
    const nonExistentId = "non-existent-id"

    // Act
    const result = await service.getItineraryIfExists(nonExistentId)

    // Assert
    expect(result).toBeNull()
  })
})
