import { memo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { LogOut, Settings, Zap } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogoutDialog } from '@/components/logout-dialog'
import NavItem from '@/components/nav-item'
import { DashboardNavItems } from '@/lib/constants/system'

const DashboardSidebar = memo(() => {
  const router = getRouteApi('/dashboard')
  const { user } = router.useLoaderData()

  return (
    <aside className="w-68 bg-white lg:flex flex-col border-r fixed h-screen hidden">
      {/* Logo */}
      <div className="p-6">
        <img
          src="/logo.png"
          alt="HemoLync Logo"
          width={120}
          height={40}
          className="mb-8"
        />
      </div>
      <ScrollArea>
        <div className="h-[calc(100dvh_-_100px)] flex flex-col justify-between">
          {/* Navigation */}
          <nav className="space-y-1">
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
                />
              )
            })}
          </nav>
          {/* Support */}
          <div>
            <div className="mx-3 mt-10">
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

            {/* Bottom Navigation */}
            <div className="mt-4 mb-6">
              <NavItem
                href="/dashboard/settings/"
                icon={<Settings />}
                text="Settings"
                className='!px-10'
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
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
})

export default DashboardSidebar
