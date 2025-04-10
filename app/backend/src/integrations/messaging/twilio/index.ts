import { SharedModule } from "@/shared/module"
import { Module } from "@nestjs/common"
import { TwilioServices } from "./services"

@Module({
  imports: [SharedModule],
  providers: [...TwilioServices],
  exports: [...TwilioServices],
})
export class TwilioIntegrationModule {}
