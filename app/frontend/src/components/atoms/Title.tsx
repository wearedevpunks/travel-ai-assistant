"use client"

import { ComponentProps, ElementType } from "react"
import { cn } from "@/lib/utils"

// Define the available title variants
export type TitleVariant = 
  | "h1"      // Page title (text-2xl font-bold)
  | "h2"      // Section title (text-2xl font-bold) 
  | "h3"      // Subsection title (text-xl font-semibold)
  | "h4"      // Card title (font-semibold)
  | "h5"      // Highlight title (font-medium text-gray-700)
  | "card"    // Card title semantic (font-semibold leading-none)

export interface TitleProps<T extends ElementType = "h1"> {
  variant?: TitleVariant
  as?: T
  children: React.ReactNode
  className?: string
}

export const Title = <T extends ElementType = "h1">({
  variant = "h3",
  as,
  children,
  className,
  ...props
}: TitleProps<T> & Omit<ComponentProps<T>, keyof TitleProps<T>>) => {
  // Determine which HTML element to render
  const Component = as || (variant === "card" ? "div" : variant) as ElementType

  // Define the styling based on the variant
  const styles = {
    h1: "text-2xl font-bold",
    h2: "text-2xl font-bold",
    h3: "text-xl font-semibold mb-4",
    h4: "text-lg font-semibold",
    h5: "font-medium text-gray-700",
    card: "font-semibold leading-none",
  }

  return (
    <Component
      className={cn(styles[variant], className)}
      {...props}
    >
      {children}
    </Component>
  )
}