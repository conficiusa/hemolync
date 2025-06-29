import { useMutation } from '@tanstack/react-query'
import authService from '@/lib/services/auth.service'

const { loginRequest, logoutRequest, updateUserRequest } = authService
const useAuth = () => {
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

export default useAuth
