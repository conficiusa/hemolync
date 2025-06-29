import { memo } from 'react'
import NavItem from '@/components/nav-item'
import { SettingsNavigationItems } from '@/lib/constants/system'

export const SettingsSidebar = memo(() => {
  return (
    <div className="h-full">
      <nav className="space-y-2">
        {SettingsNavigationItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            text={item.name}
            className="data-[active=true]:bg-primary-accent data-[active=true]:text-primary-accent-foreground"
          />
        ))}
      </nav>
    </div>
  )
})
