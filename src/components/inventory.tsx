import { Suspense } from 'react'
import InventoryTable from '@/components/inventory-table'
import { InventoryTableSkeleton } from '@/components/inventory-table-skeleton'
import TablePagination from '@/components/table-pagination'
import InventoryHeader from '@/components/inventory-header'

export default function Inventory() {
  return (
    <div className="py-6 space-y-6 mx-auto">
      <div className="bg-background rounded-lg shadow-sm overflow-hidden">
        <div className="sm:p-6 p-4 py-6 flex flex-col gap-6">
          <InventoryHeader />
          <div className="overflow-x-auto max-w-[calc(100vw_-_120px)]">
            <Suspense fallback={<InventoryTableSkeleton />}>
              <InventoryTable />
            </Suspense>
          </div>
          <TablePagination />
        </div>
      </div>
    </div>
  )
}
