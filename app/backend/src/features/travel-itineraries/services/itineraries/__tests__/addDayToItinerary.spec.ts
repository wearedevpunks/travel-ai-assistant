import { Test, TestingModule } from "@nestjs/testing"
import { TravelItinerariesService } from "../index"
import { TravelItinerariesRepository } from "@/collections/mocked/repositories/itineraries.repository"
import { TravelDestinationsRepository } from "@/collections/mocked/repositories/destinations.repository"
import { ItineraryCreateHandler } from "../../../handlers/itinerary-create"
import { ItineraryAddActivityHandler } from "../../../handlers/itinerary-add-activity"
import { ItineraryAddDayHandler } from "../../../handlers/itinerary-add-day"
import { ItineraryRemoveDayHandler } from "../../../handlers/itinerary-remove-day"
import { ItineraryMoveDayHandler } from "../../../handlers/itinerary-move-day"
import { ItineraryAddDayInput } from "../../../handlers/itinerary-add-day/types"

// Import common test utilities
import "./test-utils"

describe("TravelItinerariesService - addDayToItinerary", () => {
  let service: TravelItinerariesService
  let itinerariesRepository: TravelItinerariesRepository
  let destinationsRepository: TravelDestinationsRepository
  let itineraryAddDayHandler: ItineraryAddDayHandler
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
        ItineraryAddDayHandler,
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
    itineraryAddDayHandler = module.get<ItineraryAddDayHandler>(
      ItineraryAddDayHandler
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

  it("should add a day to the itinerary", async () => {
    // We need to spy on the execute method after it's been initialized
    const executeSpy = jest.spyOn(itineraryAddDayHandler, "execute")

    // Arrange
    const activities = ["Visit Notre Dame", "Walk along Seine River"]
    const input: ItineraryAddDayInput = {
      itineraryId,
      activities,
    }

    // Act
    await service.addDayToItinerary(input)

    // Assert
    expect(executeSpy).toHaveBeenCalledWith(input)

    // Get the updated itinerary to verify
    const itinerary = await service.getItinerary(itineraryId)
    expect(itinerary.days.length).toBeGreaterThan(0)

    // Find the day with the activities we added
    const hasDay = itinerary.days.some(
      (day) =>
        day.activities.length === activities.length &&
        day.activities.every((act, idx) => act.description === activities[idx])
    )

    expect(hasDay).toBe(true)
  })

  it("should throw error when itinerary does not exist", async () => {
    // Arrange
    const nonExistentId = "non-existent-id"
    const input: ItineraryAddDayInput = {
      itineraryId: nonExistentId,
      activities: ["Some activity"],
    }

    // Act & Assert
    await expect(service.addDayToItinerary(input)).rejects.toThrow(
      `Itinerary with ID ${nonExistentId} not found`
    )
  })
})
