import { getRouteApi } from '@tanstack/react-router'
import { User } from 'lucide-react'
import { NotificationsPanel } from '@/components/notifications'
import { getReadableRole } from '@/lib/utils'

const DashboardHeader = () => {
  const routeApi = getRouteApi('/dashboard')
  const { user, facility } = routeApi.useLoaderData()

  return (
    <div>
      <header className="h-16 bg-white border-b flex items-center justify-between px-6">
        <h1 className="text-2xl font-bold">
          {facility.facility_name}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-muted-foreground/20 px-2  pr-6 py-1 rounded-full">
            <div className="relative w-8 h-8 rounded-full bg-muted-foreground/40 flex items-center justify-center">
              <User size={16} className="text-muted-foreground" />
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
      </header>
    </div>
  )
}

export default DashboardHeader
