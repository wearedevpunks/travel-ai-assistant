import { Module } from "@nestjs/common"
import { TravelPlannerController } from "./travelPlanner.controller"
import { SharedModule } from "@/shared/module"
import { UserAssistantFeatureModule } from "@/features/user-assistant"
import { TravelItinerariesFeatureModule } from "@/features/travel-itineraries"
import { OpenaiAiIntegrationModule } from "@/integrations/ai/openai"

@Module({
  imports: [
    SharedModule,
    UserAssistantFeatureModule,
    TravelItinerariesFeatureModule,
    OpenaiAiIntegrationModule,
  ],
  controllers: [TravelPlannerController],
  providers: [],
})
export class TravelPlannerAppModule {}
