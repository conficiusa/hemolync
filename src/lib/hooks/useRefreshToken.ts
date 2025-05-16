import { api } from '@/lib/server/api'

const useRefreshToken = () => {
  const refresh = async () => {
    try {
      const response = await api.post('/auth/refresh', {
        withCredentials: true,
      })
      return response.data.accessToken
    } catch (error) {
      console.error('Error refreshing token:', error)
      throw error
    }
  }

  return refresh
}

export default useRefreshToken
