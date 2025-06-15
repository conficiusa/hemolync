import { useSuspenseQuery } from '@tanstack/react-query'
import { UserIcon } from 'lucide-react'
import { NotificationsPanel } from '@/components/notifications'
import { getReadableRole } from '@/lib/utils'
import { session } from '@/lib/data/queries/auth/refresh'
import DashboardMobileSidebar from '@/components/dashboard-mobile-sidebar'

const DashboardHeader = () => {
  const { data } = useSuspenseQuery(session)
  const { user } = data
  const { facility } = user

  return (
    <div>
      <header className="py-4 bg-white border-b flex items-center justify-between px-6">
        <div className="md:flex hidden">
          <h1 className="text-2xl font-bold">{facility?.facility_name}</h1>
        </div>
        <div className="md:hidden flex">
          <img src="/logo.png" alt="HemoLync Logo" width={120} height={100} />
        </div>
        <div className="items-center gap-4 lg:flex hidden">
          <div className="flex items-center gap-2 bg-muted-foreground/20 px-2  pr-6 py-1 rounded-full">
            <div className="relative w-8 h-8 rounded-full bg-muted-foreground/40 flex items-center justify-center">
              <UserIcon size={16} className="text-muted-foreground" />
              <span className="w-2 h-2 absolute bg-green-600 rounded-full bottom-0 right-0 border-2 border-white" />
            </div>
            <div>
              <p className="text-sm font-medium">{user.name.split(' ')[1]}</p>
              <p className="text-xs text-gray-500">
                {getReadableRole(user.role as string)}
              </p>
            </div>
          </div>

          <NotificationsPanel />
        </div>
        {/* Mobile sidebar toggle */}
        <DashboardMobileSidebar session={data} />
      </header>
    </div>
  )
}

export default DashboardHeader
