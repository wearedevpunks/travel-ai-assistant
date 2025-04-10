/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserAssistantAIChatMessage = {
    /**
     * The role of the message sender
     */
    role: UserAssistantAIChatMessage.role;
    /**
     * The content of the message
     */
    content: string;
};
export namespace UserAssistantAIChatMessage {
    /**
     * The role of the message sender
     */
    export enum role {
        USER = 'user',
        ASSISTANT = 'assistant',
        SYSTEM = 'system',
        FUNCTION = 'function',
    }
}

