import { session } from '@/lib/data/queries/auth/refresh'
import { getContext } from '@/lib/integrations/tanstack-query/root-provider'

export const RefreshToken = async () => {
  const queryClient = getContext().queryClient
  await queryClient.invalidateQueries({ queryKey: session.queryKey })
  const newSession = await queryClient.fetchQuery(session).catch(() => null)
  return newSession?.access_token ?? null
}
