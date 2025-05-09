import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { TextInput } from './textInputBuilder'
import type { z } from 'zod'
import { useAuth } from '@/lib/contexts/auth.context'
import { LoginSchema } from '@/lib/schemas/auth-schemas/login.schema'
import { Button } from '@/components/ui/button'
import { handleRedirectNavigation } from '@/lib/utils'

export type LoginFormData = z.infer<typeof LoginSchema>
export default function LoginForm() {
  const { login } = useAuth()
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

  const onSubmit = handleSubmit(async (data: LoginFormData) => {
    const promise = login(data)
    toast.promise(promise, {
      loading: 'Logging in...',
      success: () => {
        handleRedirectNavigation(location, navigate, '/')
        return 'Logged in successfully!'
      },
      error: (err: Error) => err.message || 'Login failed',
    })
    await promise
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
        disabled={isSubmitting}
        type="submit"
        className="mt-6 w-full  rounded-md py-3 text-center text-white hover:bg-[#611035] focus:outline-none"
      >
        {isSubmitting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          'Login'
        )}
      </Button>
    </form>
  )
}
