import * as TabsPrimitive from '@radix-ui/react-tabs'
import { Tabs, TabsList } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

type TabsType = {
  label: string
  value: string
}
type customTabsProps = {
  tabs: Array<TabsType>
  activeTab: string
  onTabChange: (tab: string) => void
}
const CustomTabs = ({ tabs, activeTab, onTabChange }: customTabsProps) => {
  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={onTabChange}
      className="border-b"
    >
      <div className="flex justify-center px-6">
        <TabsList className="flex w-full max-w-xs justify-center gap-9">
          {tabs.map((tab) => (
            <TabsPrimitive.TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                'py-3 text-center relative',
                activeTab === tab.value
                  ? 'text-gray-800 font-medium'
                  : 'text-gray-400',
              )}
            >
              <span
                className={cn(
                  'p-2',
                  activeTab === tab.value &&
                    'flex items-center border-b-2 border-b-primary',
                )}
              >
                {tab.label}
              </span>
            </TabsPrimitive.TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  )
}

export default CustomTabs
