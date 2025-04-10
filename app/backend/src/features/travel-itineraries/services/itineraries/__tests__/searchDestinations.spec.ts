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

describe("TravelItinerariesService - searchDestinations", () => {
  let service: TravelItinerariesService
  let destinationsRepository: TravelDestinationsRepository

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
    destinationsRepository = module.get<TravelDestinationsRepository>(
      TravelDestinationsRepository
    )

    // Initialize mock data
    await destinationsRepository.onModuleInit()
  })

  it("should search destinations by name", async () => {
    // Arrange
    const searchName = "Paris" // The mock data should include Paris

    // Act
    const result = await service.searchDestinations(searchName)

    // Assert
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    // All returned destinations should include the search term in their name
    expect(
      result.every((dest) =>
        dest.name.toLowerCase().includes(searchName.toLowerCase())
      )
    ).toBe(true)
  })

  it("should return empty array when no destinations match the search term", async () => {
    // Arrange
    const searchName = "NonExistentPlace123456"

    // Act
    const result = await service.searchDestinations(searchName)

    // Assert
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
  })
})
