import { Injectable, Logger } from "@nestjs/common"
import { TwilioMessagingService } from "../../../../../integrations/messaging/twilio/services/messaging"
import { TravelItinerariesRepository } from "../../../../../collections/mocked/repositories/itineraries.repository"

export interface ItineraryShareOptions {
  itineraryId: string
  phoneNumber: string
  customMessage?: string
}

export interface ItineraryShareResult {
  success: boolean
  messageSid?: string
  phoneNumber: string
  message: string
  error?: string
}

@Injectable()
export class ItineraryShareHandler {
  private readonly logger = new Logger(ItineraryShareHandler.name)

  constructor(
    private readonly itinerariesRepository: TravelItinerariesRepository,
    private readonly twilioMessagingService: TwilioMessagingService
  ) {}

  /**
   * Share an itinerary via WhatsApp
   * @param options The share options
   * @returns Result of the share operation
   */
  async shareItineraryViaWhatsApp(
    options: ItineraryShareOptions
  ): Promise<ItineraryShareResult> {
    try {
      this.logger.log(
        `Sharing itinerary ${options.itineraryId} via WhatsApp to ${options.phoneNumber}`
      )

      // Get the itinerary - will throw if not found
      const itinerary = await this.itinerariesRepository.getItinerary(
        options.itineraryId
      )
      if (!itinerary) {
        throw new Error(`Itinerary with ID ${options.itineraryId} not found`)
      }

      // Format the phone number with international prefix
      const formattedPhoneNumber = this.formatPhoneNumber(options.phoneNumber)

      // Format the itinerary as a clear text message
      const greeting = options.customMessage
        ? `${options.customMessage}\n\n`
        : `Here's your travel itinerary for ${itinerary.destination.name}!\n\n`

      let messageBody = `${greeting}*${itinerary.destination.name} Travel Itinerary*\n\n`

      // Add each day's activities
      itinerary.days.forEach((day, index) => {
        messageBody += `*Day ${index + 1}*:\n`

        if (day.activities && day.activities.length > 0) {
          day.activities.forEach((activity) => {
            const timeStr = activity.hours ? ` (${activity.hours} hrs)` : ""
            messageBody += `• ${activity.description}${timeStr}\n`
          })
        } else {
          messageBody += "• No activities planned yet\n"
        }

        messageBody += "\n"
      })

      // Add footer
      messageBody += "Enjoy your trip! 🌍✈️"

      // Send the formatted message via WhatsApp
      const messageSid = await this.twilioMessagingService.sendWhatsAppMessage({
        body: messageBody,
        to: formattedPhoneNumber,
      })

      this.logger.log(
        `Successfully shared itinerary ${options.itineraryId} via WhatsApp (${messageSid})`
      )

      return {
        success: true,
        messageSid,
        phoneNumber: formattedPhoneNumber,
        message: `Itinerary successfully sent to ${formattedPhoneNumber} via WhatsApp`,
      }
    } catch (error) {
      this.logger.error(
        `Failed to share itinerary ${options.itineraryId} via WhatsApp: ${error.message}`,
        error.stack
      )

      return {
        success: false,
        phoneNumber: options.phoneNumber,
        error: error.message,
        message: `Failed to send itinerary: ${error.message}`,
      }
    }
  }

  /**
   * Format phone number with international prefix
   * Adds +39 as default prefix if no international prefix is specified
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any whitespace
    const trimmedNumber = phoneNumber.replace(/\s+/g, "")

    // If already has a plus, assume it's already formatted correctly
    if (trimmedNumber.startsWith("+")) {
      return trimmedNumber
    }

    // If starts with 00, replace with +
    if (trimmedNumber.startsWith("00")) {
      return `+${trimmedNumber.substring(2)}`
    }

    // Otherwise add default +39 Italian prefix
    return `+39${trimmedNumber}`
  }
}
