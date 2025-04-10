import { Test, TestingModule } from "@nestjs/testing"
import { TravelItinerariesService } from "../index"
import { TravelItinerariesRepository } from "@/collections/mocked/repositories/itineraries.repository"
import { TravelDestinationsRepository } from "@/collections/mocked/repositories/destinations.repository"
import { ItineraryCreateHandler } from "../../../handlers/itinerary-create"
import { ItineraryAddActivityHandler } from "../../../handlers/itinerary-add-activity"
import { ItineraryAddDayHandler } from "../../../handlers/itinerary-add-day"
import { ItineraryRemoveDayHandler } from "../../../handlers/itinerary-remove-day"
import { ItineraryMoveDayHandler } from "../../../handlers/itinerary-move-day"
import { ItineraryAddActivityInput } from "../../../handlers/itinerary-add-activity/types"

// Import common test utilities
import "./test-utils"

describe("TravelItinerariesService - addActivityToDay", () => {
  let service: TravelItinerariesService
  let itinerariesRepository: TravelItinerariesRepository
  let destinationsRepository: TravelDestinationsRepository
  let itineraryAddActivityHandler: ItineraryAddActivityHandler
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
        ItineraryAddActivityHandler,
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
    itineraryAddActivityHandler = module.get<ItineraryAddActivityHandler>(
      ItineraryAddActivityHandler
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
    dayId = await itinerariesRepository.addDayToItinerary(itineraryId, [])
  })

  it("should add an activity to a day in the itinerary", async () => {
    // We need to spy on the execute method after it's been initialized
    const executeSpy = jest.spyOn(itineraryAddActivityHandler, "execute")

    // Arrange
    const activity = "Visit Eiffel Tower"
    const input: ItineraryAddActivityInput = {
      itineraryId,
      dayId,
      activity,
    }

    // Act
    await service.addActivityToDay(input)

    // Assert
    expect(executeSpy).toHaveBeenCalledWith(input)

    // Get the updated itinerary to verify
    const itinerary = await service.getItinerary(itineraryId)
    const day = itinerary.days.find((d) => d.id === dayId)
    expect(day).toBeDefined()
    expect(day?.activities.some((a) => a.description === activity)).toBe(true)
  })

  it("should throw error when itinerary does not exist", async () => {
    // Arrange
    const nonExistentId = "non-existent-id"
    const input: ItineraryAddActivityInput = {
      itineraryId: nonExistentId,
      dayId,
      activity: "Some activity",
    }

    // Act & Assert
    await expect(service.addActivityToDay(input)).rejects.toThrow(
      `Itinerary with ID ${nonExistentId} not found`
    )
  })

  it("should throw error when day does not exist", async () => {
    // Arrange
    const nonExistentDayId = "non-existent-day-id"
    const input: ItineraryAddActivityInput = {
      itineraryId,
      dayId: nonExistentDayId,
      activity: "Some activity",
    }

    // Act & Assert
    await expect(service.addActivityToDay(input)).rejects.toThrow(
      `Day with ID ${nonExistentDayId} not found in itinerary ${itineraryId}`
    )
  })
})
