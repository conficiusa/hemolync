import { clsx } from 'clsx'
import { differenceInDays, isPast, isSameDay, startOfDay } from 'date-fns'
import { twMerge } from 'tailwind-merge'
import { toast } from 'sonner'
import { redirect } from '@tanstack/react-router'
import type { NavigateOptions, ParsedLocation } from '@tanstack/react-router'
import type { ClassValue } from 'clsx'
import type { Result, Session } from './types/system-types'

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
  auth: Session | null,
  location: ParsedLocation,
  preload: boolean,
) => {
  if (!auth || !auth.access_token) {
    console.log('preload', preload)
    if (!preload) {
      toast.warning('Session Expired!', {
        description: 'Please login again',
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
    case 'lab_manager':
      return 'Lab Manager'

    default:
      return 'Unknown'
  }
}

export const tryCatch = async function tryCatch<T, TError = Error>(
  promise: Promise<T>,
): Promise<Result<T, TError>> {
  try {
    const data = await promise
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as TError }
  }
}

export const generatePages = (current: number, total: number) => {
  const pages: Array<number | 'ellipsis'> = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  // Always include the first page
  pages.push(1)

  // Show dots if current page is far from the first page
  if (current > 4) pages.push('ellipsis')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  // Show dots if current page is far from the last page
  if (current < total - 3) pages.push('ellipsis')

  // Always include the last page
  pages.push(total)

  return pages
}

export const formatDate = (date: Date | undefined) => {
  if (!date) {
    return ''
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export const formatDateDescription = (date: Date | undefined) => {
  if (!date) {
    return ''
  }

  const today = startOfDay(new Date())
  const targetDate = startOfDay(date)

  if (isSameDay(today, targetDate)) {
    return 'today'
  }

  const daysDifference = differenceInDays(targetDate, today)

  if (isPast(targetDate)) {
    const absoluteDays = Math.abs(daysDifference)
    if (absoluteDays === 1) {
      return 'yesterday'
    }
    return `${absoluteDays} days ago`
  } else {
    if (daysDifference === 1) {
      return 'tomorrow'
    }
    return `in ${daysDifference} days`
  }
}
