import { useSuspenseQuery } from '@tanstack/react-query'
import { Layers, Send, Tags } from 'lucide-react'
import { memo } from 'react'
import { StatCard } from '@/components/stat-card'
import { fetchDashboardSummary } from '@/lib/data/queries/dashboard/fetch-summary'

const StatCardHeader = memo(() => {
  const { data, error } = useSuspenseQuery(fetchDashboardSummary())
  if (error) return <div>Error loading data</div>

  return (
    <>
      <StatCard
        icon={Layers}
        title="Total Units In Stock"
        value={data.stock.value + ' units'}
        change={data.stock.change}
        changeType={data.stock.direction}
        changeText={
          data.stock.direction === 'up'
            ? 'Up from yesterday'
            : data.stock.direction === 'down'
              ? 'Down from yesterday'
              : 'No change from yesterday'
        }
      />
      <StatCard
        icon={Send}
        title="Total units sent"
        value={data.transferred.value + ' units'}
        change={data.transferred.change}
        changeType={data.transferred.direction}
        changeText={
          data.transferred.direction === 'up'
            ? 'Up from yesterday'
            : data.transferred.direction === 'down'
              ? 'Down from yesterday'
              : 'No change from yesterday'
        }
      />
      <StatCard
        icon={Tags}
        title="Total number of requests"
        value={data.requests.value + ' requests'}
        change={data.requests.change}
        changeType={data.requests.direction}
        changeText={
          data.requests.direction === 'up'
            ? 'Up from yesterday'
            : data.requests.direction === 'down'
              ? 'Down from yesterday'
              : 'No change from yesterday'
        }
        changeColor="success"
      />
    </>
  )
})

StatCardHeader.displayName = 'StatCardHeader'
export default StatCardHeader
