import { Skeleton } from '@/components/ui/skeleton'

export default function InventoryHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <Skeleton className="h-6 w-32" />
      </div>
      {/* Right-hand buttons */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  )
}
