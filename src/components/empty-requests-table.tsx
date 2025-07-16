import { memo } from 'react'
import { Link, getRouteApi } from '@tanstack/react-router'
import { Notebook, Plus } from 'lucide-react'
import type {
  MainTab,
  RequestStatus,
} from '@/lib/types/request-management.types'

const EmptyRequestsTable = memo(() => {
  const search = getRouteApi('/dashboard/request-management/').useSearch()
  const option = search.tab.split('-')[0] as MainTab
  const proccesing_status = search.tab.split('-')[1] as RequestStatus | 'all'
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="flex items-center justify-center rounded-full bg-muted p-4">
        <Notebook className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">
          No requests available
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          You have not {option === 'sent' ? 'made' : 'received'} any requests{' '}
          {proccesing_status !== 'all' &&
            `that are currently ${proccesing_status}`}
          .
        </p>
      </div>
      <Link
        to="/dashboard/request-management/new"
        search={{ from: search.tab }}
      >
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-sm text-sm font-medium">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </Link>
    </div>
  )
})

EmptyRequestsTable.displayName = 'EmptyRequestsTable'
export default EmptyRequestsTable
