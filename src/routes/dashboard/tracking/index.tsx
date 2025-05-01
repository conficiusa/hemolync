import { createFileRoute } from '@tanstack/react-router'
import Tracking from '@/components/tracking'

export const Route = createFileRoute('/dashboard/tracking/')({
  component: TrackingPage,
})

export default function TrackingPage() {
  return <Tracking />
}
