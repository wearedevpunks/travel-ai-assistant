"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type VoiceOption = string

interface VoiceOptionItem {
  id: string
  label: string
}

interface VoiceSelectorProps {
  value?: VoiceOption
  options: VoiceOptionItem[]
  onChange: (value: VoiceOption) => void
  placeholder?: string
  className?: string
}

export function VoiceSelector({
  value,
  options,
  onChange,
  placeholder = "Select voice",
  className,
}: VoiceSelectorProps) {
  return (
    <Select 
      value={value} 
      onValueChange={(newValue) => {
        console.log(`Voice selector changed to: ${newValue}`);
        onChange(newValue);
      }}
    >
      <SelectTrigger className={`w-[180px] text-sm ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
