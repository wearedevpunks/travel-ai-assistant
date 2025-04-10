"use client"

import { Button } from "@/components/ui/button"

interface SendButtonProps {
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
}

export function SendButton({
  onClick,
  disabled = false,
  loading = false,
  className
}: SendButtonProps) {
  return (
    <Button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-500 hover:bg-blue-600 text-white ${className}`}
    >
      {loading ? "Sending..." : "Send"}
    </Button>
  )
}