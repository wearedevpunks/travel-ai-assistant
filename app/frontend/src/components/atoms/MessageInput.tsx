"use client"

import { forwardRef, useImperativeHandle, useRef } from "react"
import { Input } from "@/components/ui/input"

export interface MessageInputRef {
  focus: () => void
  element: HTMLInputElement | null
}

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export const MessageInput = forwardRef<MessageInputRef, MessageInputProps>(
  function MessageInput(
    {
      value,
      onChange,
      onInput,
      disabled = false,
      placeholder = "Type your message...",
      className,
    },
    ref
  ) {
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus()
      },
      element: inputRef.current,
    }))

    return (
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onInput={onInput}
        placeholder={placeholder}
        disabled={disabled}
        className={`flex-1 px-4 py-2 focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    )
  }
)
