import { Skeleton } from '@/components/ui/skeleton'

export default function StaffManagementHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center pt-4">
      <div className="md:flex gap-2 items-center hidden">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex items-center max-md:justify-between gap-3 w-full md:w-auto">
        <div className="relative">
          <Skeleton className="h-10 max-sm:w-[250px] md:w-[300px] rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
