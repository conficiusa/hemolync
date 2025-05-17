import { Outlet, createFileRoute } from '@tanstack/react-router'
import DashboardSidebar from '@/components/dashboard-sidebar'
import DashboardHeader from '@/components/dashboard-header'
import { session } from '@/lib/data/queries/auth/refresh'
import { checkAuth } from '@/lib/utils'
import Loader from '@/components/loader'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
  pendingComponent: () => {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  },
  beforeLoad: async ({ context, location, preload }) => {
    const { queryClient } = context
    queryClient.ensureQueryData(session)
    const data = await queryClient.fetchQuery(session)
    checkAuth(data, location, preload)
  },
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(session)
  },
})

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-muted">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col ml-68">
        <DashboardHeader />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
