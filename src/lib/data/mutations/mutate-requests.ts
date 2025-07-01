import { useMutation } from '@tanstack/react-query'
import RequestServices from '@/lib/services/request.service'

const useMutateRequest = () => {
  const addRequestMutation = useMutation({
    mutationKey: ['request'],
    mutationFn: RequestServices.addRequest,
  })

  const updateRequestMutation = useMutation({
    mutationKey: ['request'],
    mutationFn: RequestServices.updateRequest,
  })

  const deleteRequestMutation = useMutation({
    mutationKey: ['request'],
    mutationFn: RequestServices.deleteRequest,
  })

  return {
    addRequestMutation,
    updateRequestMutation,
    deleteRequestMutation,
  }
}

export default useMutateRequest
