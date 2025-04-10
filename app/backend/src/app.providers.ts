import { Global, Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { SharedModule } from "./shared/module"

@Global()
@Module({
  imports: [SharedModule, CqrsModule],
  exports: [CqrsModule],
})
export class AppProvidersModule {}
