import { memo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const DashboardChartSkeleton = memo(() => {
  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="flex justify-between items-center">
        <div className="min-w-[200px]">
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {/* Chart area skeleton */}
          <div className="relative h-full w-full">
            {/* Y-axis skeleton */}
            <div className="absolute left-0 top-0 h-full w-8 flex flex-col justify-between py-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-6" />
              ))}
            </div>

            {/* X-axis skeleton */}
            <div className="absolute bottom-0 left-8 right-0 h-8 flex justify-between items-center px-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-8" />
              ))}
            </div>

            {/* Chart area */}
            <div className="ml-8 mb-8 h-[calc(100%-2rem)] relative">
              {/* Grid lines skeleton */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-px w-full" />
                ))}
              </div>

              {/* Chart curve skeleton */}
              <div className="absolute inset-0 flex items-end justify-center">
                <Skeleton className="h-32 w-full rounded-t-lg opacity-30" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
DashboardChartSkeleton.displayName = 'DashboardChartSkeleton'

export default DashboardChartSkeleton
