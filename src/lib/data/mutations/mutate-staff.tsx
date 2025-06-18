import { useMutation } from '@tanstack/react-query'
import type { UserInviteFormData } from '@/lib/schemas/user-schemas/user-invite.schema'
import { protectedApi } from '@/lib/server/protected-api'

const addStaff = async (data: UserInviteFormData) => {
  const res = await protectedApi.post('/users/staff/create', data)
  return res.data
}

export const useMutateStaff = () => {
  const addStaffMutation = useMutation({
    mutationKey: ['staff'],
    mutationFn: addStaff,
  })
  return { addStaffMutation }
}
