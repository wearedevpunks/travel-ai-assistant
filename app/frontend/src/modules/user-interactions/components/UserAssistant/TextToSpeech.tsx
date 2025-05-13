"use client"

import { useState, useEffect, useRef } from "react"
import { TextToSpeechControls } from "@/components/molecules/TextToSpeechControls"
import { SpeechButtonState } from "@/components/atoms/SpeechButton"
import { VoiceOption } from "@/components/atoms/VoiceSelector"
import { useTTSPlayer } from "./TTSPlayerContext"

export interface TextToSpeechProps {
  text: string
  autoPlay?: boolean
  voice: VoiceOption
  endpoint: string
}

export function TextToSpeech({
  text,
  autoPlay = false,
  voice,
  endpoint,
}: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)
  const previousTextRef = useRef("")
  const speakTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { playAudio, stopCurrentAudio } = useTTSPlayer()

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
      }

      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current)
      }

      if (audioRef.current) {
        audioRef.current.pause()
        stopCurrentAudio()
      }
    }
  }, [stopCurrentAudio])

  // Handle text changes with debounce
  useEffect(() => {
    // Clear any existing timeout
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current)
    }

    // Only process if we have text and it changed
    if (text && text !== previousTextRef.current) {
      // Set a timeout to debounce text changes (wait for text to stabilize)
      speakTimeoutRef.current = setTimeout(() => {
        console.log("Text has stabilized, processing for TTS")

        // Save the text to prevent reprocessing
        previousTextRef.current = text

        // Stop current playback
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }

        // Auto-play if enabled
        if (autoPlay) {
          console.log(
            `Auto-playing speech: "${text.substring(0, 50)}${
              text.length > 50 ? "..." : ""
            }"`
          )
          handleSpeak()
        }
      }, 1000) // 1000ms debounce delay to ensure text has stabilized
    }
  }, [text, autoPlay])

  // Generate and play speech
  const handleSpeak = async () => {
    if (isPlaying || isLoading) return

    try {
      setIsLoading(true)
      setError(null)

      // Call the TTS API
      console.log(`Sending TTS request for text length: ${text.length}`)
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice: voice || "alloy",
          instructions:
            "Use a friendly and engaging tone for young people. Imagine you are talking to a cool dude.",
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate speech: ${response.statusText}`)
      }

      // Get the audio blob and create a URL for it
      const audioBlob = await response.blob()

      // Clean up previous URL if it exists
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
      }

      audioUrlRef.current = URL.createObjectURL(audioBlob)

      // Stop any currently playing audio globally (via context)
      stopCurrentAudio()

      // Create and play the audio
      const audio = new Audio(audioUrlRef.current)
      audioRef.current = audio
      playAudio(audio)

      // Set up event listeners
      audio.addEventListener("ended", () => {
        setIsPlaying(false)
        // Only clear if this audio is the one managed by context
        stopCurrentAudio()
      })

      audio.addEventListener("error", () => {
        setIsPlaying(false)
        setError("Audio playback failed")
        stopCurrentAudio()
      })

      // Play the audio
      await audio.play()
      setIsPlaying(true)
      setIsLoading(false)
    } catch (err) {
      console.error("Text-to-speech error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      setIsPlaying(false)
      setIsLoading(false)
    }
  }

  // Stop speech playback
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      stopCurrentAudio()
    }
    setIsPlaying(false)
  }

  // Determine the button state
  const buttonState: SpeechButtonState = isLoading
    ? "loading"
    : isPlaying
    ? "playing"
    : "idle"

  return (
    <TextToSpeechControls
      state={buttonState}
      onPlay={handleSpeak}
      onStop={handleStop}
      error={error}
    />
  )
}
