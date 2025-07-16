import { memo } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { cn, getRequestStatusBadgeClass } from '@/lib/utils'
import { fetchRequestById } from '@/lib/data/queries/requests/fetch-requests'

const TrackingDetails = memo(() => {
  const { id } = getRouteApi('/dashboard/request-management/$id').useParams()
  const { data } = useSuspenseQuery(fetchRequestById(id))
  const navigate = useNavigate()
  const search = getRouteApi('/dashboard/request-management/$id').useSearch()

  const handleAccept = () => {
    // Handle accept logic
    alert('Accepted')
    navigate({
      to: '/dashboard/request-management',
      search: {
        tab: search.from,
      },
    })
  }

  const handleReject = () => {
    // Handle reject logic
    alert('Rejected')
    navigate({
      to: '/dashboard/request-management',
      search: {
        tab: search.from,
      },
    })
  }


  return (
    <div className="bg-background rounded-lg p-8 shadow-sm">
      <div className="flex">
        <div className="w-1/4 flex justify-center">
          <div className="w-32 h-36 bg-primary-accent/65 flex items-center justify-center rounded-lg m-4">
            <img
              src="/icons/blood-bag.svg"
              alt="Blood Bag"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </div>
        <div className="w-3/4 grid grid-cols-2 gap-x-14">
          {/* Date and Time */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between border-b border-muted items-center pb-3">
              <h3 className="text-muted-foreground text-sm">Date and Time</h3>
              <div className="space-y-1 text-right">
                <div className="font-semibold text-sm">
                  {format(new Date(data.created_at), 'dd/MM/yyyy')}
                </div>
                <div className="text-muted-foreground text-sm">
                  {format(new Date(data.created_at), 'hh:mm a')}
                </div>
              </div>
            </div>

            {/* Product Name */}
            <div className="flex justify-between border-b border-muted items-center pb-3 text-sm">
              <h3 className="text-muted-foreground text-sm">Product Name</h3>
              <div>
                <p className="font-semibold">{data.blood_product}</p>
              </div>
            </div>

            {/* Type */}
            <div className="flex justify-between border-b border-muted pb-3">
              <h3 className="text-muted-foreground text-sm">Type</h3>
              <div>
                <p className="font-semibold text-sm">{data.blood_type}</p>
              </div>
            </div>
            <div className="flex justify-between border-b border-muted pb-3">
              <h3 className="text-muted-foreground text-sm">Priority</h3>
              <span
                className={cn(
                  'inline-flex px-2 py-[4px] rounded-full text-xs font-medium gap-2 items-center',
                  getRequestStatusBadgeClass('pending'),
                )}
              >
                Urgent
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-between border-b border-muted pb-3">
              <h3 className="text-muted-foreground text-sm">Facility</h3>
              <div className="text-sm font-semibold">
                {/* <div className="font-semibold">{data.hospital_name}</div> */}{' '}
                Tamale Teaching Hospital
              </div>
            </div>
            {/* Sent By */}
            <div className="flex justify-between border-b border-muted pb-3">
              <h3 className="text-muted-foreground text-sm">Requested By</h3>
              <div>
                <div className="font-semibold text-sm">Adda Conficius</div>
              </div>
            </div>
            {data.notes && (
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-muted-foreground text-sm">{data.notes}</p>
              </div>
            )}

            {/* Priority */}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={handleAccept}
          className="px-6 py-2 bg-green-700 text-white rounded-lg"
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          className="px-6 py-2 bg-red-600 text-white rounded-lg "
        >
          Reject
        </button>
      </div>
    </div>
  )
})

TrackingDetails.displayName = 'TrackingDetails'

export default TrackingDetails
