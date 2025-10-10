import { memo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * NotificationsSkeleton renders a loading placeholder for the notifications panel.
 */
const NotificationsSkeleton = memo(() => {
  return (
    <div className="min-w-lg">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="border-b">
        <div className="flex justify-center px-6">
          <div className="flex w-full max-w-xs justify-center gap-9">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-12" />
          </div>
        </div>
      </div>

      <div className="border-b">
        <div className="p-4">
          <Skeleton className="h-5 w-5" />
        </div>
      </div>

      <div className="py-1 space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="px-2 py-1">
            <div className="rounded-sm flex gap-3 p-3 bg-white">
              <div className="flex-shrink-0 pt-1">
                <Skeleton className="h-5 w-5 rounded-sm" />
              </div>
              <div className="flex gap-3 flex-1 items-start">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

NotificationsSkeleton.displayName = 'NotificationsSkeleton'

export default NotificationsSkeleton
