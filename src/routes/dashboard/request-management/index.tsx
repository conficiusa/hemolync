import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import Tracking from '@/components/tracking'
import Loader from '@/components/loader'

const RequestTabSchema = z.object({
  tab: z
    .enum(['incoming-requests', 'my-requests', 'dispatched', 'received'])
    .catch('incoming-requests'),
})
export const Route = createFileRoute('/dashboard/request-management/')({
  pendingComponent: () => {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  },
  component: TrackingPage,
  validateSearch: (search) => RequestTabSchema.parse(search),
})

export default function TrackingPage() {
  return <Tracking />
}
