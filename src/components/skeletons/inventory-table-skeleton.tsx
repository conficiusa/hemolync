import { Skeleton } from '@/components/ui/skeleton'

export function InventoryTableSkeleton() {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="py-3 px-4 text-left">
            <Skeleton className="h-4 w-4" />
          </th>
          <th className="text-left py-3 px-4">
            <Skeleton className="h-4 w-24" />
          </th>
          <th className="text-left py-3 px-4">
            <Skeleton className="h-4 w-32" />
          </th>
          <th className="text-left py-3 px-4">
            <Skeleton className="h-4 w-24" />
          </th>
          <th className="text-left py-3 px-4">
            <Skeleton className="h-4 w-24" />
          </th>
          <th className="text-left py-3 px-4">
            <Skeleton className="h-4 w-20" />
          </th>
          <th className="text-left py-3 px-4">
            <Skeleton className="h-4 w-16" />
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={index} className="border-b border-gray-100">
            <td className="py-4 px-4">
              <Skeleton className="h-4 w-4" />
            </td>
            <td className="py-4 px-4">
              <Skeleton className="h-4 w-24" />
            </td>
            <td className="py-4 px-4">
              <Skeleton className="h-4 w-32" />
            </td>
            <td className="py-4 px-4">
              <Skeleton className="h-4 w-24" />
            </td>
            <td className="py-4 px-4">
              <Skeleton className="h-4 w-24" />
            </td>
            <td className="py-4 px-4">
              <Skeleton className="h-4 w-20" />
            </td>
            <td className="py-4 px-4">
              <Skeleton className="h-4 w-16" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
