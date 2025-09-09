import { Outlet, createFileRoute } from '@tanstack/react-router'
import { StatCard } from '@/components/stat-card'

export const Route = createFileRoute('/dashboard/(card-routes)')({
  component: OverviewCardsLayout,
})

function OverviewCardsLayout() {
  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Blood In Stock"
          value="200 Units"
          change={8.5}
          changeType="increase"
          changeText="Up from yesterday"
        />
        <StatCard
          title="Total Transferred"
          value="80 Units"
          change={4}
          changeType="decrease"
          changeText="Down from yesterday"
          changeColor="destructive"
        />
        <StatCard
          title="Total Request"
          value="50 Units"
          change={10}
          changeType="increase"
          changeText="Up from yesterday"
          changeColor="success"
        />
      </div>
      <Outlet />
    </main>
  )
}

export default OverviewCardsLayout
