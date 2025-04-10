/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserAssistantSpeechToTextRequest = {
    /**
     * The audio file to transcribe (Base64 encoded)
     */
    audioData: Blob;
    /**
     * The language of the audio (optional, auto-detected if not provided)
     */
    language?: string;
    /**
     * The model to use for speech recognition
     */
    model?: string;
};

