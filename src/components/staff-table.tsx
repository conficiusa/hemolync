import { format } from 'date-fns'
import { memo } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { Role, User } from '@/lib/types/system-types'
import { StaffTableEmpty } from '@/components/staff-table-empty'
import { DeleteUserDialog } from '@/components/delete-user'
import { EditUserDialog } from '@/components/edit-user'
import { fetchStaffQuery } from '@/lib/data/queries/users/fetch-staff'

const getRoleBadgeClass = (role: Role) => {
  switch (role) {
    case 'facility_administrator':
      return 'bg-amber-50 text-amber-700'
    case 'staff':
      return 'bg-blue-50 text-blue-700'
    case 'lab_manager':
      return 'bg-pink-50 text-pink-700'
    default:
      return 'bg-gray-50 text-gray-700'
  }
}

const TableRow = memo(({ user }: { user: User }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-100">
    <td className="py-4 px-4 text-sm text-gray-500">
      {user.first_name} {user.last_name}
    </td>
    <td className="py-4 px-4 text-sm text-gray-500">{user.email}</td>
    <td className="py-4 px-4 text-sm text-gray-500">
      {format(user.created_at, 'MMM d, yyyy')}
    </td>
    <td className="py-4 px-4 text-sm text-gray-500">
      {user.last_login ? format(user.last_login, 'MMM d, yyyy') : 'N/A'}
    </td>
    <td className="py-4 px-4">
      <span
        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(
          user.role,
        )}`}
      >
        {user.role
          .split('_')
          .join(' ')
          .replace('facility', 'Facility')
          .charAt(0)
          .toUpperCase() +
          user.role
            .split('_')
            .join(' ')
            .replace('facility', 'Facility')
            .slice(1)}
      </span>
    </td>
    <td className="py-4 px-4">
      <div className="flex items-center gap-2">
        <DeleteUserDialog />
        <EditUserDialog
          user={{
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            phone: user.phone,
          }}
        />
      </div>
    </td>
  </tr>
))

TableRow.displayName = 'TableRow'

const StaffTable = memo(() => {
  const { data } = useSuspenseQuery(fetchStaffQuery())

  if (!data.length) return <StaffTableEmpty />
  return (
    <>
      <div className="overflow-x-auto max-w-[calc(100vw_-_110px)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Email address
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Date Joined
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Last Login
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Role
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <TableRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
})

StaffTable.displayName = 'StaffTable'

export default StaffTable
