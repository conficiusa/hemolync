import { memo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const StatCardHeaderSkeleton = memo(() => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white border rounded-lg py-6 px-3 flex justify-between items-start"
        >
          <div className="flex-1">
            {/* Title */}
            <Skeleton className="h-3 w-36 mb-3" />

            {/* Value */}
            <Skeleton className="h-8 w-28 mb-4" />

            {/* Change row */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>

          {/* Icon */}
          <div className="ml-4">
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
})

StatCardHeaderSkeleton.displayName = 'StatCardHeaderSkeleton'
export default StatCardHeaderSkeleton
