import type { Role } from '@/lib/types/system-types'

export type User = {
  id: number
  first_name: string
  last_name: string
  email: string
  role: Role
  dateJoined: string
}

export type Staff = {
  email: string
  name: string
  phone: string
  id: string
  role: Role
  is_active: boolean
  created_at: string
  last_login: string | null
}
