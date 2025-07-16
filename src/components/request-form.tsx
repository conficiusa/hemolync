import { Suspense, memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { z } from 'zod'
import type { FieldErrors } from 'react-hook-form'
import type { BloodProductType, BloodType } from '@/lib/types/product.types'
import type { RequestTabSchema } from '@/routes/dashboard/request-management/new'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { newRequestSchema } from '@/lib/schemas/requests/new-request.schema'
import SelectComponent from '@/components/select-component'
import { bloodProducts, bloodTypes } from '@/lib/constants/blood-products'
import { TextInput } from '@/components/textInputBuilder'
import { priority } from '@/lib/constants/requests'
import { TextAreaInput } from '@/components/textarea-input'
import { FacilitySelectionSection } from '@/components/select-facility'
import FacilitySelectionSkeleton from '@/components/skeletons/facility-selection-skeleton'
import { useRequestDraft } from '@/lib/contexts/request.context'

export type newRequestSchemaData = z.infer<typeof newRequestSchema>
const BloodRequestForm = memo(
  ({
    from,
    edit,
  }: {
    from: z.infer<typeof RequestTabSchema>['from']
    edit: z.infer<typeof RequestTabSchema>['edit']
  }) => {
    const { setDraft, draft } = useRequestDraft()
    const navigate = useNavigate()

    // use the form hook to create the form
    const form = useForm<newRequestSchemaData>({
      resolver: zodResolver(newRequestSchema),
      defaultValues:
        edit && draft
          ? draft
          : {
              blood_product: '',
              quantity_requested: 0,
              blood_type: '',
              facility_ids: [],
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
      setDraft(data)
      navigate({
        to: '/dashboard/request-management/new/confirm-request',
        search: { from },
      })
    }

    const invalidHandler = (fieldErrors: FieldErrors<newRequestSchemaData>) => {
      if (fieldErrors.facility_ids) {
        toast.error(fieldErrors.facility_ids.message)
      }
    }

    return (
      <main className="grid grid-cols-[3fr_1fr]">
        <Card className="flex flex-col rounded-3xl bg-white col-span-2 border-0 shadow-none xl:col-span-1">
          <CardHeader className=" border-b-[0.5px] pb-4">
            <CardTitle className="text-xl">Blood Request</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            <form onSubmit={handleSubmit(onSubmit, invalidHandler)}>
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
                  <div className="py-4">
                    <Suspense fallback={<FacilitySelectionSkeleton />}>
                      <FacilitySelectionSection
                        blood_product={selectedBloodProduct}
                        blood_type={selectedBloodType}
                        form={form}
                      />
                    </Suspense>
                  </div>
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
                  Continue
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    )
  },
)

BloodRequestForm.displayName = 'BloodRequestForm'

export default BloodRequestForm
