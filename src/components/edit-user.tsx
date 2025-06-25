import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import type { EditUserFormData } from '@/lib/schemas/user-schemas/user-edit.schema'
import type { User } from '@/lib/types/system-types'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import SelectDropdown from '@/components/selectDropdown'
import { UserEditSchema } from '@/lib/schemas/user-schemas/user-edit.schema'
import { TextInput } from '@/components/textInputBuilder'
import { useMutateStaff } from '@/lib/data/mutations/mutate-staff'

export function EditUserDialog({
  user,
}: {
  user: Pick<
    User,
    'email' | 'first_name' | 'last_name' | 'role' | 'id' | 'phone'
  >
}) {
  const queryClient = useQueryClient()
  const {
    editStaffMutation: { mutate },
  } = useMutateStaff()
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(UserEditSchema),
    defaultValues: {
      email: user.email,
      phone: user.phone,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    },
  })

  const onSubmit = (data: EditUserFormData) => {
    mutate(
      { ...data, id: user.id },
      {
        onSuccess: () => {
          toast.success('User updated successfully')
          queryClient.invalidateQueries({ queryKey: ['staff'] })
        },
        onError: () => {
          toast.error('Failed to update user')
        },
      },
    )
  }
  const handleRoleChange = (value: string) => {
    setValue('role', value)
    setError('role', { message: '' })
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group w-fit h-fit p-1 hover:bg-white rounded-full transition-all duration-500">
          <button className="p-1 text-muted-foreground group-hover:text-foreground">
            <Pencil size={14} />
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-semibold">Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                control={control}
                name="first_name"
                label="First Name"
                placeholder="Enter first name"
                error={errors.first_name?.message}
              />
              <TextInput
                control={control}
                name="last_name"
                label="Last Name"
                placeholder="Enter last name"
                error={errors.last_name?.message}
              />
            </div>
            <TextInput
              control={control}
              name="email"
              type="email"
              label="Email Address"
              placeholder="Enter user's email address"
              error={errors.email?.message}
            />
            <TextInput
              control={control}
              name="phone"
              type="tel"
              label="Phone Number"
              placeholder="Enter user's phone number"
              error={errors.phone?.message}
            />
            <div className="space-y-2">
              <Label
                htmlFor="role"
                className="block text-sm font-medium text-[hsla(217,23%,27%,1)]"
              >
                Role
              </Label>
              <SelectDropdown
                selected={watch('role')}
                setSelected={handleRoleChange}
                placeholder="Select Role"
                error={errors.role?.message}
              />
            </div>
          </div>
          <DialogFooter className=" flex justify-center sm:justify-center gap-3 px-[24px] py-[20px]">
            <DialogClose asChild>
              <button
                type="button"
                className="px-4 min-w-[125px] py-3  border border-primary rounded-full text-sm font-medium text-primary"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="px-3  py-3 min-w-[125px] bg-primary text-white rounded-full text-sm font-medium"
            >
              Save Changes
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
