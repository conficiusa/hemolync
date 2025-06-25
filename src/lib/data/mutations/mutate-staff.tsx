import { useMutation } from '@tanstack/react-query'
import type { EditUserFormData } from '@/lib/schemas/user-schemas/user-edit.schema'
import type { UserInviteFormData } from '@/lib/schemas/user-schemas/user-invite.schema'
import { protectedApi } from '@/lib/server/protected-api'

const addStaff = async (data: UserInviteFormData) => {
  const res = await protectedApi.post('/users/staff/create', data)
  return res.data
}

const editStaff = async (data: EditUserFormData & { id: string }) => {
  const res = await protectedApi.patch(`/users/update-account`, data)
  return res.data
}

const deleteStaff = async (id: string) => {
  const res = await protectedApi.delete(`/users/delete-account/${id}`)
  return res.data
}

export const useMutateStaff = () => {
  const addStaffMutation = useMutation({
    mutationKey: ['staff'],
    mutationFn: addStaff,
  })
  const editStaffMutation = useMutation({
    mutationKey: ['staff'],
    mutationFn: editStaff,
  })
  const deleteStaffMutation = useMutation({
    mutationKey: ['staff'],
    mutationFn: deleteStaff,
  })
  return { addStaffMutation, editStaffMutation, deleteStaffMutation }
}
