"use client"

import React from "react"
import { ToolInvocation } from "./types"

export type ToolOutputProps = {
  toolInvocation: ToolInvocation
}

export type ToolComponentRegistry = Record<
  string,
  React.ComponentType<ToolOutputProps>
>

export interface BaseToolOutputProps {
  toolInvocation: ToolInvocation
  toolComponents: ToolComponentRegistry
  GenericComponent: React.ComponentType<ToolOutputProps>
}

export const BaseToolOutput = ({
  toolInvocation,
  toolComponents,
  GenericComponent,
}: BaseToolOutputProps) => {
  // Get the component for the current tool or fall back to generic renderer
  const ToolComponent =
    toolComponents[toolInvocation.toolName] || GenericComponent

  return <ToolComponent toolInvocation={toolInvocation} />
}
