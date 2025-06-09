import { createFileRoute, redirect } from '@tanstack/react-router'
import type { Session } from '@/lib/types/system-types'
import StaffManagement from '@/components/staff-management'
import { session } from '@/lib/data/queries/auth/refresh'

export const Route = createFileRoute('/dashboard/staff-management')({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context
    const data: Session = await queryClient.fetchQuery(session)
    if (data.user.role !== 'facility_administrator') {
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
