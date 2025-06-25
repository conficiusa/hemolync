import { Outlet, createFileRoute } from '@tanstack/react-router'
import { SettingsSidebar } from '@/components/settings-sidebar'

export const Route = createFileRoute('/dashboard/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen bg-muted">
      <div className="flex sm:bg-background w-full h-fit rounded-lg p-2 divide-x">
        <aside className="hidden sm:block col-span-3 min-w-[250px]">
          <SettingsSidebar />
        </aside>
        <main className="w-full flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
