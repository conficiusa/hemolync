import { useMutation } from '@tanstack/react-query'
import { protectedApi } from '@/lib/server/protected-api'

// Add blood distribution
const addRequest = async (data: any) => {
  const response = await protectedApi.post('/requests/requests', data)
  return response
}

// Update blood distribution
const updateRequest = async (data: any) => {
  const response = await protectedApi.patch(
    `/api/blood-distribution/${data.id}`,
    data,
  )
  return response
}

// Delete blood distribution
const deleteRequest = async (id: string) => {
  const response = await protectedApi.delete(`/api/blood-distribution/${id}`)
  return response
}

const useMutateRequest = () => {
  const addRequestMutation = useMutation({
    mutationKey: ['request'],
    mutationFn: addRequest,
  })

  const updateRequestMutation = useMutation({
    mutationKey: ['request'],
    mutationFn: updateRequest,
  })

  const deleteRequestMutation = useMutation({
    mutationKey: ['request'],
    mutationFn: deleteRequest,
  })

  return {
    addRequestMutation,
    updateRequestMutation,
    deleteRequestMutation,
  }
}

export default useMutateRequest
