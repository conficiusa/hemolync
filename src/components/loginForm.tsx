import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { TextInput } from './textInputBuilder'
import type { z } from 'zod'
import { LoginSchema } from '@/lib/schemas/auth-schemas/login.schema'
import { Button } from '@/components/ui/button'
import { handleRedirectNavigation } from '@/lib/utils'
import { useAuth } from '@/lib/data/mutations/mutate-auth'

export type LoginFormData = z.infer<typeof LoginSchema>
export default function LoginForm() {
  const {
    login: { mutate, isPending },
  } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = handleSubmit((data: LoginFormData) => {
    const toastId = toast.loading('Logging in...')
    mutate(data, {
      onSuccess: () => {
        toast.dismiss(toastId)
        handleRedirectNavigation(location, navigate, '/dashboard')
      },
      onError: (err: any) => {
        toast.dismiss(toastId)
        toast.warning(err.response.data.detail || 'Login failed')
      },
    })
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <TextInput
          control={control}
          name="email"
          label="Email"
          placeholder="Enter email"
          type="email"
          error={errors.email?.message}
        />
      </div>

      <div className="space-y-2">
        <TextInput
          control={control}
          name="password"
          label="Password"
          placeholder="Enter password"
          type="password"
          error={errors.password?.message}
        />
      </div>

      <Button
        size={'lg'}
        disabled={isSubmitting || isPending}
        type="submit"
        className="mt-6 w-full  rounded-md py-3 text-center text-white hover:bg-[#611035] focus:outline-none"
      >
        {isPending || isSubmitting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          'Login'
        )}
      </Button>
    </form>
  )
}
