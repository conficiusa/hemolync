import { Outlet, createFileRoute } from '@tanstack/react-router'
import DashboardSidebar from '@/components/dashboard-sidebar'
import DashboardHeader from '@/components/dashboard-header'
import NotFound from '@/components/not-found'
import { session } from '@/lib/data/queries/auth/refresh'
import { checkAuth } from '@/lib/utils'
import Loader from '@/components/loader'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
  notFoundComponent: () => <NotFound />,
  pendingComponent: () => {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  },
  beforeLoad: async ({ context, location, preload }) => {
    const { queryClient } = context
    try {
      const data = await queryClient.fetchQuery(session)
      checkAuth(data, location, preload)
    } catch (error) {
      checkAuth(null, location, preload)
    }
  },
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(session)
  },
})

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-muted">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col lg:ml-68">
        <DashboardHeader />

        <main className="flex-1 p-2 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
