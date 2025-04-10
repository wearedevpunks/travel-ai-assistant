import { ApiProperty } from "@nestjs/swagger"

export class TravelDestination {
  @ApiProperty({ description: "The unique identifier for the destination" })
  id: string

  @ApiProperty({ description: "The name of the destination" })
  name: string

  @ApiProperty({ description: "The country of the destination" })
  country: string

  @ApiProperty({ description: "The continent of the destination" })
  continent: string

  @ApiProperty({
    description: "A description of the destination",
    required: false,
  })
  description?: string
}

export class TravelItineraryActivity {
  @ApiProperty({ description: "The activity description" })
  description: string

  @ApiProperty({ 
    description: "Estimated duration in hours", 
    required: false 
  })
  hours?: number
}

export class TravelItineraryDay {
  @ApiProperty({ description: "The unique identifier for the day" })
  id: string

  @ApiProperty({
    description: "List of activities for the day",
    type: [TravelItineraryActivity],
  })
  activities: TravelItineraryActivity[]
}

export class TravelItineraryDestinationPicture {
  @ApiProperty({ description: "The URL of the picture" })
  url: string

  @ApiProperty({ description: "The photographer of the picture" })
  photographer: string

  @ApiProperty({ description: "The alternative text of the picture" })
  alt: string
}

export class TravelItineraryDestination {
  @ApiProperty({ description: "The unique identifier for the destination" })
  id: string

  @ApiProperty({ description: "The name of the destination" })
  name: string

  @ApiProperty({ description: "The country of the destination" })
  country: string

  @ApiProperty({ description: "The continent of the destination" })
  continent: string

  @ApiProperty({
    description: "The picture URL of the destination",
    required: false,
  })
  picture?: TravelItineraryDestinationPicture
}

export class TravelItinerary {
  @ApiProperty({ description: "The unique identifier for the itinerary" })
  id: string

  @ApiProperty({ description: "The destination ID of the itinerary" })
  destination: TravelItineraryDestination

  @ApiProperty({
    description: "List of days in the itinerary",
    type: [TravelItineraryDay],
  })
  days: TravelItineraryDay[]
}
