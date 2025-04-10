"use client"

import { Button } from "@/components/ui/button"

export type SpeechButtonState = "idle" | "loading" | "playing"

interface SpeechButtonProps {
  state: SpeechButtonState
  onPlay: () => void
  onStop: () => void
  className?: string
}

export function SpeechButton({ state, onPlay, onStop, className }: SpeechButtonProps) {
  if (state === "loading") {
    return (
      <Button
        disabled
        size="icon"
        variant="ghost"
        className={`h-8 w-8 rounded-full bg-gray-100 cursor-wait ${className}`}
        aria-label="Loading speech"
      >
        <span className="animate-pulse">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" strokeDasharray="30 30" strokeDashoffset="0" className="animate-spin">
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </span>
      </Button>
    )
  }

  if (state === "playing") {
    return (
      <Button
        onClick={onStop}
        size="icon"
        variant="ghost"
        className={`h-8 w-8 rounded-full bg-red-100 hover:bg-red-200 transition-colors ${className}`}
        aria-label="Stop speaking"
      >
        <span className="relative">
          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" />
          </svg>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </span>
      </Button>
    )
  }

  return (
    <Button
      onClick={onPlay}
      size="icon"
      variant="ghost"
      className={`h-8 w-8 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors ${className}`}
      aria-label="Speak text"
    >
      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
      </svg>
    </Button>
  )
}