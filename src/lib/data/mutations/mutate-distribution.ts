import { useMutation } from '@tanstack/react-query'
import { DistributionService } from '@/lib/services/distribution.service'

const distributionService = new DistributionService()
const useMutateDistribution = () => {
  const dispatchRequestMutation = useMutation({
    mutationKey: ['request'],
    mutationFn: distributionService.dispatchRequest,
  })

  return {
    dispatchRequestMutation,
  }
}

export default useMutateDistribution
