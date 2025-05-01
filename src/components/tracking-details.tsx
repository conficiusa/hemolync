import { useEffect, useState } from 'react'

import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { cn, getRequestStatusBadgeClass } from '@/lib/utils'

interface TrackingItemDetails {
  id: string
  dateTime: {
    time: string
    date: string
  }
  productName: string
  type: string
  priority: 'Urgent' | 'Emergency' | 'Not Urgent'
  facility: string
  sentBy: string
  message: string
}

export default function TrackingDetails({ id }: { id: string }) {
  const navigate = useNavigate()
  const [trackingItem, setTrackingItem] = useState<TrackingItemDetails | null>(
    null,
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the data based on the ID
    // For now, we'll use sample data
    const fetchData = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Sample data
      setTrackingItem({
        id,
        dateTime: {
          time: '10:25',
          date: '12/09/2024',
        },
        productName: 'Whole Blood',
        type: 'A+',
        priority: 'Emergency',
        facility: 'Tamale Teaching Hospital',
        sentBy: 'Adu Bright',
        message:
          'An important way to support the bleeding disorders community is through blood donation❤️. Safe and sufficient blood supplies are vital for individuals with haemophilia',
      })
      setLoading(false)
    }

    fetchData()
  }, [id])

  const handleAccept = () => {
    // Handle accept logic
    alert('Accepted')
    navigate({
      to: '/dashboard/tracking',
    })
  }

  const handleReject = () => {
    // Handle reject logic
    alert('Rejected')
    navigate({
      to: '/dashboard/tracking',
    })
  }

  const handleBack = () => {
    navigate({
      to: '/dashboard/tracking',
    })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Back to Tracking</span>
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!trackingItem) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Back to Tracking</span>
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-center text-gray-500">Tracking item not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link
          to={'/dashboard/tracking'}
          className="flex items-center group text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-500 " />
          <span>Back to Tracking</span>
        </Link>
      </div>

      <div className="bg-background rounded-lg p-8">
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
          <div className="w-3/4 grid grid-cols-2 gap-x-10">
            {/* Date and Time */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between border-b border-muted items-center pb-3">
                <h3 className="text-muted-foreground text-sm">Date and Time</h3>
                <div>
                  <div className="font-semibold">
                    {trackingItem.dateTime.time}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {trackingItem.dateTime.date}
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <div className="flex justify-between border-b border-muted items-center pb-3">
                <h3 className="text-muted-foreground text-sm">Product Name</h3>
                <div>
                  <p className="font-semibold">{trackingItem.productName}</p>
                </div>
              </div>

              {/* Type */}
              <div className="flex justify-between border-b border-muted pb-3">
                <h3 className="text-muted-foreground text-sm">Type</h3>
                <div>
                  <p className="font-semibold">{trackingItem.type}</p>
                </div>
              </div>
              <div className="flex justify-between border-b border-muted pb-3">
                <h3 className="text-muted-foreground text-sm">Priority</h3>
                <span
                  className={cn(
                    'inline-flex px-2 py-[4px] rounded-full text-xs font-medium gap-2 items-center',
                    getRequestStatusBadgeClass(trackingItem.priority),
                  )}
                >
                  {trackingItem.priority}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex justify-between border-b border-muted pb-3">
                <h3 className="text-muted-foreground text-sm">Facility</h3>
                <div>
                  <div className="font-semibold">{trackingItem.facility}</div>
                </div>
              </div>
              {/* Sent By */}
              <div className="flex justify-between border-b border-muted pb-3">
                <h3 className="text-muted-foreground text-sm">Sent By</h3>
                <div>
                  <div className="font-semibold">{trackingItem.sentBy}</div>
                </div>
              </div>
              <div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">
                    {trackingItem.message}
                  </p>
                </div>
              </div>

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
    </div>
  )
}
