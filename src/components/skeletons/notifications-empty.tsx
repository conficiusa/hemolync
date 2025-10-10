import { memo } from 'react'

/**
 * NotificationsEmpty renders an empty state when there are no notifications.
 */
const NotificationsEmpty = memo(
  ({
    title = 'No notifications',
    subtitle = 'You are all caught up!',
  }: {
    title?: string
    subtitle?: string
  }) => {
    return (
      <div className="min-w-lg">
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-accent flex items-center justify-center">
            <span className="text-xl" role="img" aria-label="bell">
              🔔
            </span>
          </div>
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
    )
  },
)

NotificationsEmpty.displayName = 'NotificationsEmpty'

export default NotificationsEmpty
