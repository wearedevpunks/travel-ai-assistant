"use client"

import { ReactNode } from "react"

interface ChatMessageHeaderProps {
  author?: string
  actions?: ReactNode
  className?: string
}

export function ChatMessageHeader({
  author,
  actions,
  className,
}: ChatMessageHeaderProps) {
  return (
    <div className={`flex justify-between items-start mb-1 ${className}`}>
      {author && (
        <div className="text-xs text-gray-500 font-medium">{author}</div>
      )}
      {actions}
    </div>
  )
}
