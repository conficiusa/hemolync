import { createFileRoute, redirect } from '@tanstack/react-router'
import {
  MOBILE_BREAKPOINT,
  SettingsNavigationItems,
} from '@/lib/constants/system'
import NavItem from '@/components/nav-item'

export const Route = createFileRoute('/dashboard/settings/')({
  component: RouteComponent,
  beforeLoad() {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      throw redirect({
        to: '/dashboard/settings/profile',
      })
    }
  },
})

function RouteComponent() {
  return (
    <nav className="min-h-full grid gap-3">
      {SettingsNavigationItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          text={item.name}
          showarrow
          className="outline outline-gray-200 px-4 text-xl"
        />
      ))}
    </nav>
  )
}
