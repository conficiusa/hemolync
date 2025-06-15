import { Eye } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { TooltipBuilder } from './tooltip-builder'
import {
  cn,
  getRequestStatusBadgeClass,
  getRequestStatusBadgeClassComplementary,
} from '@/lib/utils'

type TrackingStatus = 'Accepted' | 'Rejected' | 'Pending'
interface TrackingItem {
  id: number
  acceptedBy: {
    name: string
    avatar: string
  }
  product: string
  hospital: string
  dateTime: string
  priority: 'Urgent' | 'Emergency' | 'Not Urgent'
  status: TrackingStatus
}

const trackingItems: Array<TrackingItem> = [
  {
    id: 1,
    acceptedBy: {
      name: 'Olivia Rhye',
      avatar: '/profile.avif',
    },
    product: 'Whole Blood',
    priority: 'Emergency',
    hospital: 'Tamale teaching Hospital',
    dateTime: '12/04/2024: 12:10',
    status: 'Pending',
  },
  {
    id: 2,
    acceptedBy: {
      name: 'Olivia Rhye',
      avatar: '/profile.avif',
    },
    product: 'Platelets',
    hospital: 'Tamale teaching Hospital',
    dateTime: '12/04/2024: 12:10',
    status: 'Accepted',
    priority: 'Emergency',
  },
  {
    id: 3,
    acceptedBy: {
      name: 'Olivia Rhye',
      avatar: '/profile.avif',
    },
    product: 'Whole Blood',
    hospital: 'Tamale teaching Hospital',
    dateTime: '12/04/2024: 12:10',
    status: 'Pending',
    priority: 'Emergency',
  },
  {
    id: 4,
    acceptedBy: {
      name: 'Olivia Rhye',
      avatar: '/profile.avif',
    },
    product: 'Whole Blood',
    hospital: 'Tamale teaching Hospital',
    dateTime: '12/04/2024: 12:10',
    status: 'Accepted',
    priority: 'Not Urgent',
  },
  {
    id: 5,
    acceptedBy: {
      name: 'Olivia Rhye',
      avatar: '/profile.avif',
    },
    product: 'Whole Blood',
    hospital: 'Tamale teaching Hospital',
    dateTime: '12/04/2024: 12:10',
    status: 'Accepted',
    priority: 'Not Urgent',
  },
  {
    id: 6,
    acceptedBy: {
      name: 'Olivia Rhye',
      avatar: '/profile.avif',
    },
    product: 'Whole Blood',
    hospital: 'Tamale teaching Hospital',
    dateTime: '12/04/2024: 12:10',
    status: 'Rejected',
    priority: 'Urgent',
  },
  {
    id: 7,
    acceptedBy: {
      name: 'Olivia Rhye',
      avatar: '/profile.avif',
    },
    product: 'Whole Blood',
    hospital: 'Tamale teaching Hospital',
    dateTime: '12/04/2024: 12:10',
    status: 'Rejected',
    priority: 'Not Urgent',
  },
  {
    id: 8,
    acceptedBy: {
      name: 'Olivia Rhye',
      avatar: '/profile.avif',
    },
    product: 'Whole Blood',
    hospital: 'Tamale teaching Hospital',
    dateTime: '12/04/2024: 12:10',
    status: 'Rejected',
    priority: 'Not Urgent',
  },
  {
    id: 9,
    acceptedBy: {
      name: 'Olivia Rhye',
      avatar: '/profile.avif',
    },
    product: 'Whole Blood',
    hospital: 'Tamale teaching Hospital',
    dateTime: '12/04/2024: 12:10',
    status: 'Rejected',
    priority: 'Emergency',
  },
]

const TrackingTable = () => {
  return (
    <table className="w-full whitespace-nowrap">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground">
            Requested by
          </th>
          <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground">
            Product
          </th>
          <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground">
            Status
          </th>
          <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground">
            Request Date
          </th>
          <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground">
            Priority
          </th>
          <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {trackingItems.map((item, index) => (
          <tr
            key={item.id}
            className={cn(
              'border-b border-gray-100',
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
            )}
          >
            <td className="py-4 px-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={item.acceptedBy.avatar || '/placeholder.svg'}
                    alt={'profile image '}
                    height={40}
                    width={40}
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium whitespace-nowrap flex flex-col">
                  <p>{item.acceptedBy.name}</p>
                  <p className="text-xs text-muted-foreground font-normal">
                    {item.hospital}
                  </p>
                </span>
              </div>
            </td>
            <td className="py-4 px-6 text-sm text-muted-foreground">
              {item.product}
            </td>
            <td className="py-4 px-6 text-sm text-muted-foreground">
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRequestStatusBadgeClass(
                  item.status,
                )}`}
              >
                {item.status}
              </span>
            </td>
            <td className="py-4 px-6 text-sm text-muted-foreground">
              {item.dateTime}
            </td>
            <td className="py-4 px-6">
              <span
                className={cn(
                  'inline-flex px-2 py-[4px] rounded-full text-xs font-medium gap-2 items-center',
                  getRequestStatusBadgeClass(item.priority),
                )}
              >
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    getRequestStatusBadgeClassComplementary(item.priority),
                  )}
                />
                {item.priority}
              </span>
            </td>
            <td className="py-4 px-6">
              <Link
                to={`/dashboard/request-management/$id`}
                params={{ id: item.id.toString() }}
              >
                <TooltipBuilder content="View Details">
                  <Eye size={28} className="hover:opacity-70" strokeWidth={1} />
                </TooltipBuilder>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TrackingTable
