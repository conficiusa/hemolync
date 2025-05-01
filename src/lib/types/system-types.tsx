import type { LoginFormData } from '@/components/loginForm'
import type { User } from '@/lib/contexts/auth.context'

export type Role = 'Staff' | 'Administrator' | 'Blood-bank in-charge' | 'Staff'
export interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  setError: (value: string) => void
  login: (data: LoginFormData) => Promise<User>
  isAuthenticated: boolean
}
