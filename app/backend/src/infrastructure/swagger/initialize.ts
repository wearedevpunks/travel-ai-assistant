import { INestApplication } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { writeFileSync } from "fs"

export type SwaggerOptions = {
  apiPath: string
  title: string
  description: string
  version: string
}

export const setupSwagger = (
  app: INestApplication,
  options: SwaggerOptions
) => {
  const config = new DocumentBuilder()
    .setTitle(options.title)
    .setDescription(options.description)
    .setVersion(options.version)
    .build()
  const document = SwaggerModule.createDocument(app, config)
  writeFileSync("./api-spec.json", JSON.stringify(document))
  SwaggerModule.setup(options.apiPath, app, document)
}
