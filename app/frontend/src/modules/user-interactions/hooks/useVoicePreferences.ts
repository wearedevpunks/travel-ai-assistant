"use client"

import { useState, useEffect } from "react"
import { VoiceOption } from "@/components/atoms/VoiceSelector"

export interface VoicePreferences {
  voicePreference: VoiceOption
  autoPlayTTS: boolean
  setVoicePreference: (voice: VoiceOption) => void
  setAutoPlayTTS: (autoPlay: boolean) => void
}

export const useVoicePreferences = (
  voiceStorageKey: string = "tts-voice-preference",
  autoPlayStorageKey: string = "tts-autoplay",
  defaultVoice: VoiceOption = "alloy"
): VoicePreferences => {
  const [voicePreference, setVoicePreference] = useState<VoiceOption>(defaultVoice)
  const [autoPlayTTS, setAutoPlayTTS] = useState(true)

  // Load preferences from local storage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVoice = localStorage.getItem(voiceStorageKey)
      const savedAutoPlay = localStorage.getItem(autoPlayStorageKey)

      if (
        savedVoice &&
        ["alloy", "echo", "fable", "onyx", "nova", "shimmer"].includes(
          savedVoice
        )
      ) {
        setVoicePreference(savedVoice as VoiceOption)
      }

      if (savedAutoPlay !== null) {
        setAutoPlayTTS(savedAutoPlay === "true")
      }
    }
  }, [voiceStorageKey, autoPlayStorageKey])

  // Save preferences to local storage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(`Saving voice preference to localStorage: ${voicePreference}`);
      localStorage.setItem(voiceStorageKey, voicePreference)
      localStorage.setItem(autoPlayStorageKey, autoPlayTTS.toString())
    }
  }, [voicePreference, autoPlayTTS, voiceStorageKey, autoPlayStorageKey])

  return {
    voicePreference,
    autoPlayTTS,
    setVoicePreference,
    setAutoPlayTTS
  }
}