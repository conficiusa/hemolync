import { toast } from 'sonner'
import { z } from 'zod'
import { Navigate, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Edit, Loader2 } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { newRequestSchemaData } from '@/components/request-form'
import { useRequestDraft } from '@/lib/contexts/request.context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import useMutateRequest from '@/lib/data/mutations/mutate-requests'
import { fetchBloodBanksQuery } from '@/lib/data/queries/facilities/fetch-facilities'
import {
  COMBINED_TAB_VALUES,
  DEFAULT_TAB,
} from '@/lib/types/request-management.types'

const RequestTabSchema = z.object({
  from: z.enum(COMBINED_TAB_VALUES).catch(DEFAULT_TAB),
})
export const Route = createFileRoute(
  '/dashboard/request-management/new/confirm-request',
)({
  component: RouteComponent,
  validateSearch: (search) => RequestTabSchema.parse(search),
  loader: ({ context: { queryClient } }) => {
    return queryClient
  },
})

function RouteComponent() {
  const { draft, clearDraft } = useRequestDraft()
  const navigate = useNavigate()
  const { from } = Route.useSearch()
  const {
    addRequestMutation: { mutate: createRequest, isPending },
  } = useMutateRequest()
  const { invalidateQueries } = Route.useLoaderData()

  // Fetch facilities data to get facility names
  const {
    data: { items: bloodbanks },
  } = useSuspenseQuery(
    fetchBloodBanksQuery({
      blood_product: draft?.blood_product as any,
      blood_type: draft?.blood_type as any,
    }),
  )

  // Filter selected facilities
  const selectedFacilities = bloodbanks.filter((facility) =>
    draft?.facility_ids.includes(facility.facility_id),
  )

  const onCancel = () => {
    clearDraft()
    navigate({
      to: '/dashboard/request-management/new',
      search: { from },
      replace: true,
    })
  }

  const onEdit = () => {
    navigate({
      to: '/dashboard/request-management/new',
      search: { from, edit: true },
    })
  }

  const onSubmit = (data: newRequestSchemaData) => {
    const toastId = toast.loading('Creating request...')
    createRequest(data, {
      onSuccess: async () => {
        toast.dismiss(toastId)
        await invalidateQueries()
        toast.success('Request created successfully')
        clearDraft()
        navigate({ to: '/dashboard/request-management/new', search: { from } })
      },
      onError: () => {
        toast.dismiss(toastId)
        toast.error('Request creation failed')
      },
    })
  }

  if (!draft)
    return <Navigate to="/dashboard/request-management/new" search={{ from }} />

  return (
    <div className="grid grid-cols-[3fr_1fr] gap-3">
      <div className="bg-background p-6 rounded-xl flex flex-col gap-3">
        {/* Blood Product Details Card */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Request Summary</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={onEdit}
            >
              <span className="hidden md:block border-r border-gray-200 pr-2">
                Edit Request
              </span>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Card className="w-full border border-solid border-gray-200 rounded-xl p-0 shadow-none">
          <CardContent className="flex items-center justify-between p-3">
            <div className="inline-flex flex-col items-start gap-3 relative">
              <div className="relative w-fit mt-[-1.00px] font-text-sm-semibold font-semibold text-gray-700 text-sm tracking-[var(--text-sm-semibold-letter-spacing)] leading-[var(--text-sm-semibold-line-height)] whitespace-nowrap">
                Blood Product
              </div>

              <div className="w-fit font-text-sm-medium font-medium text-gray-600 text-sm leading-[var(--text-sm-medium-line-height)] whitespace-nowrap relative tracking-[var(--text-sm-medium-letter-spacing)]">
                {draft.blood_product}
              </div>
            </div>
            <div className="inline-flex flex-col items-start gap-3 relative">
              <div className="relative w-fit mt-[-1.00px] font-text-sm-semibold font-semibold text-gray-700 text-sm tracking-[var(--text-sm-semibold-letter-spacing)] leading-[var(--text-sm-semibold-line-height)] whitespace-nowrap">
                Blood Type
              </div>
              <div className="w-fit font-text-sm-medium font-medium text-gray-600 text-sm leading-[var(--text-sm-medium-line-height)] whitespace-nowrap relative tracking-[var(--text-sm-medium-letter-spacing)]">
                {draft.blood_type}
              </div>
            </div>
            <div className="inline-flex flex-col items-start gap-3 relative">
              <div className="relative w-fit mt-[-1.00px] font-text-sm-semibold font-semibold text-gray-700 text-sm tracking-[var(--text-sm-semibold-letter-spacing)] leading-[var(--text-sm-semibold-line-height)] whitespace-nowrap">
                Quantity
              </div>

              <div className="w-fit font-text-sm-medium font-medium text-gray-600 text-sm leading-[var(--text-sm-medium-line-height)] whitespace-nowrap relative tracking-[var(--text-sm-medium-letter-spacing)]">
                {draft.quantity_requested}
              </div>
            </div>
            <div className="inline-flex flex-col items-start gap-3 relative">
              <div className="relative w-fit mt-[-1.00px] font-text-sm-semibold font-semibold text-gray-700 text-sm tracking-[var(--text-sm-semibold-letter-spacing)] leading-[var(--text-sm-semibold-line-height)] whitespace-nowrap">
                Priority
              </div>
              <div className="inline-flex items-start relative">
                <Badge
                  variant="outline"
                  className={`inline-flex items-center justify-center px-2 py-0.5 ${getBadgeColor(draft.priority)} rounded-2xl border-0`}
                >
                  {draft.priority}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sending To Section */}
        <Card className="flex flex-col items-start gap-3 p-3 relative self-stretch w-full bg-gray-100 rounded-xl border-0">
          <div className="flex flex-col items-start relative self-stretch w-full">
            <div className="flex items-center gap-2.5 px-0 py-[5px] relative self-stretch w-full">
              <div className="w-fit mt-[-1.00px] font-text-sm-medium font-medium text-gray-800 text-sm leading-[var(--text-sm-medium-line-height)] whitespace-nowrap relative tracking-[var(--text-sm-medium-letter-spacing)]">
                Sending to ({selectedFacilities.length}{' '}
                {selectedFacilities.length === 1 ? 'facility' : 'facilities'})
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start justify-center gap-3 relative self-stretch w-full">
            {selectedFacilities.map((facility, index) => (
              <Card
                key={index}
                className="flex gap-2 p-4 relative self-stretch w-full bg-white rounded-2xl overflow-hidden border-2 border-solid border-primary shadow-none"
              >
                <CardContent className="p-0 inline-flex flex-col items-start justify-center gap-2 relative">
                  <div className="w-fit mt-[-1.00px] font-text-md-bold font-bold text-gray-800 text-base leading-[var(--text-md-bold-line-height)] whitespace-nowrap relative tracking-[var(--text-md-bold-letter-spacing)]">
                    {facility.facility_name}
                  </div>
                  <div className="w-fit font-text-sm-regular font-normal text-gray-600 text-sm leading-[var(--text-sm-regular-line-height)] whitespace-nowrap relative tracking-[var(--text-sm-regular-letter-spacing)]">
                    2km away
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Card>

        {/* Other Info Section */}
        <div className="flex flex-col h-[156px] items-start relative self-stretch w-full">
          <div className="flex items-center gap-2.5 px-0 py-[5px] relative self-stretch w-full">
            <div className="w-fit mt-[-1.00px] font-text-sm-medium font-medium text-gray-700 text-sm leading-[var(--text-sm-medium-line-height)] whitespace-nowrap relative tracking-[var(--text-sm-medium-letter-spacing)]">
              Other Info
            </div>
          </div>

          <Textarea
            className="flex h-[126px] items-start gap-2 p-4 relative self-stretch w-full rounded-2xl overflow-hidden border border-solid border-gray-300 font-text-sm-regular text-gray-400 text-sm resize-none"
            readOnly
            defaultValue={draft.notes}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 px-6 py-5 relative self-stretch w-full bg-white rounded-3xl overflow-hidden">
          <div className="flex w-[165px] items-start gap-4 relative self-stretch">
            <Button
              variant="outline"
              className="flex h-14 items-center justify-center gap-2 px-6 py-3 relative flex-1 grow rounded-[50px] overflow-hidden border border-solid border-primary-800 text-primary-800 font-semibold"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>

          <div className="flex w-[165px] items-start gap-4 relative self-stretch">
            <Button
              onClick={() => onSubmit(draft)}
              disabled={isPending}
              className="flex h-14 items-center justify-center gap-2 px-6 py-3 relative flex-1 grow rounded-[50px]  font-semibold"
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Place Request'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const getBadgeColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-200 hover:bg-red-200 text-red-800'
    case 'not-urgent':
      return 'bg-amber-200 text-amber-800 hover:bg-amber-200'
  }
}
