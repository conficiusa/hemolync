import { Suspense } from 'react'
import StaffTable from '@/components/staff-table'
import StaffManagementHeader from '@/components/staff-management-header'
import StaffManagementHeaderSkeleton from '@/components/skeletons/staff-management-header-skeleton'
import { StaffTableSkeleton } from '@/components/skeletons/staff-table-skeleton'

export default function StaffManagement() {
  return (
    <div className="md:p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 flex flex-col gap-6">
          <Suspense fallback={<StaffManagementHeaderSkeleton />}>
            <StaffManagementHeader />
          </Suspense>
          <Suspense fallback={<StaffTableSkeleton />}>
            <StaffTable />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
