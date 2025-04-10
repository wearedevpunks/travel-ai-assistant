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
import {
  TravelItinerary,
  TravelAssistantAIChatRequest,
  TravelAssistantSpeechToTextRequest,
  TravelAssistantSpeechToTextResponse,
  TravelAssistantTextToSpeechRequest,
} from "./travelPlanner.dto"
import { TravelItinerariesService } from "@/features/travel-itineraries/services/itineraries"
import { travelPlannerSystemPrompt } from "./travelPlanner.prompts"
import { CoreMessage, streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { Settings } from "@/settings"
import { AiOpenaiSpeechService } from "@/integrations/ai/openai/services/speech"
import { executeStreamedCompletionAndStream } from "@/integrations/ai/vercel/utils"

@ApiTags("Travel Planner")
@Controller("v1/travel-planner")
export class TravelPlannerController {
  constructor(
    private readonly itinerariesService: TravelItinerariesService,
    private readonly aiOpenaiSpeechService: AiOpenaiSpeechService
  ) {
    // Inject itinerary service into the tools
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
    @Body() request: TravelAssistantAIChatRequest,
    @Res() res: Response
  ) {
    await executeStreamedCompletionAndStream(res, async () => {
      const openai = createOpenAI({
        compatibility: "strict",
        apiKey: Settings.getOpenAiApiKey(),
      })

      return streamText({
        model: openai("gpt-4o-mini"),
        system: travelPlannerSystemPrompt,
        messages: request.messages as CoreMessage[],
        tools: {
          getTravelDestinations,
          createTravelItinerary,
          addItemToItinerary,
          addDayToItinerary,
          removeDayFromItinerary,
          sendItineraryViaWhatsApp,
        },
        maxSteps: 1, // this is the maximum number that the model is allowed to invoke tools
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
    @Body() request: TravelAssistantTextToSpeechRequest,
    @Res() res: Response
  ) {
    await executeStreamedSpeechAndStream(res, async () => {
      return await this.aiOpenaiSpeechService.convertTextToSpeech({
        model: "tts-1",
        input: request.text,
        voice: request.voice || "alloy",
        response_format: request.responseFormat || ("mp3" as const),
        speed: request.speed || 1.0,
        instructions: request.instructions,
      })
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
    type: TravelAssistantSpeechToTextResponse,
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
    @Body() request: TravelAssistantSpeechToTextRequest,
    @Res() res: Response
  ) {
    await executeSpeechToTextAndReturn<TravelAssistantSpeechToTextResponse>(
      res,
      async () => {
        // Convert base64 string to File object
        const base64Data = request.audioData.split(",")[1] || request.audioData
        const binaryData = Buffer.from(base64Data, "base64")
        const blob = new Blob([binaryData], { type: "audio/webm" })

        // Create a File object from the Blob
        const file = new File([blob], "speech.webm", { type: "audio/webm" })

        // Send to OpenAI for transcription
        const result = await this.aiOpenaiSpeechService.convertSpeechToText({
          model: request.model || "whisper-1",
          language: request.language,
          input: file,
        })

        // Create a properly typed response
        return {
          text: result.text,
          language: request.language,
        }
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
