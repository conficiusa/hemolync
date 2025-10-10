import { createFileRoute, redirect } from '@tanstack/react-router'
import { session } from '@/lib/data/queries/auth/refresh'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context
    const data = await queryClient.ensureQueryData(session).catch(() => null)
    if (data?.access_token) {
      throw redirect({ to: '/dashboard' })
    }
    throw redirect({ to: '/auth/login' })
  },
})
