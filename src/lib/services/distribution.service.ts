import { protectedApi } from '@/lib/server/protected-api'

type DispatchRequestArges = {
  requestId: string
}

export class DistributionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DistributionError'
  }
}

export class DistributionService {
  public async dispatchRequest(args: DispatchRequestArges) {
    const { requestId } = args
    if (!requestId) {
      throw new DistributionError('Request ID is required')
    }
    const res = await protectedApi.post(`/blood-distribution/${requestId}`)
    return res.data
  }
}
