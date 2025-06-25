import { useMutation } from '@tanstack/react-query'
import type { LoginFormData } from '@/components/loginForm'
import type { UserProfileSchemaData } from '@/lib/schemas/user-schemas/user-profile.schema'
import { api } from '@/lib/server/api'
import { protectedApi } from '@/lib/server/protected-api'

const loginRequest = async (data: LoginFormData) => {
  const response = await api.post('/users/auth/login', data)
  return response.data
}

const logoutRequest = async () => {
  const response = await api.post('/users/auth/logout')
  return response.data
}

const updateUserRequest = async (data: UserProfileSchemaData) => {
  const { role, ...rest } = data
  const response = await protectedApi.patch('/users/update-account', rest)
  return response.data
}

export const useAuth = () => {
  const login = useMutation({
    mutationFn: loginRequest,
    mutationKey: ['session'],
  })

  const logout = useMutation({
    mutationFn: logoutRequest,
    mutationKey: ['session'],
  })

  const updateUser = useMutation({
    mutationFn: updateUserRequest,
    mutationKey: ['session'],
  })

  return { login, logout, updateUser }
}
