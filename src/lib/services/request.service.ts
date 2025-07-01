import type { newRequestSchemaData } from '@/components/request-form'
import { protectedApi } from '@/lib/server/protected-api'

const RequestServices = {
  // Add blood distribution
  addRequest: async (data: newRequestSchemaData) => {
    const response = await protectedApi.post('/requests/', data)
    return response
  },

  // Update blood distribution
  updateRequest: async (data: any) => {
    const response = await protectedApi.patch(
      `/api/blood-distribution/${data.id}`,
      data,
    )
    return response
  },

  // Delete blood distribution
  deleteRequest: async (id: string) => {
    const response = await protectedApi.delete(`/api/blood-distribution/${id}`)
    return response
  },
}

export default RequestServices
