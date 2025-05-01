import type { LoginFormData } from '@/components/loginForm'
import useProtectedAxios from '@/lib/hooks/useProtectedAxios'
import { api } from '@/lib/server/api'

export const useAuthService = () => {
  const protectedApi = useProtectedAxios()

  const login = async (data: LoginFormData) => {
    const response = await api.post('users/auth/login/', {
      data,
    })
    return response.data
  }

  const getProfile = async (id: string) => {
    const response = await protectedApi.get(`/users/${id}`)
    return response.data
  }

  const uploadImage = async (imageUri: string) => {
    try {
      // Convert image URI to blob
      const response = await fetch(imageUri)
      const blob = await response.blob()

      console.log(blob, 'blob')

      // Create form data
      const formData = new FormData()
      formData.append('image', blob as any)

      // Upload image
      const { data } = await protectedApi.post('/auth/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return data.data.imageUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  return { login, uploadImage, getProfile }
}
