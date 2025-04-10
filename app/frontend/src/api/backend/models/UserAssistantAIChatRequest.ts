/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserAssistantAIChatMessage } from './UserAssistantAIChatMessage';
export type UserAssistantAIChatRequest = {
    /**
     * Array of previous messages in the conversation
     */
    messages: Array<UserAssistantAIChatMessage>;
    /**
     * Unique identifier for the conversation
     */
    conversationId?: string;
};

