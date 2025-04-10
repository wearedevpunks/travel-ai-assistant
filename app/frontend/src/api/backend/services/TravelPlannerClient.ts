/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TravelItinerary } from '../models/TravelItinerary';
import type { UserAssistantAIChatRequest } from '../models/UserAssistantAIChatRequest';
import type { UserAssistantSpeechToTextRequest } from '../models/UserAssistantSpeechToTextRequest';
import type { UserAssistantSpeechToTextResponse } from '../models/UserAssistantSpeechToTextResponse';
import type { UserAssistantTextToSpeechRequest } from '../models/UserAssistantTextToSpeechRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TravelPlannerClient {
    /**
     * Chat with AI in streaming mode
     * @param requestBody
     * @returns any Returns streamed AI response
     * @throws ApiError
     */
    public static travelPlannerChatSend(
        requestBody: UserAssistantAIChatRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/travel-planner/chat',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Convert text to speech
     * @param requestBody
     * @returns any Returns streamed audio response
     * @throws ApiError
     */
    public static travelPlannerTtsSend(
        requestBody: UserAssistantTextToSpeechRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/travel-planner/tts',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Convert speech to text
     * @param requestBody
     * @returns UserAssistantSpeechToTextResponse Returns transcribed text
     * @throws ApiError
     */
    public static travelPlannerSttSend(
        requestBody: UserAssistantSpeechToTextRequest,
    ): CancelablePromise<UserAssistantSpeechToTextResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/travel-planner/stt',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid audio data`,
                500: `Server error in processing speech`,
            },
        });
    }
    /**
     * Get travel itinerary by ID
     * @param id
     * @returns TravelItinerary Returns the travel itinerary
     * @throws ApiError
     */
    public static travelPlannerItineraryGet(
        id: string,
    ): CancelablePromise<TravelItinerary> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/travel-planner/itinerary/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Itinerary not found`,
            },
        });
    }
}
