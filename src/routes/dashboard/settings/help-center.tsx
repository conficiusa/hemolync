import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SettingsFaq from '@/components/settings-faq'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { ChevronRight, MessageCircle, MessageSquare } from 'lucide-react'

export const Route = createFileRoute('/dashboard/settings/help-center')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-2 md:p-6 space-y-6">
      <div className="font-bold text-gray-700 text-lg tracking-[0] leading-[normal]">
        Help Center
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="flex space-x-2 border-b bg-background shadow-none rounded-none">
          <TabsPrimitive.TabsTrigger
            value="faq"
            className="px-4 py-2 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-primary data-[state=inactive]:border-transparent"
          >
            FAQ
          </TabsPrimitive.TabsTrigger>
          <TabsPrimitive.TabsTrigger
            value="contact"
            className="px-4 py-2 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-primary data-[state=inactive]:border-transparent"
          >
            Contact Us
          </TabsPrimitive.TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-0">
          <SettingsFaq />
        </TabsContent>

        <TabsContent value="contact" className="mt-0">
          <div className="space-y-2">
            <div className="flex gap-2 items-center p-4 border-1 border-gray-200 max-w-sm rounded-lg cursor-pointer hover:bg-gray-50">
              <a
                href="https://wa.me/2347031234567"
                className="flex gap-2 items-center w-full"
              >
                <span className="flex gap-2 items-center flex-1">
                  <MessageCircle className="size-4" /> Contact us on whatsapp
                </span>
                <ChevronRight className="size-4" />
              </a>{' '}
            </div>
            <div className="flex gap-2 items-center p-4 border-1 border-gray-200 max-w-sm rounded-lg cursor-pointer hover:bg-gray-50">
              <a
                href="mailto:support@hemolync.com"
                className="flex gap-2 items-center w-full"
              >
                <span className="flex gap-2 items-center flex-1">
                  <MessageSquare className="size-4" /> Send us an email{' '}
                </span>
                <ChevronRight className="size-4" />
              </a>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
