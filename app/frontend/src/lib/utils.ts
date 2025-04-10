import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const trimStart = (str: string, char: string) => {
  return str.startsWith(char) ? str.slice(char.length) : str
}

export const trimEnd = (str: string, char: string) => {
  return str.endsWith(char) ? str.slice(0, -char.length) : str
}
