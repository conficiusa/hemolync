import { useMutation } from '@tanstack/react-query'
import { protectedApi } from '@/lib/server/protected-api'

// Add blood distribution
const addDistribution = async (data: any) => {
  const response = await protectedApi.post('/blood-distribution/', data)
  return response
}

// Update blood distribution
const updateDistribution = async (data: any) => {
  const response = await protectedApi.patch(
    `/api/blood-distribution/${data.id}`,
    data,
  )
  return response
}

// Delete blood distribution
const deleteDistribution = async (id: string) => {
  const response = await protectedApi.delete(`/api/blood-distribution/${id}`)
  return response
}

const useMutateDistribution = () => {
  const addDistributionMutation = useMutation({
    mutationKey: ['distribution'],
    mutationFn: addDistribution,
  })

  const updateDistributionMutation = useMutation({
    mutationKey: ['distribution'],
    mutationFn: updateDistribution,
  })

  const deleteDistributionMutation = useMutation({
    mutationKey: ['distribution'],
    mutationFn: deleteDistribution,
  })

  return {
    addDistributionMutation,
    updateDistributionMutation,
    deleteDistributionMutation,
  }
}

export default useMutateDistribution
