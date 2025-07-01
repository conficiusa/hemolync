import { Skeleton } from '@/components/ui/skeleton'

export default function FacilitySelectionSkeleton() {
  return (
    <div className="flex flex-col items-center relative self-stretch w-full">
      <div className="flex flex-col items-start gap-3 p-4 w-full bg-gray-100 rounded-sm">
        {/* Header */}
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-56" />

        {/* Search toggle placeholder */}
        <Skeleton className="h-4 w-32" />

        {/* Search input placeholder */}
        <Skeleton className="h-9 w-2/3 max-w-md" />

        {/* Facility card placeholders */}
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="w-full rounded-sm border border-gray-200 bg-white overflow-hidden"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
