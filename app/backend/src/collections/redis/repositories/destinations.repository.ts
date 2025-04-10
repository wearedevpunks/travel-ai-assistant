import { Injectable, OnModuleInit } from "@nestjs/common"
import { TravelDestination } from "../entities/destination.entity"
import { newUuid } from "@punks/backend-core"
import Redis from "ioredis"
import { Settings } from "../../../settings"

@Injectable()
export class TravelDestinationsRepository implements OnModuleInit {
  private readonly redis: Redis
  private readonly destinationsKey = "destinations"
  private destinations: TravelDestination[] = []

  constructor() {
    this.redis = new Redis(Settings.getRedisUrl())
  }

  // Initialize with mock data on module initialization
  async onModuleInit() {
    // Try to load destinations from Redis first
    const storedDestinations = await this.redis.get(this.destinationsKey)
    
    if (storedDestinations) {
      this.destinations = JSON.parse(storedDestinations)
    } else {
      // If no destinations found in Redis, create and store mock data
      this.initializeMockDestinations()
      await this.redis.set(this.destinationsKey, JSON.stringify(this.destinations))
    }
  }

  private initializeMockDestinations() {
    const continents = [
      "Europe",
      "Asia",
      "North America",
      "South America",
      "Africa",
      "Oceania",
    ]
    const europeanCountries = [
      "France",
      "Italy",
      "Spain",
      "Greece",
      "Germany",
      "Portugal",
      "Netherlands",
      "Switzerland",
      "Austria",
      "Belgium",
    ]
    const asianCountries = [
      "Japan",
      "Thailand",
      "Vietnam",
      "India",
      "China",
      "South Korea",
      "Indonesia",
      "Malaysia",
      "Singapore",
      "Philippines",
    ]
    const northAmericanCountries = [
      "USA",
      "Canada",
      "Mexico",
      "Costa Rica",
      "Jamaica",
      "Cuba",
      "Panama",
      "Bahamas",
      "Puerto Rico",
      "Dominican Republic",
    ]
    const southAmericanCountries = [
      "Brazil",
      "Argentina",
      "Peru",
      "Chile",
      "Colombia",
      "Ecuador",
      "Bolivia",
      "Uruguay",
      "Venezuela",
      "Paraguay",
    ]
    const africanCountries = [
      "Morocco",
      "Egypt",
      "South Africa",
      "Tanzania",
      "Kenya",
      "Ethiopia",
      "Ghana",
      "Senegal",
      "Namibia",
      "Botswana",
    ]
    const oceanianCountries = [
      "Australia",
      "New Zealand",
      "Fiji",
      "Samoa",
      "Solomon Islands",
      "Vanuatu",
      "Papua New Guinea",
      "Tonga",
      "Palau",
      "Marshall Islands",
    ]

    const countriesByContinent = {
      Europe: europeanCountries,
      Asia: asianCountries,
      "North America": northAmericanCountries,
      "South America": southAmericanCountries,
      Africa: africanCountries,
      Oceania: oceanianCountries,
    }

    const cityNames = {
      France: ["Paris", "Nice", "Lyon", "Marseille", "Bordeaux"],
      Italy: ["Rome", "Venice", "Florence", "Milan", "Naples"],
      Spain: ["Barcelona", "Madrid", "Seville", "Valencia", "Malaga"],
      Greece: ["Athens", "Santorini", "Mykonos", "Crete", "Rhodes"],
      Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
      Portugal: ["Lisbon", "Porto", "Faro", "Madeira", "Coimbra"],
      Netherlands: [
        "Amsterdam",
        "Rotterdam",
        "The Hague",
        "Utrecht",
        "Eindhoven",
      ],
      Switzerland: ["Zurich", "Geneva", "Lucerne", "Bern", "Lausanne"],
      Austria: ["Vienna", "Salzburg", "Innsbruck", "Graz", "Hallstatt"],
      Belgium: ["Brussels", "Bruges", "Antwerp", "Ghent", "Leuven"],
      Japan: ["Tokyo", "Kyoto", "Osaka", "Hokkaido", "Hiroshima"],
      Thailand: ["Bangkok", "Phuket", "Chiang Mai", "Krabi", "Koh Samui"],
      Vietnam: [
        "Hanoi",
        "Ho Chi Minh City",
        "Hoi An",
        "Da Nang",
        "Ha Long Bay",
      ],
      India: ["Mumbai", "Delhi", "Jaipur", "Agra", "Goa"],
      China: ["Beijing", "Shanghai", "Hong Kong", "Xi'an", "Guangzhou"],
      "South Korea": ["Seoul", "Busan", "Jeju Island", "Gyeongju", "Daegu"],
      Indonesia: ["Bali", "Jakarta", "Yogyakarta", "Lombok", "Raja Ampat"],
      Malaysia: ["Kuala Lumpur", "Penang", "Langkawi", "Malacca", "Borneo"],
      Singapore: [
        "Singapore City",
        "Sentosa Island",
        "Gardens by the Bay",
        "Marina Bay",
        "Jurong",
      ],
      Philippines: ["Manila", "Palawan", "Boracay", "Cebu", "Bohol"],
      USA: ["New York", "Los Angeles", "San Francisco", "Miami", "Las Vegas"],
      Canada: ["Toronto", "Vancouver", "Montreal", "Quebec City", "Calgary"],
      Mexico: [
        "Mexico City",
        "Cancun",
        "Puerto Vallarta",
        "Playa del Carmen",
        "Tulum",
      ],
      "Costa Rica": [
        "San Jose",
        "Tamarindo",
        "Monteverde",
        "Arenal",
        "Manuel Antonio",
      ],
      Jamaica: [
        "Kingston",
        "Montego Bay",
        "Negril",
        "Ocho Rios",
        "Port Antonio",
      ],
      Cuba: [
        "Havana",
        "Varadero",
        "Trinidad",
        "Santiago de Cuba",
        "Cienfuegos",
      ],
      Panama: [
        "Panama City",
        "Bocas del Toro",
        "Boquete",
        "San Blas Islands",
        "El Valle de Anton",
      ],
      Bahamas: ["Nassau", "Grand Bahama", "Exuma", "Eleuthera", "Bimini"],
      "Puerto Rico": ["San Juan", "Ponce", "Rincon", "Vieques", "Culebra"],
      "Dominican Republic": [
        "Punta Cana",
        "Santo Domingo",
        "Puerto Plata",
        "Samana",
        "La Romana",
      ],
      Brazil: [
        "Rio de Janeiro",
        "Sao Paulo",
        "Salvador",
        "Florianopolis",
        "Manaus",
      ],
      Argentina: ["Buenos Aires", "Mendoza", "Bariloche", "Cordoba", "Ushuaia"],
      Peru: ["Lima", "Cusco", "Machu Picchu", "Arequipa", "Iquitos"],
      Chile: [
        "Santiago",
        "Valparaiso",
        "Patagonia",
        "Easter Island",
        "Atacama Desert",
      ],
      Colombia: ["Bogota", "Cartagena", "Medellin", "Cali", "Santa Marta"],
      Ecuador: ["Quito", "Guayaquil", "Cuenca", "Galapagos Islands", "Banos"],
      Bolivia: ["La Paz", "Sucre", "Uyuni", "Lake Titicaca", "Santa Cruz"],
      Uruguay: [
        "Montevideo",
        "Punta del Este",
        "Colonia del Sacramento",
        "Piriapolis",
        "Cabo Polonio",
      ],
      Venezuela: [
        "Caracas",
        "Margarita Island",
        "Merida",
        "Los Roques",
        "Angel Falls",
      ],
      Paraguay: [
        "Asuncion",
        "Ciudad del Este",
        "Encarnacion",
        "Concepcion",
        "San Bernardino",
      ],
      Morocco: ["Marrakech", "Fes", "Casablanca", "Essaouira", "Chefchaouen"],
      Egypt: ["Cairo", "Luxor", "Alexandria", "Aswan", "Sharm El Sheikh"],
      "South Africa": [
        "Cape Town",
        "Johannesburg",
        "Durban",
        "Kruger National Park",
        "Garden Route",
      ],
      Tanzania: [
        "Dar es Salaam",
        "Zanzibar",
        "Serengeti",
        "Kilimanjaro",
        "Arusha",
      ],
      Kenya: ["Nairobi", "Mombasa", "Masai Mara", "Lamu", "Lake Nakuru"],
      Ethiopia: [
        "Addis Ababa",
        "Lalibela",
        "Gondar",
        "Axum",
        "Danakil Depression",
      ],
      Ghana: ["Accra", "Kumasi", "Cape Coast", "Elmina", "Tamale"],
      Senegal: ["Dakar", "Saint-Louis", "Goree Island", "Casamance", "Saly"],
      Namibia: [
        "Windhoek",
        "Swakopmund",
        "Sossusvlei",
        "Etosha National Park",
        "Fish River Canyon",
      ],
      Botswana: [
        "Gaborone",
        "Maun",
        "Okavango Delta",
        "Chobe National Park",
        "Kasane",
      ],
      Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Gold Coast"],
      "New Zealand": [
        "Auckland",
        "Wellington",
        "Queenstown",
        "Christchurch",
        "Rotorua",
      ],
      Fiji: ["Suva", "Nadi", "Mamanuca Islands", "Yasawa Islands", "Taveuni"],
      Samoa: ["Apia", "Savaii", "Upolu", "Manono", "Apolima"],
      "Solomon Islands": ["Honiara", "Gizo", "Auki", "Munda", "Tulagi"],
      Vanuatu: ["Port Vila", "Espiritu Santo", "Tanna", "Malekula", "Efate"],
      "Papua New Guinea": [
        "Port Moresby",
        "Lae",
        "Mount Hagen",
        "Madang",
        "Goroka",
      ],
      Tonga: ["Nuku'alofa", "Vava'u", "Ha'apai", "Eua", "Niuatoputapu"],
      Palau: ["Koror", "Peleliu", "Angaur", "Melekeok", "Babeldaob"],
      "Marshall Islands": [
        "Majuro",
        "Kwajalein",
        "Jaluit",
        "Wotje",
        "Maloelap",
      ],
    }

    let count = 0

    // Generate 100 destination entries
    for (const continent of continents) {
      const countries = countriesByContinent[continent]

      for (const country of countries) {
        const cities = cityNames[country]

        for (const city of cities) {
          const id = newUuid()
          const destination: TravelDestination = {
            id,
            name: city,
            country,
            continent,
            description: `${city} is a beautiful destination in ${country}, ${continent}.`,
          }

          this.destinations.push(destination)
          count++
          
          // Stop if we've added 100 destinations
          if (count >= 100) {
            break
          }
        }
        
        if (count >= 100) {
          break
        }
      }
      
      if (count >= 100) {
        break
      }
    }
  }

  async getAll(continent?: string): Promise<TravelDestination[]> {
    if (!continent) {
      return this.destinations
    }
    
    // Filter by continent (case insensitive)
    const lowercaseContinent = continent.toLowerCase()
    return this.destinations.filter(
      dest => dest.continent.toLowerCase() === lowercaseContinent
    )
  }

  async get(id: string): Promise<TravelDestination | undefined> {
    return this.destinations.find(dest => dest.id === id)
  }

  async search(name: string): Promise<TravelDestination[]> {
    // Filter by name (case insensitive)
    const lowercaseName = name.toLowerCase()
    return this.destinations.filter(dest => 
      dest.name.toLowerCase().includes(lowercaseName)
    )
  }
}
