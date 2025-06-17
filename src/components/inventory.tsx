import { Suspense } from 'react'
import InventoryTable from '@/components/inventory-table'
import { InventoryTableSkeleton } from '@/components/skeletons/inventory-table-skeleton'
import InventoryHeader from '@/components/inventory-header'
import InventoryHeaderSkeleton from '@/components/skeletons/inventory-header-skeleton'

export default function Inventory() {
  return (
    <div className="py-6 space-y-6 mx-auto">
      <div className="bg-background rounded-lg shadow-sm overflow-hidden">
        <div className="sm:p-6 p-4 py-6 flex flex-col gap-6">
          <Suspense fallback={<InventoryHeaderSkeleton />}>
            <InventoryHeader />
          </Suspense>

          <Suspense fallback={<InventoryTableSkeleton />}>
            <div className="overflow-x-auto max-w-[calc(100vw_-_120px)]">
              <InventoryTable />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  )
}
