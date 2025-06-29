'use client'
import { memo, useState } from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { Link, getRouteApi, useNavigate } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import TrackingTable from '@/components/tracking-table'
import { Button } from '@/components/ui/button'
import SelectDropdown from '@/components/selectDropdown'

type TrackingTab =
  | 'Incoming Requests'
  | 'My Requests'
  | 'Dispatched'
  | 'Received'
type TrackingTabVlaue =
  | 'incoming-requests'
  | 'my-requests'
  | 'dispatched'
  | 'received'
const tabs: Array<{ label: TrackingTab; value: TrackingTabVlaue }> = [
  { label: 'Incoming Requests', value: 'incoming-requests' },
  { label: 'My Requests', value: 'my-requests' },
  { label: 'Dispatched', value: 'dispatched' },
  { label: 'Received', value: 'received' },
]

const tables: Record<TrackingTabVlaue, React.ReactNode> = {
  'incoming-requests': <TrackingTable />,
  'my-requests': <TrackingTable />,
  dispatched: <TrackingTable />,
  received: <TrackingTable />,
}

const TrackingTabs = memo(() => {
  const searchParams = getRouteApi('/dashboard/request-management/').useSearch()

  const [active, setActive] = useState<TrackingTabVlaue>(searchParams.tab)
  const navigate = useNavigate()

  const handleTabChange = (value: string) => {
    setActive(value as TrackingTabVlaue)
    navigate({
      from: '/dashboard/request-management',
      search: { tab: value as TrackingTabVlaue },
    })
  }

  return (
    <Tabs defaultValue={active} onValueChange={handleTabChange}>
      <div className="flex justify-between items-center md:mb-6 mb-3">
        <div className="min-w-[200px] md:hidden">
          <SelectDropdown
            selected={active}
            setSelected={handleTabChange}
            items={tabs}
          />
        </div>
        <TabsList className="space-x-4 md:flex hidden">
          {tabs.map((tab) => (
            <TabsPrimitive.TabsTrigger
              value={tab.value}
              key={tab.value}
              className={cn(
                'px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-150 ease-in-out', // Added transition for smoothness
                active === tab.value
                  ? 'bg-primary text-white shadow-md ' // Keep active style distinct
                  : 'bg-white text-gray-700 hover:bg-primary/10 hover:outline-[0.5px] outline-primary-accent-foreground/30 hover:text-primary', // Added hover shadow with primary tint
              )}
            >
              {tab.label}
            </TabsPrimitive.TabsTrigger>
          ))}
        </TabsList>
        <Button
          asChild
          className="border-primary text-primary hover:bg-primary transition-colors duration-500 hover:text-white"
          variant={'outline'}
        >
          <Link
            to="/dashboard/request-management/new"
            search={{ from: active }}
          >
            Place a Request
          </Link>
        </Button>
      </div>
      {tabs.map((item) => (
        <TabsContent
          key={item.value}
          value={item.value}
          className="bg-white rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto max-w-[calc(100vw_-_90px)]">
            {tables[item.value]}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
})

TrackingTabs.displayName = 'TrackingTabs'
export default TrackingTabs
