import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import type { Facility } from '@/lib/contexts/auth.context'
import DashboardSidebar from '@/components/dashboard-sidebar'
import DashboardHeader from '@/components/dashboard-header'
import { checkAuth } from '@/lib/utils'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
  beforeLoad: ({ context, location, preload }) => {
    const { auth } = context
    checkAuth(auth, location, preload)
  },
  loader: ({ context: { auth }, location }) => {
    if (!auth.user) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      })
    }
    return {
      user: auth.user,
      facility: auth.facility as Facility,
    }
  },
})

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
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
