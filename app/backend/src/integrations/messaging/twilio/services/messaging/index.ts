import { Settings } from "../../../../../settings"
import { Injectable, Logger } from "@nestjs/common"
import { Twilio } from "twilio"

interface WhatsAppMessageOptions {
  body: string
  to: string
  from?: string
}

@Injectable()
export class TwilioMessagingService {
  private readonly logger = new Logger(TwilioMessagingService.name)

  /**
   * Send a WhatsApp message using Twilio
   * @param options Message options including body and recipient number
   * @returns The message SID if successful
   */
  async sendWhatsAppMessage(options: WhatsAppMessageOptions): Promise<string> {
    try {
      // Format the to number if it doesn't already have the whatsapp: prefix
      const toNumber = options.to.startsWith("whatsapp:")
        ? options.to
        : `whatsapp:${options.to}`

      // Use provided from number or default
      const defaultFromNumber = `${Settings.getTwilioWhatsAppFrom()}`
      const fromNumber = options.from || defaultFromNumber

      this.logger.log(`Sending WhatsApp message to ${toNumber}`)

      const client = this.getClient()
      const message = await client.messages.create({
        body: options.body,
        from: fromNumber,
        to: toNumber,
      })

      this.logger.log(`WhatsApp message sent successfully: ${message.sid}`)
      return message.sid
    } catch (error) {
      this.logger.error(
        `Failed to send WhatsApp message: ${error.message}`,
        error.stack
      )
      throw new Error(`Failed to send WhatsApp message: ${error.message}`)
    }
  }

  private getClient(): Twilio {
    // Initialize Twilio client with environment variables
    const accountSid = Settings.getTwilioAccountSid()
    const authToken = Settings.getTwilioAuthToken()

    if (!accountSid || !authToken) {
      this.logger.warn(
        "Twilio credentials not found in environment. WhatsApp messaging will not work."
      )
    }

    return new Twilio(accountSid, authToken)
  }
}
