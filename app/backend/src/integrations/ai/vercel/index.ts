import { Module } from "@nestjs/common"
import { AiVercelServices } from "./services"
import { SharedModule } from "@/shared/module"
import { AiVercelProviders } from "./providers"
import { VercelAiHandlers } from "./handlers"

@Module({
  imports: [SharedModule],
  providers: [...AiVercelServices, ...AiVercelProviders, ...VercelAiHandlers],
  exports: [...AiVercelServices],
})
export class VercelAiIntegrationModule {}
