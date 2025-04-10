"use client"

import { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { MessageInput, MessageInputRef } from "@/components/atoms/MessageInput"
import { SendButton } from "@/components/atoms/SendButton"
import { SpeechInputButton } from "@/components/atoms/SpeechInputButton"
import { useSpeechToText } from "@/hooks/useSpeechToText"

interface ChatInputFormProps {
  value: string
  onChange: (value: string) => void
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting?: boolean
  error?: string | null
  className?: string
  sttEndpoint?: string
  silenceThreshold?: number
}

export interface ChatInputFormRef {
  submitForm: () => void
  focusInput: () => void
}

export const ChatInputForm = forwardRef<ChatInputFormRef, ChatInputFormProps>(
  function ChatInputForm(
    {
      value,
      onChange,
      onInput,
      onSubmit,
      isSubmitting = false,
      error,
      className,
      sttEndpoint,
      silenceThreshold = 2000,
    },
    ref
  ) {
    const [speechError, setSpeechError] = useState<string | null>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const messageInputRef = useRef<MessageInputRef>(null)

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      submitForm: () => {
        if (formRef.current && value.trim()) {
          const event = new Event("submit", {
            cancelable: true,
            bubbles: true,
          }) as unknown as React.FormEvent
          onSubmit(event)
        }
      },
      focusInput: () => {
        messageInputRef.current?.focus()
      },
    }))

    // Add speech-to-text functionality
    const {
      state: sttState,
      startRecording,
      stopRecording,
      isRecording,
      isProcessing,
    } = useSpeechToText({
      endpoint: sttEndpoint,
      autoSubmitOnSilence: true,
      silenceThreshold,
      onTranscriptionStart: () => {
        setSpeechError(null)
      },
      onTranscriptionComplete: (text) => {
        if (text.trim()) {
          // Update the input value first
          onChange(text)

          // Submit form after setting the input text
          setTimeout(() => {
            if (formRef.current && text.trim()) {
              // Create a proper submit event
              const event = new Event("submit", {
                cancelable: true,
                bubbles: true,
              }) as unknown as React.FormEvent

              // Manually submit the form using the ref
              // @ts-expect-error - TODO: fix this
              formRef.current.dispatchEvent(event)
            }
          }, 100) // Give a bit more time for state to update
        }
      },
      onError: (error) => {
        setSpeechError(error.message)
      },
    })

    // Combined error state
    const formError = error || speechError

    // Determine if the form controls should be disabled
    const isDisabled = isSubmitting || isRecording || isProcessing

    return (
      <form ref={formRef} onSubmit={onSubmit} className={className}>
        <div className="flex space-x-2">
          <MessageInput
            ref={messageInputRef}
            value={value}
            onChange={onChange}
            onInput={onInput}
            disabled={isDisabled}
          />

          {/* Speech input button */}
          <SpeechInputButton
            state={sttState}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            disabled={isSubmitting}
          />

          <SendButton
            disabled={isDisabled || !value.trim()}
            loading={isSubmitting}
          />
        </div>

        {formError && (
          <div className="mt-2 text-red-500 text-sm">{formError}</div>
        )}
      </form>
    )
  }
)
