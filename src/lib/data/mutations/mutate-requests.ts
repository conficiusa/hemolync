import { useMutation } from '@tanstack/react-query'
import { RequestService } from '@/lib/services/request.service'

const requestService = new RequestService()
const useMutateRequest = (id?: string) => {
  const addRequestMutation = useMutation({
    mutationKey: ['request'],
    mutationFn: requestService.addRequest,
  })

  const updateRequestMutation = useMutation({
    mutationKey: ['request', id],
    mutationFn: requestService.updateRequest,
  })

  const deleteRequestMutation = useMutation({
    mutationKey: ['request', id],
    mutationFn: requestService.deleteRequest,
  })

  const cancelRequestMutation = useMutation({
    mutationKey: ['request', id],
    mutationFn: requestService.cancelRequest,
  })
  const responseRequestMutation = useMutation({
    mutationKey: ['request', id],
    mutationFn: requestService.respondRequest,
  })

  return {
    addRequestMutation,
    updateRequestMutation,
    deleteRequestMutation,
    cancelRequestMutation,
    responseRequestMutation,
  }
}

export default useMutateRequest
