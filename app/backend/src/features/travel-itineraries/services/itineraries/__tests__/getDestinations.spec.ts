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

describe("TravelItinerariesService - getDestinations", () => {
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

  it("should return all destinations when no continent is provided", async () => {
    // Act
    const result = await service.getDestinations()

    // Assert
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    // The repository initializes with mock data, so there should be destinations
    expect(result.length).toBeGreaterThan(0)
  })

  it("should return filtered destinations when continent is provided", async () => {
    // Arrange
    const continent = "Europe"

    // Act
    const result = await service.getDestinations(continent)

    // Assert
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    // All returned destinations should be from Europe
    expect(result.every((dest) => dest.continent === continent)).toBe(true)
  })
})
