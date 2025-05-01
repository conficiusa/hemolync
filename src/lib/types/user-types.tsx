import type { Role } from '@/lib/types/system-types'

export type User = {
  id: number
  first_name: string
  last_name: string
  email: string
  role: Role
  dateJoined: string
}
