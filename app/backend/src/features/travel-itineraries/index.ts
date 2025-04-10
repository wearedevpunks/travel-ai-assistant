import { SharedModule } from "@/shared/module"
import { Module } from "@nestjs/common"
import { TravelItinerariesServices } from "./services"
import { TravelItinerariesHandlers } from "./handlers"
import { MockedCollectionsModule } from "@/collections/mocked"
import { TwilioIntegrationModule } from "@/integrations/messaging/twilio"

@Module({
  imports: [SharedModule, MockedCollectionsModule, TwilioIntegrationModule],
  providers: [...TravelItinerariesServices, ...TravelItinerariesHandlers],
  exports: [...TravelItinerariesServices],
})
export class TravelItinerariesFeatureModule {}
