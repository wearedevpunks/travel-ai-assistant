"use client"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface ErrorOperationOutputProps {
  title: string
  message: string | React.ReactNode
  className?: string
  variant?: "default" | "destructive"
  icon?: React.ReactNode
  action?: React.ReactNode
}

export const ErrorOperationOutput = ({
  title,
  message,
  className = "",
  variant = "destructive",
  icon,
  action,
}: ErrorOperationOutputProps) => {
  return (
    <Alert variant={variant} className={`my-2 ${className}`}>
      <div className="flex items-start">
        {icon && <div className="flex-shrink-0 mr-2">{icon}</div>}
        <div className="flex-grow">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </div>
        {action && <div className="flex-shrink-0 ml-2">{action}</div>}
      </div>
    </Alert>
  )
}
