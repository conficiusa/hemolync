import { session } from '@/lib/data/queries/auth/refresh'
import { getContext } from '@/lib/integrations/tanstack-query/root-provider'

/**
 * Refresh the access token by invalidating the `session` query.
 * We lazily import the `router` instance to prevent a static circular
 * dependency between the router setup (which depends on the generated
 * `routeTree`) and modules that ultimately rely on `protected-api`.
 */
export const RefreshToken = async () => {
  const queryClient = getContext().queryClient

  // Invalidate the current session so the next fetch gets a fresh token
  await queryClient.invalidateQueries({ queryKey: session.queryKey })

  // Lazy-load the router only when we actually need it. This breaks the
  // compile-time circular dependency between the router and `protected-api`.
  const { router } = await import('@/main')

  const newSession = await queryClient.fetchQuery(session).catch(() => {
    // If the refresh fails, ensure the router invalidates and redirects
    return router.invalidate()
  })

  return newSession?.access_token ?? null
}
