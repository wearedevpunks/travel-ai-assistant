"use client"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface WarningOperationOutputProps {
  title: string
  message: string | React.ReactNode
  className?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export const WarningOperationOutput = ({ 
  title, 
  message,
  className = "",
  icon,
  action
}: WarningOperationOutputProps) => {
  return (
    <Alert variant="warning" className={`my-2 ${className}`}>
      <div className="flex items-start">
        {icon && <div className="flex-shrink-0 mr-2">{icon}</div>}
        <div className="flex-grow">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>
            {message}
          </AlertDescription>
        </div>
        {action && <div className="flex-shrink-0 ml-2">{action}</div>}
      </div>
    </Alert>
  )
}