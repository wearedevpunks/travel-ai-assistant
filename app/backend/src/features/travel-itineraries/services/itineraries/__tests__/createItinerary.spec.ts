import { Test, TestingModule } from "@nestjs/testing"
import { TravelItinerariesService } from "../index"
import { TravelItinerariesRepository } from "@/collections/mocked/repositories/itineraries.repository"
import { TravelDestinationsRepository } from "@/collections/mocked/repositories/destinations.repository"
import { ItineraryCreateHandler } from "../../../handlers/itinerary-create"
import { ItineraryAddActivityHandler } from "../../../handlers/itinerary-add-activity"
import { ItineraryAddDayHandler } from "../../../handlers/itinerary-add-day"
import { ItineraryRemoveDayHandler } from "../../../handlers/itinerary-remove-day"
import { ItineraryMoveDayHandler } from "../../../handlers/itinerary-move-day"
import { TravelItineraryCreateInput } from "../../../handlers/itinerary-create/types"

// Import common test utilities
import "./test-utils"

describe("TravelItinerariesService - createItinerary", () => {
  let service: TravelItinerariesService
  let itineraryCreateHandler: ItineraryCreateHandler
  let destinationsRepository: TravelDestinationsRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TravelItinerariesService,
        TravelItinerariesRepository,
        TravelDestinationsRepository,
        ItineraryCreateHandler,
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
    itineraryCreateHandler = module.get<ItineraryCreateHandler>(
      ItineraryCreateHandler
    )
    destinationsRepository = module.get<TravelDestinationsRepository>(
      TravelDestinationsRepository
    )

    // Initialize mock data
    await destinationsRepository.onModuleInit()
  })

  it("should create a new itinerary", async () => {
    // We need to spy on the execute method after it's been initialized
    const executeSpy = jest.spyOn(itineraryCreateHandler, "execute")

    // Arrange
    const destinations = await destinationsRepository.getAll()
    const destinationName = destinations[0].name

    const createInput: TravelItineraryCreateInput = {
      destinationName,
      numberOfDays: 3,
    }

    // Act
    const result = await service.createItinerary(createInput)

    // Assert
    expect(result).toBeDefined()
    expect(result.itineraryId).toBeDefined()
    expect(executeSpy).toHaveBeenCalledWith(createInput)

    // Get the created itinerary to verify
    const itinerary = await service.getItinerary(result.itineraryId)
    expect(itinerary).toBeDefined()
    expect(itinerary.destination.name).toBe(destinationName)
    expect(itinerary.days.length).toBe(createInput.numberOfDays)
  })
})
