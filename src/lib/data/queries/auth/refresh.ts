import { queryOptions } from '@tanstack/react-query'
import type { Session } from '@/lib/types/system-types'
import authService from '@/lib/services/auth.service'

export const session = queryOptions<Session>({
  queryKey: ['session'],
  queryFn: authService.getSession,
  staleTime: 1000 * 60 * 60,
})
