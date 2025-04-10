import { Settings } from "@/settings"
import { OpenAPI, TravelPlannerClient } from "./backend"

export class BackendApi {
  public readonly travelPlanner = TravelPlannerClient

  constructor() {
    this.setEndpoint(Settings.backend.endpoint)
  }

  setEndpoint(endpoint: string) {
    OpenAPI.BASE = endpoint
  }

  setToken(token: string) {
    OpenAPI.TOKEN = token
  }

  clearToken() {
    OpenAPI.TOKEN = undefined
  }

  getToken() {
    return OpenAPI.TOKEN
  }

  setHeader(key: string, value: string) {
    OpenAPI.HEADERS = {
      ...OpenAPI.HEADERS,
      [key]: value,
    }
  }
}

export const backendApi = new BackendApi()
