import "source-map-support/register"
import { NestFactory } from "@nestjs/core"
import { Log, logMemoryUsage } from "@punks/backend-core"
import { AppModule } from "./app.module"
import { setupServer } from "./server"
import { json } from "express"

async function bootstrap() {
  const start = new Date().getTime()

  const app = await NestFactory.create(AppModule, { cors: true })

  // Increase payload size limit for file uploads (100MB)
  app.use(json({ limit: "100mb" }))

  const initializationResult = await setupServer(app)

  if (!initializationResult.success) {
    Log.getLogger("Main").error(
      `App failed to start -> ${initializationResult.reason}`
    )
    process.exit(1)
  }

  const port = process.env.HTTP_PORT || 3000
  await app.listen(port)
  const end = new Date().getTime()
  Log.getLogger("Main").info(
    `App started -> \nEndpoint: http://localhost:${port}/ \nBootstrap time: ${
      end - start
    }ms`
  )
  logMemoryUsage()
}

bootstrap()
