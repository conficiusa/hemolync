import { Suspense, memo, useCallback, useMemo, useState } from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { Link, getRouteApi, useNavigate } from '@tanstack/react-router'
import type {
  CombinedTabValue,
  MainTab,
  SubTab,
} from '@/lib/types/request-management.types'
import { RequestsTableSkeleton } from '@/components/skeletons/requests-table-skeleton'
import {
  MAIN_TABS,
  SUB_TABS,
  combineTabValue,
  parseTabValue,
} from '@/lib/types/request-management.types'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import SelectDropdown from '@/components/selectDropdown'
import SentRequestsTable from '@/components/sent-requests-table'
import ReceivedRequestsTable from '@/components/requests-received-table'

// Generate tables record with type safet

const TrackingTabs = memo(() => {
  const searchParams = getRouteApi('/dashboard/request-management/').useSearch()

  const [activeTab, setActiveTab] = useState<CombinedTabValue>(searchParams.tab)
  const { main: activeMain, sub: activeSub } = parseTabValue(activeTab)
  const navigate = useNavigate()

  const handleMainTabChange = (newMain: string) => {
    // Keep the same sub-tab when switching main tabs
    const newCombined = combineTabValue(newMain as MainTab, activeSub)
    setActiveTab(newCombined)
    navigate({
      from: '/dashboard/request-management',
      search: { tab: newCombined },
    })
  }

  const handleSubTabChange = useCallback(
    (newSub: string) => {
      const newCombined = combineTabValue(activeMain, newSub as SubTab)
      setActiveTab(newCombined)
      navigate({
        from: '/dashboard/request-management',
        search: { tab: newCombined },
      })
    },
    [activeMain, navigate],
  )

  return (
    <Tabs defaultValue={activeMain} onValueChange={handleMainTabChange}>
      <div className="mb-4">
        <TabsList className="flex space-x-2 border-b">
          {MAIN_TABS.map((mainTab) => (
            <TabsPrimitive.TabsTrigger
              key={mainTab.value}
              value={mainTab.value}
              onClick={() => handleMainTabChange(mainTab.value)}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                activeMain === mainTab.value
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700',
              )}
            >
              {mainTab.label}
            </TabsPrimitive.TabsTrigger>
          ))}
        </TabsList>
      </div>
      {MAIN_TABS.map((mainTab) => (
        <TabsContent value={mainTab.value} key={mainTab.value}>
          <RequestsTabs
            activeSub={activeSub}
            activeTab={activeTab}
            activeMain={mainTab.value}
            handleSubTabChange={handleSubTabChange}
          />
        </TabsContent>
      ))}

      {/* Sub Tabs */}
    </Tabs>
  )
})

TrackingTabs.displayName = 'TrackingTabs'
export default TrackingTabs

const RequestsTabs = memo(
  ({
    activeSub,
    activeTab,
    handleSubTabChange,
    activeMain,
  }: {
    activeSub: SubTab
    activeTab: CombinedTabValue
    handleSubTabChange: (newSub: string) => void
    activeMain: MainTab
  }) => {
    const table = useMemo(() => getTable(activeMain), [activeMain])

    return (
      <Tabs value={activeSub} onValueChange={handleSubTabChange}>
        <div className="flex justify-between items-center md:mb-6 mb-3">
          {/* Mobile dropdown */}
          <div className="min-w-[100px] md:hidden">
            <SelectDropdown
              selected={activeSub}
              setSelected={handleSubTabChange}
              items={[...SUB_TABS]}
            />
          </div>

          {/* Desktop sub-tabs - all four tabs available for any main tab */}
          <TabsList className="space-x-4 md:flex hidden">
            {SUB_TABS.map((subTab) => {
              return (
                <TabsPrimitive.TabsTrigger
                  value={subTab.value}
                  key={subTab.value}
                  className={cn(
                    'px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-150 ease-in-out',
                    activeSub === subTab.value
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-primary/10 hover:outline-[0.5px] outline-primary-accent-foreground/30 hover:text-primary',
                  )}
                >
                  {subTab.label}
                </TabsPrimitive.TabsTrigger>
              )
            })}
          </TabsList>

          <Button
            asChild
            className="border-primary text-primary hover:bg-primary transition-colors duration-500 hover:text-white"
            variant={'outline'}
          >
            <Link
              to="/dashboard/request-management/new"
              search={{ from: activeTab }}
            >
              Place a Request
            </Link>
          </Button>
        </div>

        {/* Tab Content - dynamically generated for all combinations */}
        {SUB_TABS.map((subTab) => {
          return (
            <TabsContent
              key={subTab.value}
              value={subTab.value}
              className="bg-white rounded-lg overflow-hidden"
            >
              <div className="overflow-x-auto max-md:max-w-[calc(100vw_-_60px)] max-w-[calc(100vw_-_360px)]">
                <Suspense fallback={<RequestsTableSkeleton />}>
                  {table}
                </Suspense>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    )
  },
)

RequestsTabs.displayName = 'RequestsTabs'

// get the right table based on the main active tab

const getTable = (mainTab: MainTab) => {
  switch (mainTab) {
    case 'sent':
      return <SentRequestsTable />
    case 'received':
      return <ReceivedRequestsTable />
  }
}
