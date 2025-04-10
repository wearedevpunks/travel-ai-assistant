// Mock the external modules that the handlers depend on
import { TravelDestination } from "../../../../../collections/redis/entities/destination.entity"

// Mock @/integrations/pictures/pexels module
jest.mock("@/integrations/pictures/pexels", () => ({
  searchPexelPicture: jest.fn().mockResolvedValue({
    url: "https://example.com/image.jpg",
    photographer: "Test Photographer",
    alt: "Test Alt Text",
  }),
}))

// Mock settings module
jest.mock("@/settings", () => ({
  Settings: {
    getPexelsApiKey: jest.fn().mockReturnValue("test-api-key"),
    getMongoDbUri: jest.fn().mockReturnValue("mongodb://localhost:27017/test"),
    getRequiredEnvVariable: jest.fn().mockReturnValue("test-value"),
  },
}))

// Helper functions to create test data
export const createMockDestination = (
  overrides?: Partial<TravelDestination>
): TravelDestination => ({
  id: `dest-${Math.random().toString(36).substring(2, 9)}`,
  name: "Paris",
  country: "France",
  continent: "Europe",
  description: "Paris is a beautiful destination in France, Europe.",
  ...overrides,
})

export const createMockItineraryDestination = (source: TravelDestination) => ({
  id: source.id,
  name: source.name,
  country: source.country,
  continent: source.continent,
  picture: {
    url: "https://example.com/image.jpg",
    photographer: "Test Photographer",
    alt: "Test Alt Text",
  },
})

// Re-export the mocked modules for easy access
export const mockedModules = {
  pexels: require("@/integrations/pictures/pexels"),
  backendCore: require("@punks/backend-core"),
  settings: require("@/settings"),
}
