import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import type { User } from '@/lib/types/system-types'
import type { UserProfileSchemaData } from '@/lib/schemas/user-schemas/user-profile.schema'
import { userProfileSchema } from '@/lib/schemas/user-schemas/user-profile.schema'
import { TextInput } from '@/components/textInputBuilder'
import { useAuth } from '@/lib/data/mutations/mutate-auth'

export const UserProfile = ({ user }: { user: User }) => {
  const queryClient = useQueryClient()
  const {
    updateUser: { mutate, isPending },
  } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<UserProfileSchemaData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      email: user.email,
      role:
        user.role
          .split('_')
          .join(' ')
          .replace('facility', 'Facility')
          .charAt(0)
          .toUpperCase() +
        user.role.split('_').join(' ').replace('facility', 'Facility').slice(1),
    },
  })

  const onSubmit = (data: UserProfileSchemaData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('Profile updated successfully')
        queryClient.invalidateQueries({ queryKey: ['session'] })
      },
      onError: () => {
        toast.error('Failed to update profile')
      },
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-2 p-4 md:max-w-md w-full bg-background rounded-lg"
    >
      <h3 className="hidden sm:block font-semibold text-xl mb-4">Profile</h3>

      <TextInput label="First Name" name="first_name" control={control} />
      <TextInput label="Last Name" name="last_name" control={control} />
      <TextInput label="Email" name="email" control={control} />
      <TextInput label="Phone" name="phone" control={control} type="tel" />
      <TextInput label="Role" name="role" control={control} disabled readOnly />
      <div className="mt-6">
        <button
          disabled={isPending || !isDirty}
          type="submit"
          className="px-3 max-sm:mx-auto  py-3 min-w-[125px] bg-primary text-white rounded-full flex justify-center items-center text-sm font-medium disabled:opacity-65"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            'Update Profile'
          )}
        </button>
      </div>
    </form>
  )
}
