import { Suspense } from 'react'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { fetchDashboardSummary } from '@/lib/data/queries/dashboard/fetch-summary'
import StatCardHeader from '@/components/stat-card-header'
import StatCardHeaderSkeleton from '@/components/skeletons/stat-card-header-skeleton'

export const Route = createFileRoute('/dashboard/(card-routes)')({
  component: OverviewCardsLayout,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(fetchDashboardSummary()),
})

function OverviewCardsLayout() {
  return (
    <main>
      <Suspense fallback={<StatCardHeaderSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCardHeader />
        </div>
      </Suspense>
      <Outlet />
    </main>
  )
}

export default OverviewCardsLayout
