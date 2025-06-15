import { Link, useLocation } from '@tanstack/react-router'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface NavItemProps {
  href: string
  icon: React.ReactNode
  text: string
  exact?: boolean
}
export function NavItem({ href, icon, text,exact }: NavItemProps) {
  const { pathname } = useLocation()
  const active = useMemo(() => {
    return exact
      ? pathname === href
      : pathname === href || pathname.startsWith(href + '/')
  }, [pathname, href])

  return (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-gray-600 hover:bg-muted',
        active && 'bg-primary text-white hover:bg-primary',
      )}
    >
      <span className={cn('', active ? 'text-white' : 'text-gray-600')}>
        {icon}
      </span>
      <span className="text-sm font-medium">{text}</span>
    </Link>
  )
}
