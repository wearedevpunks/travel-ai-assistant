import { Module } from "@nestjs/common"
import { AiOpenaiServices } from "./services"
import { SharedModule } from "@/shared/module"
import { OpenaiAiHandlers } from "./handlers"

@Module({
  imports: [SharedModule],
  providers: [...AiOpenaiServices, ...OpenaiAiHandlers],
  exports: [...AiOpenaiServices],
})
export class OpenaiAiIntegrationModule {}
