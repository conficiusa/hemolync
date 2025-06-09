import type { LoginFormData } from '@/components/loginForm'

export type Role = 'Staff' | 'Administrator' | 'Blood-bank in-charge' | 'Staff'
export interface AuthContextType {
  user: User | null
  isLoading: boolean
  sessionFetching: boolean
  error: string | null
  token: string | null
  facility: Facility | null
  setError: (value: string) => void
  login: (data: LoginFormData) => Promise<User>
  isAuthenticated: boolean
}
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
export type Session = {
  access_token: string
  user: User & { facility: Facility | null }
  facility: Facility | null
}

type Success<T> = {
  data: T
  error: null
}

type Failure<TError> = {
  data: null
  error: TError
}
export type Result<T, TError = Error> = Success<T> | Failure<TError>
