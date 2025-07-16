import { Skeleton } from '@/components/ui/skeleton'

export function RequestsTableSkeleton() {
  return (
    <div className="overflow-x-auto max-w-[calc(100vw_-_110px)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4">
              <Skeleton className="h-4 w-24" />
            </th>
            <th className="text-left py-3 px-4">
              <Skeleton className="h-4 w-20" />
            </th>
            <th className="text-left py-3 px-4">
              <Skeleton className="h-4 w-16" />
            </th>
            <th className="text-left py-3 px-4">
              <Skeleton className="h-4 w-28" />
            </th>
            <th className="text-left py-3 px-4">
              <Skeleton className="h-4 w-16" />
            </th>
            <th className="text-left py-3 px-4">
              <Skeleton className="h-4 w-12" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="py-4 px-4">
                <Skeleton className="h-6 w-16 rounded-full" />
              </td>
              <td className="py-4 px-4">
                <Skeleton className="h-4 w-28" />
              </td>
              <td className="py-4 px-4">
                <Skeleton className="h-6 w-16 rounded-full" />
              </td>
              <td className="py-4 px-4">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-6 rounded" />
                  <Skeleton className="h-6 w-6 rounded" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
