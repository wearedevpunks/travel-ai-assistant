"use client"

import { ToolOutputProps } from "./BaseToolOutput"

export const GenericToolOutput = ({ toolInvocation }: ToolOutputProps) => {
  const { toolName, state, args, result } = toolInvocation

  return (
    <div className="bg-muted p-4 rounded-md my-2">
      <div className="font-medium mb-2">Tool: {toolName}</div>

      {state === "call" ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : state === "error" ? (
        <div className="text-sm text-destructive">
          Error: {result?.error || "Unknown error"}
        </div>
      ) : (
        <>
          <div className="text-sm mb-2">
            <span className="font-medium">Parameters:</span>
            <pre className="mt-1 bg-muted-foreground/10 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(args, null, 2)}
            </pre>
          </div>

          {result && (
            <div className="text-sm">
              <span className="font-medium">Result:</span>
              <pre className="mt-1 bg-muted-foreground/10 p-2 rounded text-xs overflow-x-auto">
                {typeof result === "object"
                  ? JSON.stringify(result, null, 2)
                  : result}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  )
}
