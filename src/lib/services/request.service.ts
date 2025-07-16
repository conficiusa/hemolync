import type { newRequestSchemaData } from '@/components/request-form'
import type {
  MainTab,
  RequestState,
  RequestStatus,
} from '@/lib/types/request-management.types'
import { protectedApi } from '@/lib/server/protected-api'

const RequestServices = {
  // Get get requests by status
  /**
   * Get requests by status
   * @param status - The processing status of the request (pending, dispatched, completed)
   * @param option - The option of the request (sent, received)
   * @param request_status - The status of the request (pending, rejected, accepted, cancelled)
   * @example getRequestsByStatus('pending', 'sent','accepted')
   * @returns
   */
  getRequestsByStatus: async (
    status: RequestStatus | 'all' = 'all',
    option: MainTab | undefined,
    request_status: RequestState | undefined,
  ) => {
    try {
      // Build query string only including provided non-empty values
      const queryParams = new URLSearchParams()

      if (status !== 'all') {
        queryParams.append('processing_status', status)
      }

      if (option) {
        queryParams.append('option', option)
      }

      if (request_status) {
        queryParams.append('request_status', request_status)
      }

      const queryString = queryParams.toString()
      const url = queryString ? `/requests/?${queryString}` : '/requests/'

      const response = await protectedApi.get(url)
      return response.data
    } catch (error: any) {
      throw error.response
    }
  },

  getReceivedRequests: async () => {
    try {
      const response = await protectedApi.get(`/requests/status/${status}`)
      return response.data
    } catch (error: any) {
      throw error.response
    }
  },

  getRequestById: async (id: string) => {
    try {
      const response = await protectedApi.get(`/requests/${id}`)
      return response.data
    } catch (error: any) {
      throw error.response
    }
  },

  // Add blood distribution
  addRequest: async (data: newRequestSchemaData) => {
    const response = await protectedApi.post('/requests/', data)
    return response
  },

  // Update blood distribution
  updateRequest: async (data: any) => {
    const response = await protectedApi.patch(`/requests/${data.id}`, data)
    return response
  },

  // Delete blood distribution
  deleteRequest: async (id: string) => {
    const response = await protectedApi.delete(`/requests/${id}`)
    return response
  },
}

export default RequestServices
