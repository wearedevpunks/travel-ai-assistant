"use client"

import { Checkbox } from "@/components/ui/checkbox"

interface AutoPlayToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

export function AutoPlayToggle({ checked, onCheckedChange, className }: AutoPlayToggleProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Checkbox
        id="autoplay-toggle"
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-blue-600"
      />
    </div>
  )
}