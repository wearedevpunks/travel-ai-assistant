"use client"

import { SpeechButton, SpeechButtonState } from "@/components/atoms/SpeechButton"

interface TextToSpeechControlsProps {
  state: SpeechButtonState
  onPlay: () => void
  onStop: () => void
  error?: string | null
  className?: string
}

export function TextToSpeechControls({
  state,
  onPlay,
  onStop,
  error,
  className
}: TextToSpeechControlsProps) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <SpeechButton 
        state={state} 
        onPlay={onPlay} 
        onStop={onStop} 
      />
      
      {error && (
        <span className="ml-2 text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  )
}