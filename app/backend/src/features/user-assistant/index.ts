import { Module } from "@nestjs/common"
import { UserAssistantServices } from "./services"
import { UserAssistantHandlers } from "./handlers"
import { SharedModule } from "@/shared/module"
import { VercelAiIntegrationModule } from "@/integrations/ai/vercel"
import { OpenaiAiIntegrationModule } from "@/integrations/ai/openai"

@Module({
  imports: [SharedModule, VercelAiIntegrationModule, OpenaiAiIntegrationModule],
  providers: [...UserAssistantServices, ...UserAssistantHandlers],
  exports: [...UserAssistantServices],
})
export class UserAssistantFeatureModule {}