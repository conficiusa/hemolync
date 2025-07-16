import { createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'
import DashboardChartSkeleton from '@/components/skeletons/dashboard-chart-skeleton'

const DashboardChart = lazy(() => import('@/components/dashboard-chart'))

export const Route = createFileRoute('/dashboard/(card-routes)/')({
  component: DashboardHome,
})

function DashboardHome() {
  return (
    <main className="flex justify-center items-center flex-col min-h-[60dvh] py-6">
      <Suspense fallback={<DashboardChartSkeleton />}>
        <DashboardChart />
      </Suspense>
    </main>
  )
}
