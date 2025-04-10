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
