import { createFileRoute } from '@tanstack/react-router'
import StaffManagement from '@/components/staff-management'

export const Route = createFileRoute('/dashboard/staff-management')({
  component: StaffManagementpage,
})

function StaffManagementpage() {
  return <StaffManagement />
}
