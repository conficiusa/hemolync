import { Suspense, memo } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import type { BloodProductType, BloodType } from '@/lib/types/product.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { newRequestSchema } from '@/lib/schemas/requests/new-request.schema'
import SelectComponent from '@/components/select-component'
import { bloodProducts, bloodTypes } from '@/lib/constants/blood-products'
import { TextInput } from '@/components/textInputBuilder'
import { priority } from '@/lib/constants/requests'
import { TextAreaInput } from '@/components/textarea-input'
import useMutateRequest from '@/lib/data/mutations/mutate-requests'
import { FacilitySelectionSection } from '@/components/select-facility'
import FacilitySelectionSkeleton from '@/components/skeletons/facility-selection-skeleton'

export type newRequestSchemaData = z.infer<typeof newRequestSchema>
const BloodRequestForm = memo(() => {
  const {
    addRequestMutation: { mutate },
  } = useMutateRequest()

  const form = useForm<newRequestSchemaData>({
    resolver: zodResolver(newRequestSchema),
    defaultValues: {
      blood_product: '',
      quantity_requested: 0,
      blood_type: '',
      blood_bank_id: [],
      priority: '',
      notes: '',
    },
  })
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = form
  const selectedBloodProduct = watch('blood_product') as unknown as
    | BloodProductType
    | undefined
  const selectedBloodType = watch('blood_type') as unknown as
    | BloodType
    | undefined

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

  console.log('errors', errors)

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
                  name="quantity_requested"
                  label="Quantity"
                  type="number"
                  placeholder="quantity"
                  error={errors.quantity_requested?.message}
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
              {selectedBloodProduct && selectedBloodType && (
                <Suspense fallback={<FacilitySelectionSkeleton />}>
                  <FacilitySelectionSection
                    blood_product={selectedBloodProduct}
                    blood_type={selectedBloodType}
                    form={form}
                  />
                </Suspense>
              )}
              <TextAreaInput
                control={control}
                label="Additional Information"
                name="notes"
                error={errors.notes?.message}
                placeholder="Additional Information"
                className="resize-none"
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
})

BloodRequestForm.displayName = 'BloodRequestForm'

export default BloodRequestForm
