import { User } from 'lucide-react'
import { NotificationsPanel } from '@/components/notifications'

const DashboardHeader = () => {
  return (
    <div>
      {' '}
      <header className="h-16 bg-white border-b flex items-center justify-between px-6">
        <h1 className="text-xl font-bold text-gray-900">
          Holy family Hospital
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-muted-foreground/20 px-2  pr-6 py-1 rounded-full">
            <div className="relative w-8 h-8 rounded-full bg-muted-foreground/40 flex items-center justify-center">
              <User size={16} />
              <span className="w-2 h-2 absolute bg-green-600 rounded-full bottom-0 right-0 border-2 border-white" />
            </div>
            <div>
              <p className="text-sm font-medium">Bernice</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>

          <NotificationsPanel />
        </div>
      </header>
    </div>
  )
}

export default DashboardHeader
