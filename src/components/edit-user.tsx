import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import type { Staff } from '@/lib/types/user-types'
import type { EditUserFormData } from '@/lib/schemas/user-schemas/user-edit.schema'
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

export function EditUserDialog({ user }: { user: Pick<Staff, 'email' | 'name' | 'role' | 'id'> }) {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(UserEditSchema),
    defaultValues: {
      email: user.email,
      name: user.name,
      role: user.role,
    },
  })

  const onSubmit = (data: EditUserFormData) => {
    console.log(data)
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
                name="name"
                label="Username"
                placeholder="Enter username"
                error={errors.name?.message}
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
