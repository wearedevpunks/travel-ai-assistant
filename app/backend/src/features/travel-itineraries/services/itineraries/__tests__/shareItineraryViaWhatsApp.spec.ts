import { Test, TestingModule } from "@nestjs/testing"
import { TravelItinerariesService } from "../index"
import { TravelItinerariesRepository } from "@/collections/mocked/repositories/itineraries.repository"
import { TravelDestinationsRepository } from "@/collections/mocked/repositories/destinations.repository"
import { ItineraryCreateHandler } from "../../../handlers/itinerary-create"
import { ItineraryAddActivityHandler } from "../../../handlers/itinerary-add-activity"
import { ItineraryAddDayHandler } from "../../../handlers/itinerary-add-day"
import { ItineraryRemoveDayHandler } from "../../../handlers/itinerary-remove-day"
import { ItineraryMoveDayHandler } from "../../../handlers/itinerary-move-day"
import { ItineraryShareHandler } from "../handlers/itinerary-share-handler"
import { TwilioMessagingService } from "@/integrations/messaging/twilio/services/messaging"

// Import common test utilities
import "./test-utils"

// Mock TwilioMessagingService
jest.mock("@/integrations/messaging/twilio/services/messaging", () => {
  return {
    TwilioMessagingService: jest.fn().mockImplementation(() => {
      return {
        sendWhatsAppMessage: jest.fn().mockImplementation(({ body, to }) => {
          // Simulate Twilio API response
          return Promise.resolve("MOCK_TWILIO_MESSAGE_SID_12345")
        }),
      }
    }),
  }
})

describe("TravelItinerariesService - shareItineraryViaWhatsApp", () => {
  let service: TravelItinerariesService
  let itineraryShareHandler: ItineraryShareHandler
  let twilioMessagingService: TwilioMessagingService
  let itinerariesRepository: TravelItinerariesRepository
  let destinationsRepository: TravelDestinationsRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TravelItinerariesService,
        TravelItinerariesRepository,
        TravelDestinationsRepository,
        ItineraryShareHandler,
        TwilioMessagingService,
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
    itineraryShareHandler = module.get<ItineraryShareHandler>(ItineraryShareHandler)
    twilioMessagingService = module.get<TwilioMessagingService>(TwilioMessagingService)
    itinerariesRepository = module.get<TravelItinerariesRepository>(TravelItinerariesRepository)
    destinationsRepository = module.get<TravelDestinationsRepository>(TravelDestinationsRepository)

    // Initialize mock data
    await destinationsRepository.onModuleInit()
  })

  it("should successfully share an itinerary via WhatsApp", async () => {
    // Spy on the share handler
    const shareItinerarySpy = jest.spyOn(itineraryShareHandler, "shareItineraryViaWhatsApp")
    
    // Spy on the Twilio messaging service
    const sendWhatsAppSpy = jest.spyOn(twilioMessagingService, "sendWhatsAppMessage")

    // Create a test itinerary first
    const destinations = await destinationsRepository.getAll()
    const { itineraryId } = await service.createItinerary({
      destinationName: destinations[0].name,
      numberOfDays: 2,
    })

    // Verify the itinerary exists
    const itinerary = await service.getItinerary(itineraryId)
    expect(itinerary).toBeDefined()

    // Share the itinerary via WhatsApp
    const result = await service.shareItineraryViaWhatsApp({
      itineraryId,
      phoneNumber: "1234567890", // Should be converted to +391234567890
      customMessage: "Here's your itinerary!",
    })

    // Verify the result
    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.phoneNumber).toBe("+391234567890") // Should include the default prefix
    expect(result.messageSid).toBe("MOCK_TWILIO_MESSAGE_SID_12345")
    expect(result.message).toContain("successfully sent")

    // Verify the handlers were called
    expect(shareItinerarySpy).toHaveBeenCalledWith({
      itineraryId,
      phoneNumber: "1234567890",
      customMessage: "Here's your itinerary!",
    })

    // Verify Twilio service was called with the correct parameters
    expect(sendWhatsAppSpy).toHaveBeenCalledTimes(1)
    expect(sendWhatsAppSpy).toHaveBeenCalledWith({
      body: expect.stringContaining(itinerary.destination.name),
      to: "+391234567890",
    })
  })

  it("should format phone numbers with international prefix", async () => {
    // Create a test itinerary first
    const destinations = await destinationsRepository.getAll()
    const { itineraryId } = await service.createItinerary({
      destinationName: destinations[0].name,
      numberOfDays: 1,
    })

    // Test various phone number formats
    const testCases = [
      { input: "1234567890", expected: "+391234567890" }, // No prefix -> Add +39
      { input: "+1234567890", expected: "+1234567890" }, // Already has + -> Keep as-is
      { input: "00491234567890", expected: "+491234567890" }, // 00 prefix -> Convert to +
    ]

    for (const testCase of testCases) {
      // Spy on the Twilio messaging service
      const sendWhatsAppSpy = jest.spyOn(twilioMessagingService, "sendWhatsAppMessage")
      
      // Share the itinerary
      const result = await service.shareItineraryViaWhatsApp({
        itineraryId,
        phoneNumber: testCase.input,
      })

      // Verify the phone number was formatted correctly
      expect(result.phoneNumber).toBe(testCase.expected)
      
      // Verify Twilio service was called with the correct phone number
      expect(sendWhatsAppSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: testCase.expected,
        })
      )
    }
  })

  it("should handle errors when sharing an itinerary", async () => {
    // Mock the Twilio service to throw an error
    jest.spyOn(twilioMessagingService, "sendWhatsAppMessage").mockRejectedValueOnce(
      new Error("Twilio API error")
    )

    // Create a test itinerary
    const destinations = await destinationsRepository.getAll()
    const { itineraryId } = await service.createItinerary({
      destinationName: destinations[0].name,
      numberOfDays: 1,
    })

    // Attempt to share the itinerary
    const result = await service.shareItineraryViaWhatsApp({
      itineraryId,
      phoneNumber: "1234567890",
    })

    // Verify the error result
    expect(result).toBeDefined()
    expect(result.success).toBe(false)
    expect(result.error).toBe("Twilio API error")
    expect(result.message).toContain("Failed to send itinerary")
  })

  it("should handle non-existent itinerary", async () => {
    // Attempt to share a non-existent itinerary
    const result = await service.shareItineraryViaWhatsApp({
      itineraryId: "non-existent-id",
      phoneNumber: "1234567890",
    })

    // Verify the error result
    expect(result).toBeDefined()
    expect(result.success).toBe(false)
    expect(result.error).toContain("not found")
  })
})