import { protectedApi } from '@/lib/server/protected-api'

// {
//     "items": [],
//     "total_items": 0,
//     "total_pages": 0,
//     "current_page": 1,
//     "page_size": 20,
//     "has_next": false,
//     "has_prev": false
// }

export type NotificationResponse = {
  items: Array<Notification>
  total_items: number
  total_pages: number
  current_page: number
  page_size: number
  has_next: boolean
  has_prev: boolean
}

export type Notification = {
  id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
  user_id: string
}

export class NotificationService {
  /**
   * Fetch notifications
   */
  public async fetchNotifications() {
    const result =
      await protectedApi.get<NotificationResponse>('/notifications/')
    return result.data
  }
}
