import { createFileRoute, redirect } from '@tanstack/react-router'
import StaffManagement from '@/components/staff-management'

export const Route = createFileRoute('/dashboard/staff-management')({
  beforeLoad: ({ context }) => {
    const {
      auth: { user, isLoading },
    } = context
    if (isLoading) {
      return null
    }
    if (user?.role !== 'facility_administrator') {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: StaffManagementpage,
})

function StaffManagementpage() {
  return <StaffManagement />
}
