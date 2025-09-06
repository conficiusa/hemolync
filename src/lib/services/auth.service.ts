import type { LoginFormData } from '@/components/loginForm'
import type { UserProfileSchemaData } from '@/lib/schemas/user-schemas/user-profile.schema'
import { api } from '@/lib/server/api'
import { protectedApi } from '@/lib/server/protected-api'

const authService = {
  getSession: async () => {
    const response = await api.get('/users/auth/refresh', {
      withCredentials: true,
    })
    return response.data.data
  },

  loginRequest: async (data: LoginFormData) => {
    const response = await api.post('/users/auth/login', data)
    return response.data
  },

  logoutRequest: async () => {
    const response = await protectedApi.post('/users/auth/logout')
    return response.data
  },

  updateUserRequest: async (data: UserProfileSchemaData & { id: string }) => {
    const { role, id, ...rest } = data
    const response = await protectedApi.patch(
      `/users/update-account/${id}`,
      rest,
    )
    return response.data
  },
}

export default authService
