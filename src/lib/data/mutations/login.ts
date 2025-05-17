import { useMutation } from '@tanstack/react-query'
import type { LoginFormData } from '@/components/loginForm'
import { api } from '@/lib/server/api'

const login = async (data: LoginFormData) => {
  const response = await api.post('/users/auth/login', data)
  return response.data
}

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    mutationKey: ['session'],
  })
}
