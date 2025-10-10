import { queryOptions } from '@tanstack/react-query'
import { NotificationService } from '@/lib/services/notification.service'

const notificationService = new NotificationService()

export const fetchNotification = () => {
  return queryOptions({
    queryKey: ['notifications'],
    queryFn: notificationService.fetchNotifications,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
