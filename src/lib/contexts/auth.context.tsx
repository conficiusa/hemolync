import React, { createContext, useContext, useEffect, useState } from 'react'
import type { LoginFormData } from '@/components/loginForm'
import type { AuthContextType } from '@/lib/types/system-types'
import { useAuthService } from '@/lib/services/auth.service'
import { api } from '@/lib/server/api'

export interface User {
  id: string
  name: string
  email: string
  role: 'staff' | 'facility_administrator'
  phone?: string
  image?: string
  emailVerified: boolean
}
export interface Facility {
  blood_bank: null
  created_at: string
  facility_contact_number: string
  facility_digital_address: string
  facility_email: string
  facility_name: string
  id: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [facility, setFacility] = useState<Facility | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const authService = useAuthService(token)

  // Derive isAuthenticated from token
  const isAuthenticated = Boolean(token)

  // Load user profile on mount
  useEffect(() => {
    async function loadUp() {
      try {
        // First try to refresh the token
        const refreshResponse = await api.get('/auth/refresh', {
          withCredentials: true,
        })
        const newToken = refreshResponse.data.accessToken
        setToken(newToken)

        // Then load the profile using the new token
        if (newToken) {
          console.log('newToken', newToken)
          await loadUserProfile(newToken)
        }
      } catch (err) {
        // If refresh fails, try to load profile anyway (it might work with just the refresh token)
        // await loadUserProfile()
      }
    }
    loadUp()
  }, [])

  const loadUserProfile = async (accessToken?: string) => {
    try {
      const response = await authService.getProfile(accessToken)
      setUser(response)
      setFacility(response.facility)
    } catch (err) {
      // If we can't load the profile, the user is not authenticated
      setUser(null)
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (data: LoginFormData) => {
    try {
      setError(null)
      setIsLoading(true)
      const response = await authService.login(data)
      const { facility: facilityData, ...userData } = response.data.user
      setUser(userData)
      setFacility(facilityData)
      setToken(response.data.accessToken)
      return userData
    } catch (err: any) {
      if (err.isAxiosError && !err.response) {
        // This is a network error - request made but no response received
        setError('Network error - please check your internet connection')
      } else {
        // This is a server response error or something else
        setError(err.response?.data?.detail || 'Login failed')
      }
      throw err.response?.data
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
    facility,
    token,
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
