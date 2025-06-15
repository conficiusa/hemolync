import { ChevronLeft, ChevronRight, Download, Plus, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { InviteUserDialog } from '@/components/user-invite'
import StaffTable from '@/components/staff-table'
import { Button } from '@/components/ui/button'

export default function StaffManagement() {
  return (
    <div className="md:p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center pt-4">
            <div className="md:flex gap-2 items-center hidden">
              <h2 className="text-xl font-semibold text-gray-900">Users</h2>
              <Badge className="bg-[#f8e3e8] hover:bg-[#f8e3e8] text-primary-accent-foreground">
                15 users
              </Badge>
            </div>
            <div className="flex items-center max-md:justify-between gap-3 w-full">
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
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add User
                </button>
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

          <div className="overflow-x-auto max-w-[calc(100vw_-_110px)]">
            <StaffTable />
          </div>

          <div className="flex justify-between items-center">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-white text-sm font-medium">
                1
              </button>
              {[2, 3].map((page) => (
                <button
                  key={page}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 text-sm font-medium"
                >
                  {page}
                </button>
              ))}
              <span className="text-gray-500 px-1">...</span>
              {[8, 9, 10].map((page) => (
                <button
                  key={page}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 text-sm font-medium"
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700">
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
