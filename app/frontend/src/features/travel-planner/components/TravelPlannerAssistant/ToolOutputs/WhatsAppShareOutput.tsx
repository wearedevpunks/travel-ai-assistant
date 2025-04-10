"use client"

import { ToolOutputProps } from "."

// Define the type for the WhatsApp result data
interface WhatsAppShareResult {
  success: boolean
  phoneNumber: string
  messageSid?: string
  message: string
  error?: string
}

export const WhatsAppShareOutput = ({ toolInvocation }: ToolOutputProps) => {
  // Handle loading state using the custom style to match other components
  if (toolInvocation.state === "call") {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 my-2">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-gray-100 p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0"
              className="text-gray-600 animate-pulse"
            >
              {/* WhatsApp icon */}
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-base font-medium text-gray-900">
              Sending itinerary via WhatsApp...
            </h3>
            <div className="mt-1 animate-pulse h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // Handle error state using the custom style to match other components
  if (toolInvocation.state === "error") {
    return (
      <div className="bg-white border border-red-200 rounded-lg p-4 my-2">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-red-100 p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-600"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-base font-medium text-gray-900">
              Failed to send itinerary via WhatsApp
            </h3>
            <div className="mt-1 text-sm text-gray-600">
              {typeof toolInvocation.result === "string"
                ? toolInvocation.result
                : "Unable to send the itinerary. Please check the phone number and try again."}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Cast result to WhatsApp share result
  const result = toolInvocation.result as WhatsAppShareResult

  // Handle unsuccessful result using the custom style to match other components
  if (!result || !result.success) {
    return (
      <div className="bg-white border border-red-200 rounded-lg p-4 my-2">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-red-100 p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-600"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-base font-medium text-gray-900">
              Failed to send itinerary via WhatsApp
            </h3>
            <div className="mt-1 text-sm text-gray-600">
              {result?.message ||
                "Unable to send the itinerary. Please try again."}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Display success state using the custom style to match other components
  return (
    <div className="bg-white border border-green-200 rounded-lg p-4 my-2">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-green-100 p-2 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0"
            className="text-green-600"
          >
            {/* WhatsApp icon */}
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-base font-medium text-gray-900">
            Itinerary sent via WhatsApp!
          </h3>
          <div className="mt-1 text-sm text-gray-600">
            Your itinerary has been successfully sent to {result.phoneNumber}.
          </div>
        </div>
      </div>
    </div>
  )
}
