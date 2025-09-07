import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  LineChart,
  Users,
} from 'lucide-react'

export const DashboardNavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard />,
  },
  {
    label: 'Inventory',
    href: '/dashboard/inventory',
    icon: <ClipboardList />,
  },
  {
    label: 'Request Management',
    href: '/dashboard/request-management?tab=sent-all',
    icon: <LineChart />,
  },
  {
    label: 'Staff Management',
    href: '/dashboard/staff-management',
    icon: <Users />,
  },
  {
    label: 'Report',
    href: '/dashboard/report',
    icon: <FileText />,
  },
]

export const SettingsNavigationItems = [
  {
    name: 'Profile',
    href: '/dashboard/settings/profile',
  },
  {
    name: 'Security',
    href: '/dashboard/settings/security',
  },
  {
    name: 'Help Center',
    href: '/dashboard/settings/help-center',
  },
  {
    name: 'Privacy',
    href: '/dashboard/settings/privacy',
  },
  {
    name: 'About',
    href: '/dashboard/settings/about',
  },
]

export const MOBILE_BREAKPOINT = 640
