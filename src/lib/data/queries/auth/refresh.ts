import { queryOptions } from '@tanstack/react-query'
import type { Session } from '@/lib/types/system-types'
import { api } from '@/lib/server/api'

const getSession = async () => {
  const response = await api.get('/users/auth/refresh', {
    withCredentials: true,
  })
  return response.data.data as Session
}

export const session = queryOptions({
  queryKey: ['session'],
  queryFn: getSession,
  staleTime: 1000 * 60 * 60,
})
