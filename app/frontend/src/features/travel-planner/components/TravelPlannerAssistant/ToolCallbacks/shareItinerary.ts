"use client"

import {
  ToolCallbacks,
  ToolSuccessCallbackProps,
  ToolErrorCallbackProps,
} from "./types"

export interface WhatsAppShareResult {
  success: boolean
  phoneNumber: string
  messageSid?: string
  message: string
  error?: string
}

export const shareItineraryCallbacks: ToolCallbacks = {
  onSuccess: async ({
    invocation,
    result,
    store,
  }: ToolSuccessCallbackProps) => {
    console.log("sendItineraryViaWhatsApp success:", result)
    const shareResult = result as WhatsAppShareResult
    
    // No additional state updates needed for WhatsApp sharing
    // The UI will display the success message based on the tool result
  },

  onError: async ({ invocation, error, store }: ToolErrorCallbackProps) => {
    console.error("sendItineraryViaWhatsApp error:", error)
    // No additional error handling needed - UI will show error based on tool result
  },
}