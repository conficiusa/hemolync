import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuthService } from '@/lib/services/auth.service'
import type { LoginFormData } from '@/components/loginForm'
import type { AuthContextType } from '@/lib/types/system-types'
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  image?: string
  emailVerified: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const authService = useAuthService()

  // Derive isAuthenticated from token
  const isAuthenticated = Boolean(token)

  // Load user profile on mount
  useEffect(() => {
    async function loadUp() {
      await loadUserProfile()
    }
    loadUp()
  }, [])

  const loadUserProfile = async () => {
    try {
      const response = await authService.getProfile('123')
      setUser(response)
    } catch (error) {
      // If we can't load the profile, the user is not authenticated
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (data: LoginFormData) => {
    try {
      setError(null)
      setIsLoading(true)
      const response = await authService.login(data)
      setUser(response.data.user)
      setToken(response.data.accessToken)
      return response.data.user
    } catch (error: any) {
      if (error.isAxiosError && !error.response) {
        // This is a network error - request made but no response received
        setError('Network error - please check your internet connection')
      } else {
        // This is a server response error or something else
        setError(error.response?.data?.message || 'Login failed')
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const contextValue: AuthContextType = {
    user,
    isLoading,
    error,
    setError,
    login,
    isAuthenticated,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
