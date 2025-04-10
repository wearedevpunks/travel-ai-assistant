/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserAssistantTextToSpeechRequest = {
    /**
     * The text to convert to speech
     */
    text: string;
    /**
     * The voice to use for the speech
     */
    voice?: string;
    /**
     * The speed of the speech
     */
    speed?: number;
    /**
     * Additional instructions for the speech
     */
    instructions?: string;
    /**
     * The response format of the audio
     */
    responseFormat?: Record<string, any>;
};

