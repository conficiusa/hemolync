import StaffManagement from '@/components/staff-management'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/staff-management')({
  component: StaffManagementpage,
})

function StaffManagementpage() {
  return <StaffManagement />
}
