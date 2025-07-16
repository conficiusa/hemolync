import { queryOptions } from '@tanstack/react-query'
import type {
  MainTab,
  PaginatedRequestType,
  RequestState,
  RequestStatus,
  RequestType,
} from '@/lib/types/request-management.types'
import requestService from '@/lib/services/request.service'

const fetchRequests = (
  status: RequestStatus | 'all',
  option?: MainTab,
  request_status?: RequestState,
) => {
  return queryOptions<PaginatedRequestType>({
    queryKey: ['requests', status, option, request_status],
    queryFn: () =>
      requestService.getRequestsByStatus(status, option, request_status),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!status,
  })
}

const fetchRequestById = (id: string) => {
  return queryOptions<RequestType>({
    queryKey: ['request', id],
    queryFn: () => requestService.getRequestById(id),
  })
}

export { fetchRequests, fetchRequestById }
