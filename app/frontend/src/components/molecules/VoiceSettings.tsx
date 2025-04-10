"use client"

import { VoiceSelector, VoiceOption } from "@/components/atoms/VoiceSelector"
import { AutoPlayToggle } from "@/components/atoms/AutoPlayToggle"

interface VoiceOptionItem {
  id: string
  label: string
}

interface VoiceSettingsProps {
  voice?: VoiceOption
  voiceOptions: VoiceOptionItem[]
  onVoiceChange: (voice: VoiceOption) => void
  autoPlay: boolean
  onAutoPlayChange: (autoPlay: boolean) => void
  autoPlayLabel?: string
  voiceLabel?: string
  className?: string
}

export function VoiceSettings({
  voice,
  voiceOptions,
  onVoiceChange,
  autoPlay,
  onAutoPlayChange,
  autoPlayLabel = "Auto-play responses",
  voiceLabel = "Voice:",
  className,
}: VoiceSettingsProps) {
  return (
    <div
      className={`flex justify-end items-center space-x-4 text-sm text-gray-600 ${className}`}
    >
      <div className="flex items-center">
        <AutoPlayToggle checked={autoPlay} onCheckedChange={onAutoPlayChange} />
        <label htmlFor="autoplay-toggle" className="ml-2 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          {autoPlayLabel}
        </label>
      </div>

      <div className="flex items-center">
        <label htmlFor="voice-preference" className="flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z"
            />
          </svg>
          {voiceLabel}
        </label>
        <VoiceSelector
          value={voice}
          options={voiceOptions}
          onChange={onVoiceChange}
          className="ml-2"
        />
      </div>
    </div>
  )
}
