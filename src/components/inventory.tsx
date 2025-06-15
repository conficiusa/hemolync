import { Suspense } from 'react'
import InventoryTable from '@/components/inventory-table'
import { InventoryTableSkeleton } from '@/components/skeletons/inventory-table-skeleton'
import TablePagination from '@/components/table-pagination'
import InventoryHeader from '@/components/inventory-header'
import InventoryHeaderSkeleton from '@/components/skeletons/inventory-header-skeleton'

export default function Inventory() {
  return (
    <div className="py-6 space-y-6 mx-auto">
      <div className="bg-background rounded-lg shadow-sm overflow-hidden">
        <div className="sm:p-6 p-4 py-6 flex flex-col gap-6">
          {/*
            We use 2 Suspense boundaries for granular loading states:
            1. Header – very small payload, usually resolves fast, but we still
               want its own skeleton so the table skeleton doesn't jump.
            2. Table + pagination – potentially larger dataset.
          */}

          <Suspense fallback={<InventoryHeaderSkeleton />}>
            <InventoryHeader />
          </Suspense>

          <Suspense fallback={<InventoryTableSkeleton />}>
            <div className="overflow-x-auto max-w-[calc(100vw_-_120px)]">
              <InventoryTable />
            </div>
            <TablePagination />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
