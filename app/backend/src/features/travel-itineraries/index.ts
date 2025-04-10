import { SharedModule } from "../../shared/module"
import { Module } from "@nestjs/common"
import { TravelItinerariesServices } from "./services"
import { TravelItinerariesHandlers } from "./handlers"
import { RedisCollectionsModule } from "../../collections/redis"
import { TwilioIntegrationModule } from "../../integrations/messaging/twilio"

@Module({
  imports: [SharedModule, RedisCollectionsModule, TwilioIntegrationModule],
  providers: [...TravelItinerariesServices, ...TravelItinerariesHandlers],
  exports: [...TravelItinerariesServices],
})
export class TravelItinerariesFeatureModule {}
