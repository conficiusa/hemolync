import { memo, useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { Bell } from 'lucide-react'
import { useRouteContext } from '@tanstack/react-router'
import type { Notification } from '@/lib/services/notification.service'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { createAuthenticatedSSEConfig, useSSE } from '@/lib/sse'
import { API_URL } from '@/lib/server/api'
import { fetchNotification } from '@/lib/data/queries/notifications/fetch-notifications'

import NotificationsContent from '@/components/notifications-content'

const NotificationsPanel = memo(
  ({ access_token }: { access_token: string }) => {
    // fetch notifications
    const { data, isLoading, error } = useQuery(fetchNotification())
    const { items: notifications } = data || {
      items: [],
      total_items: 0,
    }
    const [selectedNotifications, setSelectedNotifications] = useState<
      Array<string>
    >([])
    const [activeTab, setActiveTab] = useState<'unread' | 'all'>('all')
    const queryClient = useRouteContext({
      from: '/dashboard',
      select: (search) => search.queryClient,
    })

    // Memoize handlers to prevent reconnections
    const handleMessage = useCallback(
      (event: { data: Notification }) => {
        queryClient.setQueryData(
          fetchNotification().queryKey,
          (oldData: any) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              items: [event.data, ...oldData.items],
              total_items: oldData.total_items + 1,
            }
          },
        )
      },
      [queryClient],
    )

    // Memoize the entire SSE options object to prevent reconnections
    const sseOptions = useMemo(
      () => ({
        baseUrl: API_URL,
        ...createAuthenticatedSSEConfig(access_token),
        autoRefreshToken: true, // Enable automatic token refresh
        handlers: {
          onMessage: handleMessage,
        },
      }),
      [handleMessage, access_token],
    )

    // Use the new type-safe SSE client
    const { isConnected, hasError } = useSSE<Notification>(
      '/notifications/sse/stream',
      sseOptions,
    )

    const unreadCount = notifications.filter((n) => !n.is_read).length
    const filteredNotifications =
      activeTab === 'unread'
        ? notifications.filter((n) => !n.is_read)
        : notifications

    // check if all the filtered notifications in the current tab are selected
    const allSelected = useMemo(() => {
      return (
        filteredNotifications.length > 0 &&
        filteredNotifications.every((n) => selectedNotifications.includes(n.id))
      )
    }, [filteredNotifications, selectedNotifications])

    const toggleSelectAll = () => {
      setSelectedNotifications((prev) =>
        prev.length === filteredNotifications.length
          ? []
          : filteredNotifications.map((n) => n.id),
      )
    }

    const toggleSelect = (id: string) => {
      setSelectedNotifications((prev) =>
        prev.includes(id)
          ? prev.filter((notificationId) => notificationId !== id)
          : [...prev, id],
      )
    }

    return (
      <Sheet>
        <SheetTrigger asChild>
          <button className="w-8 h-8 flex items-center justify-center relative">
            <Bell size={20} />
            {hasError && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            )}
            {isConnected && !hasError && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </button>
        </SheetTrigger>
        <SheetContent className="min-w-lg">
          <NotificationsContent
            tab={activeTab}
            setActiveTab={setActiveTab}
            error={error}
            isLoading={isLoading}
            isConnected={isConnected}
            hasError={hasError}
            selectedNotifications={selectedNotifications}
            unreadCount={unreadCount}
            allSelected={allSelected}
            filteredNotifications={filteredNotifications}
            toggleSelectAll={toggleSelectAll}
            toggleSelect={toggleSelect}
          />
        </SheetContent>
      </Sheet>
    )
  },
)

NotificationsPanel.displayName = 'NotificationsPanel'
export default NotificationsPanel
