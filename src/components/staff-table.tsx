import { memo } from 'react'
import { DeleteUserDialog } from '@/components/delete-user'
import { EditUserDialog } from '@/components/edit-user'
import type { Role } from '@/lib/types/system-types'

interface User {
  id: number
  name: string
  email: string
  dateJoined: string
  role: Role
  avatar: string
}

const users: User[] = [
  {
    id: 1,
    name: 'Olivia Rhye',
    email: 'olivia@untitledui.com',
    dateJoined: '12/04/2024',
    role: 'Administrator',
    avatar: '/profile.avif',
  },
  {
    id: 2,
    name: 'Olivia Rhye',
    email: 'phoenix@untitledui.com',
    dateJoined: '12/04/2024',
    role: 'Staff',
    avatar: '/profile.avif',
  },
  {
    id: 3,
    name: 'Olivia Rhye',
    email: 'lana@untitledui.com',
    dateJoined: '12/04/2024',
    role: 'Blood-bank in-charge',
    avatar: '/profile.avif',
  },
  {
    id: 4,
    name: 'Olivia Rhye',
    email: 'demi@untitledui.com',
    dateJoined: '12/04/2024',
    role: 'Staff',
    avatar: '/profile.avif',
  },
  {
    id: 5,
    name: 'Olivia Rhye',
    email: 'candice@untitledui.com',
    dateJoined: '12/04/2024',
    role: 'Blood-bank in-charge',
    avatar: '/profile.avif',
  },
  {
    id: 6,
    name: 'Olivia Rhye',
    email: 'natali@untitledui.com',
    dateJoined: '12/04/2024',
    role: 'Blood-bank in-charge',
    avatar: '/profile.avif',
  },
  {
    id: 7,
    name: 'Olivia Rhye',
    email: 'drew@untitledui.com',
    dateJoined: '12/04/2024',
    role: 'Administrator',
    avatar: '/profile.avif',
  },
  {
    id: 8,
    name: 'Olivia Rhye',
    email: 'orlando@untitledui.com',
    dateJoined: '12/04/2024',
    role: 'Blood-bank in-charge',
    avatar: '/profile.avif',
  },
  {
    id: 9,
    name: 'Olivia Rhye',
    email: 'andi@untitledui.com',
    dateJoined: '12/04/2024',
    role: 'Administrator',
    avatar: '/profile.avif',
  },
]

const getRoleBadgeClass = (role: Role) => {
  switch (role) {
    case 'Administrator':
      return 'bg-amber-50 text-amber-700'
    case 'Staff':
      return 'bg-blue-50 text-blue-700'
    case 'Blood-bank in-charge':
      return 'bg-pink-50 text-pink-700'
    default:
      return 'bg-gray-50 text-gray-700'
  }
}

const TableRow = memo(({ user }: { user: User }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-100">
    <td className="py-4 px-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
          <img
            src={user.avatar || '/placeholder.svg'}
            alt={user.name}
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
        <span className="text-sm font-medium text-gray-900">{user.name}</span>
      </div>
    </td>
    <td className="py-4 px-4 text-sm text-gray-500">{user.email}</td>
    <td className="py-4 px-4 text-sm text-gray-500">{user.dateJoined}</td>
    <td className="py-4 px-4">
      <span
        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(
          user.role,
        )}`}
      >
        {user.role}
      </span>
    </td>
    <td className="py-4 px-4">
      <div className="flex items-center gap-2">
        <DeleteUserDialog />
        <EditUserDialog
          user={{
            ...user,
            first_name: user.name.split(' ')[0],
            last_name: user.name.split(' ')[1],
          }}
        />
      </div>
    </td>
  </tr>
))

TableRow.displayName = 'TableRow'

const StaffTable = memo(() => {
  return (
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
            Role
          </th>
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <TableRow key={user.id} user={user} />
        ))}
      </tbody>
    </table>
  )
})

StaffTable.displayName = 'StaffTable'

export default StaffTable
