import { ArrowRight } from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import { memo, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface NavItemProps {
  href: string
  icon?: React.ReactNode
  text: string
  exact?: boolean
  onPathChange?: () => void
  className?: string
  showarrow?: boolean
  iconClassName?: string
}

const NavItem = memo(
  ({
    href,
    icon,
    text,
    exact,
    className,
    onPathChange,
    showarrow,
    iconClassName,
  }: NavItemProps) => {
    const { pathname } = useLocation()
    const active = useMemo(() => {
      return exact
        ? pathname === href
        : pathname === href || pathname.startsWith(href + '/')
    }, [pathname, href])

    const handleClick = () => {
      onPathChange?.()
    }
    return (
      <Link
        to={href}
        onClick={handleClick}
        data-active={active}
        className={cn(
          'flex items-center gap-3 py-3 mx-2 px-4 rounded-lg text-gray-600 hover:bg-muted',
          active && 'bg-primary text-white hover:bg-primary',
          showarrow && 'justify-between items-center',
          className,
        )}
      >
        {icon && (
          <span
            className={cn(
              'data-[active=true]:text-white text-gray-600',
              iconClassName,
            )}
            data-active={active}
          >
            {icon}
          </span>
        )}
        <span className="text-sm font-medium">{text}</span>
        {showarrow && (
          <span className="w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center ">
            <ArrowRight />
          </span>
        )}
      </Link>
    )
  },
)
NavItem.displayName = 'NavItem'
export default NavItem
