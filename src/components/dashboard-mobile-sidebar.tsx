import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Users,
  Zap,
} from 'lucide-react'
import type { Session } from '@/lib/types/system-types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogoutDialog } from '@/components/logout-dialog'
import { NavItem } from '@/components/nav-item'

const DashboardMobileSidebar = ({ session }: { session: Session }) => {
  return (
    <Sheet>
      {/* Trigger visible only on small screens */}
      <SheetTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring lg:hidden"
        >
          <Menu size={20} />
          <span className="sr-only">Open sidebar</span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="p-0 sm:w-[70%] md:w-[50%] lg:w-[30%] flex flex-col"
      >
        <SheetHeader className="p-6 border-b">
          <img src="/logo.png" alt="HemoLync Logo" width={120} height={40} />
        </SheetHeader>
        <ScrollArea className="flex-1 pt-4 h-[calc(100dvh_-_600px)]">
          {/* Navigation */}
          <nav className="flex-1">
            <NavItem
              href="/dashboard"
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              exact
            />
            <NavItem
              href="/dashboard/inventory"
              icon={<ClipboardList size={20} />}
              text="Inventory"
            />
            <NavItem
              href="/dashboard/request-management"
              icon={<LineChart size={20} />}
              text="Request Management"
            />
            {session.user.role === 'facility_administrator' && (
              <NavItem
                href="/dashboard/staff-management"
                icon={<Users size={20} />}
                text="Staff Management"
              />
            )}
            <NavItem
              href="#"
              icon={<MessageSquare size={20} />}
              text="Chatroom"
            />
            <NavItem href="#" icon={<FileText size={20} />} text="Report" />
          </nav>

          {/* Bottom Navigation */}
          <div className="mt-4 mb-6">
            <div className="w-[90%] h-[1px] bg-gray-200 mx-auto" />
            <div className="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-gray-600 hover:bg-muted">
              <Settings size={20} className="text-gray-600 mx-2" />
              <span className="text-sm font-medium text-gray-600">
                Settings
              </span>
            </div>
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

        {/* Support fixed at bottom */}
        <div className="mx-3 mb-6">
          <Card className="w-full bg-gray-50 border-[0.74px] border-solid border-[#eaecf0] py-4">
            <CardContent className="flex flex-col items-start gap-[16px] p-[14.83px] py-2">
              <div className="relative  h-[23.72px]">
                <div className="relative  h-[29px] -top-1.5">
                  <div className="absolute w-8 h-8 top-[3px] left-[3px] rounded-[4.45px] rotate-[15deg] [background:radial-gradient(50%_50%_at_-20%_50%,rgba(252,207,224,1)_0%,rgba(133,20,62,1)_20%,rgba(216,79,130,1)_100%)]" />
                  <div className="absolute flex justify-center items-center w-8 h-8 top-1.5 left-0 bg-[#ffffff99] rounded-[4.45px] border-[0.56px] border-solid backdrop-blur-[5.93px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(5.93px)_brightness(100%)]">
                    <Zap size={16} className="text-white" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Reach out to our support team
              </p>
              <Button className="w-full h-[32.62px] text-primary-accent-foreground bg-[#f8e3e8] hover:bg-primary-100/90 text-[8.9px] font-semibold">
                Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default DashboardMobileSidebar
