import {
  Link,
  createFileRoute,
  isRedirect,
  redirect,
} from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { session } from '@/lib/data/queries/auth/refresh'

export const Route = createFileRoute('/')({
  component: Home,
  beforeLoad: async ({ context }) => {
    const { queryClient } = context
    try {
      const data = await queryClient.ensureQueryData(session)
      if (data.access_token) {
        throw redirect({ to: '/dashboard' })
      }
    } catch (error) {
      if (isRedirect(error)) {
        throw error
      }
      return
    }
  },
})

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <h1 className="text-8xl">Welcome to HemoLync </h1>
      <div className="flex gap-10 mt-10">
        <Button className="w-28" asChild>
          <Link to={'/auth/login'}>Login</Link>
        </Button>
        <Button>
          <Link to={'/dashboard'}>Dashboard</Link>
        </Button>
      </div>
    </main>
  )
}
