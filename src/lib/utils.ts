import {  clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { toast } from 'sonner'
import {
  
  
  redirect
} from '@tanstack/react-router'
import type {NavigateOptions, ParsedLocation} from '@tanstack/react-router';
import type {ClassValue} from 'clsx';
import type { AuthContextType } from './types/system-types'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Expired':
      return 'bg-red-50 text-red-700'
    case 'In Stock':
      return 'bg-green-50 text-green-700'
    case 'Limited':
      return 'bg-amber-50 text-amber-700'
    case 'Out of Stock':
      return 'bg-gray-50 text-gray-700'
    default:
      return 'bg-gray-50 text-gray-700'
  }
}
export const getRequestStatusBadgeClass = (
  status:
    | 'Accepted'
    | 'Pending'
    | 'Rejected'
    | 'Urgent'
    | 'Emergency'
    | 'Not Urgent',
) => {
  switch (status) {
    case 'Accepted':
      return 'bg-green-50 text-green-500'

    case 'Pending':
    case 'Urgent':
      return 'bg-amber-50 text-amber-500'
    case 'Rejected':
    case 'Emergency':
      return 'bg-red-50 text-red-500'
    case 'Not Urgent':
      return 'bg-blue-50 text-blue-500'
    default:
      return 'bg-gray-50 text-gray-500'
  }
}
export const getRequestStatusBadgeClassComplementary = (
  status:
    | 'Accepted'
    | 'Pending'
    | 'Rejected'
    | 'Urgent'
    | 'Emergency'
    | 'Not Urgent',
) => {
  switch (status) {
    case 'Accepted':
      return 'text-green-50 bg-green-500'

    case 'Pending':
    case 'Urgent':
      return 'text-amber-50 bg-amber-500'
    case 'Rejected':
    case 'Emergency':
      return 'text-red-50 bg-red-500'
    case 'Not Urgent':
      return 'text-blue-50 bg-blue-500'
    default:
      return 'text-gray-50 bg-gray-500'
  }
}

export const checkAuth = (
  auth: AuthContextType,
  location: ParsedLocation,
  preload: boolean,
) => {
  if (auth.isAuthenticated) {
    if (!preload) {
      toast.warning('Session Expired!', {
        description: 'please login again',
      })
    }
    throw redirect({
      to: '/auth/login',
      search: {
        redirect: location.href,
      },
    })
  }
}

export const handleRedirectNavigation = (
  location: ParsedLocation,
  navigate: (options: NavigateOptions) => void,
  to: string,
) => {
  const params = new URLSearchParams(location.searchStr)
  const redirectPath = params.get('redirect')

  navigate({
    to: (redirectPath ? redirectPath : to) as any,
    replace: true,
  })
}


export const getReadableRole = (role: string) => { 
  switch (role) { 
    case 'staff':
      return 'Staff'
    case 'facility_administrator':
      return 'Admin'
    default:
      return 'Unknown'
  }
}
