import { session } from '@/lib/data/queries/auth/refresh'
import { getContext } from '@/lib/integrations/tanstack-query/root-provider'

export const RefreshToken = async () => {
  const queryClient = getContext().queryClient
  await queryClient.invalidateQueries({ queryKey: session.queryKey })

  // Lazy-load router to avoid circular dependency with main.tsx
  const { router } = await import('@/main')

  const newSession = await queryClient.fetchQuery(session).catch(() => {
    return router.invalidate()
  })

  return newSession?.access_token ?? null
}
