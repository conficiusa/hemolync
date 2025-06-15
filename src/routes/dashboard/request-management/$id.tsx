import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import TrackingDetails from '@/components/tracking-details'

const RequestTabSchema = z.object({
  from: z
    .enum(['incoming-requests', 'my-requests', 'dispatched', 'received'])
    .catch('incoming-requests'),
})
export const Route = createFileRoute('/dashboard/request-management/$id')({
  validateSearch: (search) => RequestTabSchema.parse(search),
  component: TrackingDetailsPage,
})

function TrackingDetailsPage() {
  const { id } = Route.useParams()
  return <TrackingDetails id={id} />
}
