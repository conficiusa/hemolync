import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import type { MainTab, RequestStatus } from '@/lib/types/request-management.types'
import {
  COMBINED_TAB_VALUES,
  DEFAULT_TAB,
} from '@/lib/types/request-management.types'
import Tracking from '@/components/tracking'
import Loader from '@/components/loader'
import { fetchRequests } from '@/lib/data/queries/requests/fetch-requests'
import ErrorBoundary from '@/components/error-boundary'

const RequestTabSchema = z.object({
  tab: z.enum(COMBINED_TAB_VALUES).catch(DEFAULT_TAB),
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
  loader: ({ context: { queryClient }, location }) => {
    const { tab } = RequestTabSchema.parse(location.search)
    const status = tab.split('-')[1] as RequestStatus | 'all'
    const option = tab.split('-')[0] as MainTab
    queryClient.prefetchQuery(fetchRequests(status, option))
  },
  errorComponent: ErrorBoundary,
})

export default function TrackingPage() {
  return <Tracking />
}
