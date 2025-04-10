"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { SpeechRecognitionState } from "@/hooks/useSpeechToText"

interface SpeechInputButtonProps {
  state: SpeechRecognitionState
  onStartRecording: () => void
  onStopRecording: () => void
  color?: "default" | "primary" | "red"
  disabled?: boolean
  className?: string
}

export function SpeechInputButton({
  state,
  onStartRecording,
  onStopRecording,
  color = "default",
  disabled = false,
  className = "",
}: SpeechInputButtonProps) {
  const [rippleEffect, setRippleEffect] = useState(false)
  
  // Add ripple effect when recording
  useEffect(() => {
    if (state === "recording") {
      const interval = setInterval(() => {
        setRippleEffect((prev) => !prev)
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [state])
  
  // Get appropriate button styling
  const getButtonVariant = () => {
    if (state === "recording") return "destructive"
    if (color === "primary") return "default" 
    if (color === "red") return "destructive"
    return "secondary"
  }
  
  // Get appropriate icon
  const ButtonIcon = () => {
    if (state === "processing") return <Loader2 className="h-4 w-4 animate-spin" />
    if (state === "recording") return <MicOff className="h-4 w-4" />
    return <Mic className="h-4 w-4" />
  }
  
  // Toggle between start and stop based on state
  const handleClick = () => {
    if (state === "recording") {
      onStopRecording()
    } else if (state === "idle") {
      onStartRecording()
    }
  }
  
  return (
    <Button
      type="button"
      size="icon"
      variant={getButtonVariant()}
      disabled={disabled || state === "processing"}
      className={`relative ${className} ${
        state === "recording" && rippleEffect ? "animate-pulse" : ""
      }`}
      onClick={handleClick}
      aria-label={
        state === "recording" 
          ? "Stop recording" 
          : state === "processing" 
          ? "Processing speech" 
          : "Start recording"
      }
    >
      <ButtonIcon />
      
      {/* Recording indicator */}
      {state === "recording" && (
        <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 animate-ping" />
      )}
    </Button>
  )
}