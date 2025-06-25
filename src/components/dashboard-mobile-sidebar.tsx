import { LogOut, Menu, Settings } from 'lucide-react'
import { useState } from 'react'
import type { User } from '@/lib/types/system-types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LogoutDialog } from '@/components/logout-dialog'
import NavItem from '@/components/nav-item'
import { DashboardNavItems } from '@/lib/constants/system'

const DashboardMobileSidebar = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger visible only on small screens */}
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring lg:hidden"
        >
          <Menu size={20} />
          <span className="sr-only">Open sidebar</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl text-left">Menu</DialogTitle>
          <DialogDescription className="text-left sr-only">
            Navigate to your desired page
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pt-4">
          {/* Navigation */}
          <nav className="flex-1">
            {DashboardNavItems.map((item) => {
              if (
                item.href === '/dashboard/staff-management' &&
                user.role !== 'facility_administrator'
              )
                return null
              return (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  text={item.label}
                  exact={item.href === '/dashboard'}
                  onPathChange={() => setIsOpen(false)}
                  className="data-[active=true]:bg-primary-accent data-[active=true]:text-primary-accent-foreground"
                  iconClassName="data-[active=true]:text-primary-accent-foreground"
                />
              )
            })}
          </nav>
          {/* Bottom Navigation */}
          <div className="mt-4 mb-6">
            <div className="w-[90%] h-[1px] bg-gray-200 mx-auto" />
            <NavItem
              href="/dashboard/settings"
              icon={<Settings />}
              text="Settings"
              onPathChange={() => setIsOpen(false)}
              className="data-[active=true]:bg-primary-accent data-[active=true]:text-primary-accent-foreground"
              iconClassName="data-[active=true]:text-primary-accent-foreground"
            />
            <LogoutDialog>
              <div className="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-gray-600 hover:bg-muted">
                <LogOut size={20} className="text-gray-600 mx-2" />
                <span className="text-sm font-medium text-gray-600">
                  Logout
                </span>
              </div>
            </LogoutDialog>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default DashboardMobileSidebar
