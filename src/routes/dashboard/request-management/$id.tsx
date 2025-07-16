import { Suspense } from 'react'
import { z } from 'zod'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import TrackingDetails from '@/components/tracking-details'
import {
  COMBINED_TAB_VALUES,
  DEFAULT_TAB,
} from '@/lib/types/request-management.types'
import { fetchRequestById } from '@/lib/data/queries/requests/fetch-requests'
import RequestDetailsSkeleton from '@/components/skeletons/request-details-skeleton'
import ErrorBoundary from '@/components/error-boundary'

export const RequestTabSchema = z.object({
  from: z.enum(COMBINED_TAB_VALUES).catch(DEFAULT_TAB),
})

export const Route = createFileRoute('/dashboard/request-management/$id')({
  validateSearch: (search) => RequestTabSchema.parse(search),
  component: TrackingDetailsPage,
  loader: ({ context: { queryClient }, params }) => {
    const { id } = params
    queryClient.prefetchQuery(fetchRequestById(id))
  },
  errorComponent: ErrorBoundary,
})

function TrackingDetailsPage() {
  const search = Route.useSearch()
  return (
    <div className="p-6 flex flex-col">
      <div className="flex items-center mb-6">
        <Link
          to="/dashboard/request-management"
          search={{
            tab: search.from,
          }}
          className="flex items-center group text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-500 " />
          <span>Back to Tracking</span>
        </Link>
      </div>
      <Suspense fallback={<RequestDetailsSkeleton />}>
        <TrackingDetails />
      </Suspense>
    </div>
  )
}
