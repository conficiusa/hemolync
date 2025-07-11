import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import type { User } from '@/lib/types/system-types'
import { protectedApi } from '@/lib/server/protected-api'

const fetchStaff = async () => {
  try {
    const res = await protectedApi.get('/users/staff')
    return res.data
  } catch (error: any) {
    throw error.response
  }
}

export const fetchStaffQuery = () => {
  return queryOptions<Array<User>>({
    queryKey: ['staff'],
    queryFn: fetchStaff,
    staleTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
  })
}
