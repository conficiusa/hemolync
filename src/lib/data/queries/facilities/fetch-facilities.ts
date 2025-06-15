import { queryOptions } from '@tanstack/react-query'
import type { Facility } from '@/lib/types/system-types'
import { protectedApi } from '@/lib/server/protected-api'

const fetchBloodBanks = async () => {
  try {
    const response = await protectedApi.get('/facilities/all')
    return response.data
  } catch (error: any) {
    throw error.response
  }
}

export const fetchBloodBanksQuery = queryOptions<Array<Facility>>({
  queryKey: ['facilities'],
  queryFn: fetchBloodBanks,
  staleTime: 1000 * 60 * 60,
})
