import React, { createContext, useContext, useRef, useCallback } from "react"

// Context type: exposes only methods, not the ref
export type TTSPlayerContextType = {
  playAudio: (audio: HTMLAudioElement) => void
  stopCurrentAudio: () => void
}

const TTSPlayerContext = createContext<TTSPlayerContextType | undefined>(
  undefined
)

export const TTSPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  const stopCurrentAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }
  }, [])

  const playAudio = useCallback((audio: HTMLAudioElement) => {
    // Stop any currently playing audio
    if (currentAudioRef.current && currentAudioRef.current !== audio) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
    }
    currentAudioRef.current = audio
  }, [])

  return (
    <TTSPlayerContext.Provider value={{ playAudio, stopCurrentAudio }}>
      {children}
    </TTSPlayerContext.Provider>
  )
}

export function useTTSPlayer() {
  const ctx = useContext(TTSPlayerContext)
  if (!ctx)
    throw new Error("useTTSPlayer must be used within a TTSPlayerProvider")
  return ctx
}
