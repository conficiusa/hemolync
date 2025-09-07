import { memo } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Download, Plus, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { InviteUserDialog } from '@/components/user-invite'
import { fetchStaffQuery } from '@/lib/data/queries/users/fetch-staff'

const StaffManagementHeader = memo(() => {
  const { data } = useSuspenseQuery(fetchStaffQuery())

  if (!data.length) return null
  return (
    <div className="flex justify-between items-center pt-4">
      <div className="flex gap-2 items-center">
        <h2 className="text-xl font-semibold text-gray-900">Users</h2>
        <Badge className="bg-[#f8e3e8] hover:bg-[#f8e3e8] text-primary-accent-foreground">
          {data.length} users
        </Badge>
      </div>
      <div className="flex items-center max-md:justify-between gap-3 w-full md:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search user"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg max-sm:w-[250px] md:w-[300px] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <InviteUserDialog>
            <Button>
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </InviteUserDialog>
          <Button
            size={'icon'}
            variant={'outline'}
            className="border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
})

StaffManagementHeader.displayName = 'StaffManagementHeader'
export default StaffManagementHeader
