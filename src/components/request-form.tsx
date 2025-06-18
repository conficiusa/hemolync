import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useSuspenseQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { newRequestSchema } from '@/lib/schemas/requests/new-request.schema'
import SelectComponent from '@/components/select-component'
import { bloodProducts, bloodTypes } from '@/lib/constants/blood-products'
import { TextInput } from '@/components/textInputBuilder'
import { priority } from '@/lib/constants/requests'
import { fetchBloodBanksQuery } from '@/lib/data/queries/facilities/fetch-facilities'
import { TextAreaInput } from '@/components/textarea-input'
import useMutateRequest from '@/lib/data/mutations/mutate-requests'

export type newRequestSchemaData = z.infer<typeof newRequestSchema>
export const BloodRequestFiltersSection = () => {
  const { data: bloodbanks } = useSuspenseQuery(fetchBloodBanksQuery)
  const {
    addRequestMutation: { mutate },
  } = useMutateRequest()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<newRequestSchemaData>({
    resolver: zodResolver(newRequestSchema),
    defaultValues: {
      blood_product: '',
      quantity: 0,
      blood_type: '',
      blood_product_id: '',
      dispatched_to_id: '',
    },
  })

  const onSubmit = (data: newRequestSchemaData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('Blood request placed successfully')
        reset()
      },
      onError: () => {
        toast.error('Failed to place blood request')
      },
    })
  }

  console.log(errors)

  return (
    <main className="grid grid-cols-2">
      <Card className="flex flex-col rounded-3xl bg-white col-span-2 border-0 shadow-none xl:col-span-1">
        <CardHeader className=" border-b-[0.5px] pb-4">
          <CardTitle className="text-xl">Blood Request</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <SelectComponent
                  name="blood_product"
                  placeholder="Select Blood Product"
                  control={control}
                  items={bloodProducts.map((item) => {
                    return { label: item.label, value: item.label }
                  })}
                  label="Blood Product"
                  error={errors.blood_product?.message}
                />
                <SelectComponent
                  placeholder="Select Blood Type"
                  control={control}
                  items={bloodTypes}
                  label="Blood Type"
                  name="blood_type"
                  error={errors.blood_type?.message}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextInput
                  control={control}
                  name="quantity"
                  label="Quantity"
                  type="number"
                  placeholder="quantity"
                  error={errors.quantity?.message}
                />
                <SelectComponent
                  placeholder="Priority"
                  control={control}
                  items={priority}
                  label="Priority"
                  name="priority"
                  error={errors.priority?.message}
                />
              </div>
              <SelectComponent
                placeholder="Select Facility"
                control={control}
                items={bloodbanks.map((item) => {
                  return { label: item.facility_name, value: item.id }
                })}
                label="Select Facility"
                name="dispatched_to_id"
                error={errors.dispatched_to_id?.message}
              />
              <TextAreaInput
                control={control}
                label="Additional Information"
                name="notes"
                error={errors.notes?.message}
                placeholder="Additional Information"
                rows={3}
              />
            </div>
            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3 py-5 w-full">
              <Button
                onClick={() => reset()}
                variant="outline"
                className="h-12 w-[125px] rounded-[50px] border-[#85143e] text-primary-800 font-semibold font-['Inter',Helvetica]"
              >
                Cancel
              </Button>
              <Button className="h-12 w-[125px] rounded-[50px]" type="submit">
                Place Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
