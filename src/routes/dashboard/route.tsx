import { Outlet, createFileRoute } from '@tanstack/react-router'
import DashboardSidebar from '@/components/dashboard-sidebar'
import DashboardHeader from '@/components/dashboard-header'
import { checkAuth } from '@/lib/utils'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
  beforeLoad: ({ context, location, preload }) => {
    const { auth } = context
    checkAuth(auth, location, preload)
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
