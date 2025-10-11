import { memo } from 'react'
import type { Notification } from '@/lib/services/notification.service'
import { cn } from '@/lib/utils'
import NotificationsSkeleton from '@/components/skeletons/notifications-skeleton'
import NotificationsError from '@/components/skeletons/notifications-error'
import { Checkbox } from '@/components/ui/checkbox'
import NotificationsEmpty from '@/components/skeletons/notifications-empty'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type NotificationContentProps = {
  tab: 'all' | 'unread'
  setActiveTab: (tab: 'all' | 'unread') => void
  error: unknown
  isLoading: boolean
  isConnected: boolean
  hasError: boolean
  selectedNotifications: Array<string>
  unreadCount: number
  allSelected: boolean
  filteredNotifications: Array<Notification>
  toggleSelectAll: () => void
  toggleSelect: (id: string) => void
}
const NotificationsContent = memo<NotificationContentProps>(
  ({
    tab,
    setActiveTab,
    error,
    hasError,
    isConnected,
    isLoading,
    selectedNotifications,
    unreadCount,
    allSelected,
    filteredNotifications,
    toggleSelectAll,
    toggleSelect,
  }) => {
    return (
      <div>
        <div />
        <div>
          <div className="p-6 flex items-center justify-between">
            <h2 className="text-2xl font-medium text-gray-800">
              Notifications
            </h2>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  isConnected
                    ? 'bg-green-500'
                    : hasError
                      ? 'bg-red-500'
                      : 'bg-yellow-500',
                )}
              ></div>
              <span className="text-xs text-gray-500">
                {isConnected ? 'Connected' : hasError ? 'Error' : 'Connecting'}
              </span>
            </div>
          </div>

          <div className="border-b">
            <div className="flex justify-center px-6">
              <div className="flex w-full max-w-xs justify-center gap-9">
                <button
                  onClick={() => setActiveTab('unread')}
                  className={cn(
                    'py-3 text-center relative',
                    tab === 'unread'
                      ? 'text-gray-800 font-medium'
                      : 'text-gray-400',
                  )}
                >
                  <span
                    className={cn(
                      'p-2',
                      tab === 'unread' &&
                        'flex items-center border-b-2 border-b-primary',
                    )}
                  >
                    Unread
                    <span className="ml-1 text-xs bg-transparent text-gray-400 rounded-full border border-gray-200 w-5 h-5 inline-flex items-center justify-center">
                      {unreadCount}
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={cn(
                    'py-3 text-center relative',
                    tab === 'all'
                      ? 'text-gray-800 font-medium'
                      : 'text-gray-400',
                  )}
                >
                  <span
                    className={cn(
                      'p-2',
                      tab === 'all' &&
                        'flex items-center border-b-2 border-b-primary',
                    )}
                  >
                    All
                    <span className="ml-1 text-xs bg-transparent text-gray-400 rounded-full border border-gray-200 w-5 h-5 inline-flex items-center justify-center">
                      {filteredNotifications.length}
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <NotificationsSkeleton />
          ) : error ? (
            <NotificationsError />
          ) : filteredNotifications.length < 1 ? (
            <NotificationsEmpty />
          ) : (
            <>
              <div className="border-b">
                <div className="p-4 flex items-center">
                  <Checkbox
                    className="data-[state=checked]:bg-yellow-300"
                    checkStyle="text-primary"
                    onCheckedChange={toggleSelectAll}
                    checked={allSelected}
                  />
                </div>
              </div>

              <div className="py-1">
                {filteredNotifications.map((notification) => (
                  <div key={notification.id} className="px-2 py-1">
                    <div
                      className={cn(
                        'rounded-sm flex gap-3 p-3',
                        selectedNotifications.includes(notification.id)
                          ? 'bg-primary-accent/90'
                          : 'bg-white',
                      )}
                    >
                      <div className="flex-shrink-0 pt-1">
                        <div className="p-4 flex items-center">
                          <Checkbox
                            className="data-[state=checked]:bg-transparent"
                            checkStyle="text-primary"
                            onCheckedChange={() =>
                              toggleSelect(notification.id)
                            }
                            checked={selectedNotifications.includes(
                              notification.id,
                            )}
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 flex-1">
                        <div className="flex-shrink-0 relative">
                          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                            {/* <img
                              src={'/profile.avif'}
                              alt="profile"
                              className="w-full h-full object-cover"
                              width={40}
                              height={40}
                            /> */}
                            <Avatar>
                              <AvatarFallback></AvatarFallback>
                            </Avatar>
                          </div>
                          {!notification.is_read && (
                            <div className="absolute -right-1 top-0 w-3 h-3 bg-primary rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400">
                            {notification.created_at}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  },
)

export default NotificationsContent
