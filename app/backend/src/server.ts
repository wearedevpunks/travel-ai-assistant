import { INestApplication } from "@nestjs/common"
import {
  ConsoleLogger,
  DatadogLogger,
  FileLogger,
  Log,
  LogLevel,
  MetaSerializationType,
} from "@punks/backend-core"
import { setupSwagger } from "./infrastructure/swagger/initialize"
import { Settings } from "./settings"

const initializeLogger = () => {
  const logLevel = (process.env.LOG_LEVEL as LogLevel) ?? LogLevel.Info
  Log.configure({
    provider: new ConsoleLogger(),
    options: {
      enabled: true,
      level: logLevel,
      maxMetaLength: 1000,
      serialization:
        process.env.LOGGING_SERIALIZE_META === "true"
          ? MetaSerializationType.JSON
          : MetaSerializationType.None,
    },
  })

  if (Settings.getDatadogLoggingEnabled()) {
    Log.configure({
      provider: new DatadogLogger({
        datadog: {
          apiKey: process.env.DATADOG_API_KEY!,
          site: process.env.DATADOG_SITE!,
        },
        service: {
          appName: process.env.APP_NAME!,
          roleName: process.env.ROLE_NAME!,
          serviceName: process.env.SERVICE_NAME!,
          environmentName: process.env.ENVIRONMENT_NAME!,
        },
      }),
      options: {
        enabled: process.env.DATADOG_ENABLED === "true",
        level: logLevel,
        serialization: MetaSerializationType.None,
      },
    })
  }

  if (Settings.getFileLoggingEnabled()) {
    Log.configure({
      provider: new FileLogger({
        service: {
          appName: process.env.APP_NAME!,
          roleName: process.env.ROLE_NAME!,
          serviceName: process.env.SERVICE_NAME!,
          environmentName: process.env.ENVIRONMENT_NAME!,
        },
      }),
      options: {
        enabled: process.env.FILE_LOGGING_ENABLED === "true",
        level: logLevel,
        serialization: MetaSerializationType.None,
      },
    })
  }

  Log.getLogger("Main").info(`Logging initialized -> level:${logLevel}`)
}

const initializeSwagger = (app: INestApplication) => {
  if (Settings.getSwaggerEnabled()) {
    Log.getLogger("Main").info("Setting up swagger")
    setupSwagger(app, {
      apiPath: "swagger",
      description: "DuckAround Api",
      title: "DuckAround Api",
      version: "1.0",
    })
  } else {
    Log.getLogger("Main").info("Swagger is disabled")
  }
}

export const setupServer = async (app: INestApplication) => {
  try {
    initializeLogger()

    initializeSwagger(app)

    await app.init()

    return {
      success: true,
    }
  } catch (error) {
    Log.getLogger("Main").exception(
      "Failed to initialize entity manager",
      error
    )
    return {
      success: false,
      reason: error.message,
    }
  }
}
