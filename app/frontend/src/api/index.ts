import { Settings } from "@/settings"
import { client } from "./backend/client.gen"

export const apiInitialize = () => {
  client.setConfig({
    baseUrl: Settings.backend.endpoint,
  })
}
