"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { VoiceOption } from "@/components/atoms/VoiceSelector"

export type TextToSpeechState = "idle" | "loading" | "playing" | "error"

export interface TextToSpeechRequest {
  text: string
  voice?: string
  speed?: number
  responseFormat?: string
}

interface UseTextToSpeechOptions {
  endpoint: string  // The API endpoint URL for text-to-speech
  voice: VoiceOption
  autoPlay?: boolean
  onPlayStart?: () => void
  onPlayEnd?: () => void
  onError?: (error: Error) => void
}

export function useTextToSpeech({
  endpoint,
  voice,
  autoPlay = false,
  onPlayStart,
  onPlayEnd,
  onError,
}: UseTextToSpeechOptions) {
  const [state, setState] = useState<TextToSpeechState>("idle")
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)
  const textToSpeakRef = useRef<string | null>(null)

  // Clean up audio URL object when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
      }
    }
  }, [])

  // Stop audio playback
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setState("idle")
    }
  }, [])

  // Play the generated audio
  const play = useCallback(
    async (text: string) => {
      try {
        // Don't regenerate audio for the same text
        if (text !== textToSpeakRef.current || !audioUrlRef.current) {
          // Clean up previous audio URL if it exists
          if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current)
            audioUrlRef.current = null
          }

          setState("loading")
          setError(null)
          textToSpeakRef.current = text

          // Create the request
          const request: TextToSpeechRequest = {
            text,
            voice,
            responseFormat: "mp3",
          }

          // Call API using plain fetch
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
            throw new Error(errorData.error || `HTTP error ${response.status}`)
          }
          
          // Get the audio blob
          const audioBlob = await response.blob()

          // Create a URL for the audio blob
          audioUrlRef.current = URL.createObjectURL(audioBlob)

          // Create audio element if it doesn't exist
          if (!audioRef.current) {
            audioRef.current = new Audio()
            audioRef.current.addEventListener("ended", () => {
              setState("idle")
              onPlayEnd?.()
            })
          }

          // Set the audio source and play
          audioRef.current.src = audioUrlRef.current
          audioRef.current.play()
          setState("playing")
          onPlayStart?.()
        } else if (audioRef.current) {
          // Play existing audio
          audioRef.current.play()
          setState("playing")
          onPlayStart?.()
        }
      } catch (err) {
        console.error("Error generating speech:", err)
        setState("error")
        setError("Failed to generate speech")
        onError?.(err instanceof Error ? err : new Error(String(err)))
      }
    },
    [endpoint, voice, onPlayStart, onPlayEnd, onError]
  )

  return {
    play,
    stop,
    state,
    error,
  }
}