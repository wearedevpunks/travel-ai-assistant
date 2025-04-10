import { Module } from "@nestjs/common"
import { TravelPlannerController } from "./travelPlanner.controller"
import { SharedModule } from "@/shared/module"
import { TravelItinerariesFeatureModule } from "@/features/travel-itineraries"
import { OpenaiAiIntegrationModule } from "@/integrations/ai/openai"

@Module({
  imports: [
    SharedModule,
    TravelItinerariesFeatureModule,
    OpenaiAiIntegrationModule,
  ],
  controllers: [TravelPlannerController],
})
export class TravelPlannerAppModule {}
