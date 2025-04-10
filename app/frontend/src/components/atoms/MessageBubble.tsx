"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { ReactNode } from "react"

interface MessageBubbleProps {
  variant: "user" | "assistant" | "system"
  children: ReactNode
  className?: string
}

export function MessageBubble({
  variant,
  children,
  className,
}: MessageBubbleProps) {
  const getBubbleStyle = () => {
    switch (variant) {
      case "user":
        return "bg-blue-100 ml-auto"
      case "assistant":
        return "bg-gray-100 mr-auto"
      case "system":
        return "bg-gray-200 mx-auto text-gray-700 w-full"
      default:
        return "bg-gray-100 mr-auto"
    }
  }

  return (
    <Card
      className={cn("p-3 rounded-lg max-w-[80%]", getBubbleStyle(), className)}
    >
      {children}
    </Card>
  )
}
