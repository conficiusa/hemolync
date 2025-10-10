import { Suspense, memo, useState } from 'react'

import { Bell } from 'lucide-react'
import type { SSEState } from '@/components/notifications-content'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import NotificationsContent from '@/components/notifications-content'
import NotificationsSkeleton from '@/components/skeletons/notifications-skeleton'

const NotificationsPanel = memo(() => {
  const [activeTab, setActiveTab] = useState<'unread' | 'all'>('all')
  const [sseState, setSSEState] = useState<SSEState>({
    hasError: false,
    isConnected: false,
  })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="w-8 h-8 flex items-center justify-center relative">
          <Bell size={20} />
          {sseState.hasError && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          )}
          {sseState.isConnected && !sseState.hasError && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="min-w-lg">
        <Suspense fallback={<NotificationsSkeleton />}>
          <NotificationsContent
            tab={activeTab}
            setActiveTab={setActiveTab}
            setSSEState={setSSEState}
          />
        </Suspense>
      </SheetContent>
    </Sheet>
  )
})

NotificationsPanel.displayName = 'NotificationsPanel'
export default NotificationsPanel
