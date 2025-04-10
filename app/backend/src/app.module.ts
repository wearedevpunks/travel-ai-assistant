import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { SharedModule } from "./shared/module"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { FeatureModules } from "./features"
import { AppModules } from "./app"
import { AppExceptionsFilter } from "./shared/errors/middleware"
import { APP_FILTER } from "@nestjs/core"
import { ConfigModule } from "@nestjs/config"
import { IntegrationModules } from "./integrations"
import { InfrastructureModules } from "./infrastructure"
import { ConstructModules } from "./constructs"
import { CollectionModules } from "./collections"

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot({
      delimiter: ":",
      wildcard: true,
    }),
    ...CollectionModules,
    ...InfrastructureModules,
    ...IntegrationModules,
    ...ConstructModules,
    ...FeatureModules,
    ...AppModules,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionsFilter,
    },
  ],
})
export class AppModule {}
