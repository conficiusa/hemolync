import { Plus, Users } from 'lucide-react'
import { InviteUserDialog } from './user-invite'

export function StaffTableEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="flex items-center justify-center rounded-full bg-muted p-4">
        <Users className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">
          No staff members available
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          No staff members available. Invite a staff member to get started.
        </p>
      </div>
      <InviteUserDialog>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-sm text-sm font-medium">
          <Plus className="h-4 w-4" /> Invite Staff Member
        </button>
      </InviteUserDialog>
    </div>
  )
}
