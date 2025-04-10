"use client"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface SuccessOperationOutputProps {
  title: string
  description?: string | React.ReactNode
  children?: React.ReactNode
  className?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export const SuccessOperationOutput = ({ 
  title, 
  description, 
  children,
  className = "",
  icon,
  action
}: SuccessOperationOutputProps) => {
  return (
    <Alert variant="success" className={`my-2 ${className}`}>
      <div className="flex items-start">
        {icon && <div className="flex-shrink-0 mr-2">{icon}</div>}
        <div className="flex-grow">
          <AlertTitle>{title}</AlertTitle>
          {description && (
            <AlertDescription>
              {description}
            </AlertDescription>
          )}
          {children}
        </div>
        {action && <div className="flex-shrink-0 ml-2">{action}</div>}
      </div>
    </Alert>
  )
}