"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface LoadingOperationOutputProps {
  message: string
  className?: string
  skeletonCount?: number
  skeletonHeight?: string
  icon?: React.ReactNode
}

export const LoadingOperationOutput = ({ 
  message, 
  className = "",
  skeletonCount = 1,
  skeletonHeight = "h-4",
  icon
}: LoadingOperationOutputProps) => {
  return (
    <div className={`bg-gray-200 p-3 rounded-md my-2 ${className}`}>
      <div className="flex items-center gap-2">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="font-medium text-gray-700">
          {message}
        </div>
      </div>
      <div className="space-y-2 mt-2">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Skeleton key={index} className={`${skeletonHeight} w-full rounded`} />
        ))}
      </div>
    </div>
  )
}