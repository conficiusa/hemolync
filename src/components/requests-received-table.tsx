import { memo, useMemo } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Eye } from 'lucide-react'
import { Link, getRouteApi } from '@tanstack/react-router'
import { format } from 'date-fns'
import type {
  MainTab,
  RequestState,
  RequestStatus,
} from '@/lib/types/request-management.types'
import { TooltipBuilder } from '@/components/tooltip-builder'
import {
  cn,
  getRequestStatusBadgeClass,
  getRequestStatusBadgeClassComplementary,
} from '@/lib/utils'
import { fetchRequests } from '@/lib/data/queries/requests/fetch-requests'
import EmptyRequestsTable from '@/components/empty-requests-table'

const ReceivedRequestsTable = memo(() => {
  const search = getRouteApi('/dashboard/request-management/').useSearch()

  // get the status from the search params
  const status = useMemo(
    () => search.tab.split('-')[1] as RequestStatus | 'all',
    [search.tab],
  )
  const option = useMemo(
    () => search.tab.split('-')[0] as MainTab,
    [search.tab],
  )
  const { data } = useSuspenseQuery(fetchRequests(status, option))

  if (data.items.length === 0) {
    return <EmptyRequestsTable />
  }

  return (
    <table className="w-full whitespace-nowrap">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground">
            Requested by
          </th>
          <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground">
            Product
          </th>
          {(status === 'pending' || status === 'all') && (
            <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground">
              Request State
            </th>
          )}
          {status !== 'pending' && (
            <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground">
              Status
            </th>
          )}
          <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground">
            Request Date
          </th>
          <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground">
            Priority
          </th>
          <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {data.items.map((item, index) => (
          <tr
            key={item.id}
            className={cn(
              'border-b border-gray-100',
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
            )}
          >
            <td className="py-4 px-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium whitespace-nowrap flex flex-col capitalize">
                  {/* TODO: add the name of the user */}
                  <p>{item.requester_name}</p>
                  <p className="text-xs text-muted-foreground font-normal">
                    {item.requester_facility_name}
                  </p>
                </span>
              </div>
            </td>
            <td className="py-4 px-6 text-sm text-muted-foreground">
              {item.blood_product}
            </td>
            {/* <td className="py-4 px-6 text-sm text-muted-foreground">
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRequestStatusBadgeClass(
                  item.status,
                )}`}
              >
                {item.status}
              </span>
            </td> */}
            {(status === 'pending' || status === 'all') && (
              <td className={cn('py-4 px-6 text-sm text-muted-foreground')}>
                <span
                  className={cn(
                    'inline-block px-2 py-1 rounded-full text-xs font-medium',
                    getRequestStatusBadgeClass(item.request_status),
                  )}
                >
                  {getRequestState(item.request_status)}
                </span>
              </td>
            )}
            {status !== 'pending' && (
              <td className="py-4 px-6 text-sm text-muted-foreground">
                <span
                  className={cn(
                    'inline-block px-2 py-1 rounded-full text-xs font-medium',
                    getRequestStatusBadgeClass(
                      item.request_status === 'rejected'
                        ? 'rejected'
                        : item.processing_status,
                    ),
                  )}
                >
                  {item.request_status === 'rejected'
                    ? 'Rejected'
                    : item.processing_status}
                </span>
              </td>
            )}
            <td className="py-4 px-6 text-sm text-muted-foreground">
              {format(item.created_at, 'MMM dd, yyy hh:mm a')}
            </td>
            <td className="py-4 px-6">
              <span
                className={cn(
                  'inline-flex px-2 py-[4px] rounded-full text-xs font-medium gap-2 items-center',
                  // getRequestStatusBadgeClass('Not Urgent'),
                )}
              >
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    getRequestStatusBadgeClassComplementary('Not Urgent'),
                  )}
                />
                {'Not Urgent'}
              </span>
            </td>
            <td className="py-4 px-6">
              <Link
                to="/dashboard/request-management/$id"
                params={{ id: item.id.toString() }}
                search={{
                  from: search.tab,
                }}
              >
                <TooltipBuilder content="View Details">
                  <Eye size={28} className="hover:opacity-70" strokeWidth={1} />
                </TooltipBuilder>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
})

ReceivedRequestsTable.displayName = 'ReceivedRequestsTable'
export default ReceivedRequestsTable

const getRequestState = (request_status: RequestState) => {
  switch (request_status) {
    case 'accepted':
      return ' Accepted'
    case 'rejected':
      return ' Rejected'
    case 'pending':
      return 'Pending Acceptance'
  }
}
