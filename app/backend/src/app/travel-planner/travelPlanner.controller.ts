import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  Res,
  Param,
  NotFoundException,
} from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { Response } from "express"
import { executeStreamedCompletionAndStream } from "@/integrations/ai/vercel/utils/response"
import {
  executeStreamedSpeechAndStream,
  executeSpeechToTextAndReturn,
} from "@/integrations/ai/openai/utils/response"
import {
  addDayToItinerary,
  addItemToItinerary,
  createTravelItinerary,
  getTravelDestinations,
  removeDayFromItinerary,
  sendItineraryViaWhatsApp,
  setTravelItinerariesService,
} from "./travelPlanner.tools"
import { UserAssistantService } from "@/features/user-assistant/services/assistant"
import {
  UserAssistantAIChatRequest,
  UserAssistantTextToSpeechRequest,
  UserAssistantSpeechToTextRequest,
  UserAssistantSpeechToTextResponse,
} from "@/features/user-assistant/handlers/ai-conversation/dto"
import { TravelItinerary } from "./travelPlanner.dto"
import { TravelItinerariesService } from "@/features/travel-itineraries/services/itineraries"
import { travelPlannerSystemPrompt } from "./travelPlanner.prompts"

@ApiTags("Travel Planner")
@Controller("v1/travel-planner")
export class TravelPlannerController {
  constructor(
    private readonly userAssistantService: UserAssistantService,
    private readonly itinerariesService: TravelItinerariesService
  ) {
    // Inject repositories into the tools
    setTravelItinerariesService(this.itinerariesService)
  }

  @Post("chat")
  @ApiOperation({
    operationId: "travelPlannerChatSend",
    summary: "Chat with AI in streaming mode",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns streamed AI response",
  })
  async aiChat(
    @Body() request: UserAssistantAIChatRequest,
    @Res() res: Response
  ) {
    await executeStreamedCompletionAndStream(res, async () => {
      return await this.userAssistantService.createStreamedCompletion({
        userRequest: request,
        definition: {
          systemPrompt: travelPlannerSystemPrompt,
          additionalTools: {
            getTravelDestinations,
            createTravelItinerary,
            addItemToItinerary,
            addDayToItinerary,
            removeDayFromItinerary,
            sendItineraryViaWhatsApp,
          },
        },
      })
    })
  }

  @Post("tts")
  @ApiOperation({
    operationId: "travelPlannerTtsSend",
    summary: "Convert text to speech",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns streamed audio response",
  })
  async textToSpeech(
    @Body() request: UserAssistantTextToSpeechRequest,
    @Res() res: Response
  ) {
    await executeStreamedSpeechAndStream(res, async () => {
      return await this.userAssistantService.createTextToSpeech(request)
    })
  }

  @Post("stt")
  @ApiOperation({
    operationId: "travelPlannerSttSend",
    summary: "Convert speech to text",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns transcribed text",
    type: UserAssistantSpeechToTextResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid audio data",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Server error in processing speech",
  })
  async speechToText(
    @Body() request: UserAssistantSpeechToTextRequest,
    @Res() res: Response
  ) {
    await executeSpeechToTextAndReturn<UserAssistantSpeechToTextResponse>(
      res,
      async () => {
        return await this.userAssistantService.createSpeechToText(request)
      }
    )
  }

  @Get("itinerary/:id")
  @ApiOperation({
    operationId: "travelPlannerItineraryGet",
    summary: "Get travel itinerary by ID",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns the travel itinerary",
    type: TravelItinerary,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Itinerary not found",
  })
  async getItinerary(@Param("id") id: string): Promise<TravelItinerary> {
    const itinerary = await this.itinerariesService.getItinerary(id)
    if (!itinerary) {
      throw new NotFoundException(`Itinerary with ID ${id} not found`)
    }

    return itinerary
  }
}
