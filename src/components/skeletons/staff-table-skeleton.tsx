import { Skeleton } from '@/components/ui/skeleton'

export function StaffTableSkeleton() {
  return (
    <div className="overflow-x-auto max-w-[calc(100vw_-_110px)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              <Skeleton className="h-4 w-12" />
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              <Skeleton className="h-4 w-28" />
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              <Skeleton className="h-4 w-24" />
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              <Skeleton className="h-4 w-12" />
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              <Skeleton className="h-4 w-16" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </td>
              <td className="py-4 px-4">
                <Skeleton className="h-4 w-36" />
              </td>
              <td className="py-4 px-4">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="py-4 px-4">
                <Skeleton className="h-6 w-24 rounded-full" />
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
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
