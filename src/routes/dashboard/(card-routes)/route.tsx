import { Layers, Send, Tags } from 'lucide-react'
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
          icon={Layers}
          title="Total Units In Stock"
          value="200 Units"
          change={8.5}
          changeType="increase"
          changeText="Up from yesterday"
        />
        <StatCard
          icon={Send}
          title="Total units sent"
          value="80 units"
          change={4}
          changeType="decrease"
          changeText="Down from yesterday"
          changeColor="destructive"
        />
        <StatCard
          icon={Tags}
          title="Total units received"
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
