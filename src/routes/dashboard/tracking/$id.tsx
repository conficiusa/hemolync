import TrackingDetails from '@/components/tracking-details'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/tracking/$id')({
  component: TrackingDetailsPage,
})

function TrackingDetailsPage() {
  const { id } = Route.useParams()
  return <TrackingDetails id={id} />
}
