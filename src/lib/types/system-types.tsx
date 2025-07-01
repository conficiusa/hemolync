import type { LoginFormData } from '@/components/loginForm'

export type Role = 'staff' | 'facility_administrator' | 'lab_manager'
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
  first_name: string
  last_name: string
  email: string
  role: Role
  phone?: string
  image?: string
  created_at: string
  last_login: string | null
  emailVerified: boolean
}
export type BloodBank = {
  id: string
  phone: string
  email: string
  blood_bank_name: string
}

export interface Facility {
  blood_bank: BloodBank
  created_at: string
  facility_contact_number: string
  facility_digital_address: string
  facility_email: string
  facility_name: string
  id: string
}
export type PaginatedFacilities = {
  items: Array<Facility>
  pagination: Pagination
}
export type Session = {
  access_token: string
  user: User & { facility: Facility | null }
  facility: Facility | null
}

export type Pagination = {
  total_items: number
  total_pages: number
  current_page: number
  page_size: number
  has_next: boolean
  has_prev: boolean
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
