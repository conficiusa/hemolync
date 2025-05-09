'use client'
import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type React from 'react'
import type { z } from 'zod'
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
import { UserInviteSchema } from '@/lib/schemas/user-schemas/user-invite.schema'
import { TextInput } from '@/components/textInputBuilder'
import { ScrollArea } from '@/components/ui/scroll-area'

type FormData = z.infer<typeof UserInviteSchema>
const InviteUserDialog = memo(({ children }: { children: React.ReactNode }) => {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UserInviteSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      role: '',
    },
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }
  const handleRoleChange = (value: string) => {
    setValue('role', value)
    setError('role', { message: '' })
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            Invite User
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[80dvh]">
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
                name="password"
                type="password"
                label="Provisional Password"
                placeholder="Enter password"
                error={errors.password?.message}
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
                className="px-3  py-2 min-w-[125px] bg-primary text-white rounded-full text-sm font-medium"
              >
                Send Invite
              </button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
})

InviteUserDialog.displayName = 'InviteUserDialog'
export { InviteUserDialog }
