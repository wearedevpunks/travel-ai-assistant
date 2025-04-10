import { Module } from "@nestjs/common"
import { TravelPlannerController } from "./travelPlanner.controller"
import { UserConversationConstructModule } from "@/constructs/user-conversation/module"
import { SharedModule } from "@/shared/module"
import { UserAssistantFeatureModule } from "@/features/user-assistant"
import { TravelItinerariesFeatureModule } from "@/features/travel-itineraries"

@Module({
  imports: [
    SharedModule,
    UserAssistantFeatureModule,
    UserConversationConstructModule,
    TravelItinerariesFeatureModule,
  ],
  controllers: [TravelPlannerController],
  providers: [],
})
export class TravelPlannerAppModule {}
