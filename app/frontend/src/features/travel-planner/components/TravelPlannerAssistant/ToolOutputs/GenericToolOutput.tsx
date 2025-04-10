"use client"

import { ToolOutputProps } from "."
import {
  LoadingOperationOutput,
  ErrorOperationOutput,
} from "@/components/operations"

export const GenericToolOutput = ({ toolInvocation }: ToolOutputProps) => {
  // Handle loading state
  if (toolInvocation.state === "call") {
    return (
      <LoadingOperationOutput
        message={`Loading data from ${toolInvocation.toolName}...`}
        icon={
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
            className="text-gray-700"
          >
            <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.7 2.8" />
            <path d="M21 12h-4" />
          </svg>
        }
      />
    )
  }

  // Handle error state
  if (toolInvocation.state === "error") {
    return (
      <ErrorOperationOutput
        title={`Error from ${toolInvocation.toolName}`}
        message={
          typeof toolInvocation.result === "string"
            ? toolInvocation.result
            : "An error occurred while processing this request."
        }
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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
        }
      />
    )
  }

  // Display successful result
  return (
    <div className="bg-white border border-green-200 rounded-lg p-4 my-2">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-green-100 p-2 rounded-md">
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
            className="text-green-600"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-base font-medium text-gray-900">
            {toolInvocation.toolName} result
          </h3>
          <div className="mt-1 text-sm text-gray-600 overflow-auto max-h-80">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(toolInvocation.result, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
