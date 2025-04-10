import { AiIntegrationModules } from "./ai"
import { MessagingIntegrationModules } from "./messaging"
import { PicturesIntegrationModules } from "./pictures"

export const IntegrationModules = [
  ...AiIntegrationModules,
  ...PicturesIntegrationModules,
  ...MessagingIntegrationModules,
]
