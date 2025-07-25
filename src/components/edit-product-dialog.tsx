import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRouteApi } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import type { BloodProduct } from '@/lib/types/product.types'
import type { z } from 'zod'
import type React from 'react'
import { TextInput } from '@/components/textInputBuilder'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { addBloodSchema } from '@/lib/schemas/product-schemas/add-product.schema'
import SelectComponent from '@/components/select-component'
import { bloodProducts, bloodTypes } from '@/lib/constants/blood-products'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DatePicker } from '@/components/datepicker'
import useMutateProduct from '@/lib/data/mutations/mutate-product'

type FormData = z.infer<typeof addBloodSchema>

const EditProductDialog = memo(
  ({
    children,
    product,
  }: {
    children: React.ReactNode
    product: BloodProduct
  }) => {
    const routeApi = getRouteApi('/dashboard')
    const { user } = routeApi.useLoaderData()
    const {
      updateProductMutation: { mutate: updateProduct },
    } = useMutateProduct()
    const queryClient = useQueryClient()
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>({
      resolver: zodResolver(addBloodSchema),
      defaultValues: {
        blood_product: product.blood_product,
        expiry_date: product.expiry_date,
        quantity: product.quantity,
        blood_type: product.blood_type,
        added_by: user.first_name + ' ' + user.last_name,
      },
    })

    const onSubmit = handleSubmit((data: FormData) => {
      const toastId = toast.loading('Updating product...')
      updateProduct(
        { ...data, id: product.id },
        {
          onSuccess: () => {
            toast.dismiss(toastId)
            toast.success(`${product.blood_product} updated successfully`)
            queryClient.invalidateQueries({ queryKey: ['inventory'] })
          },
          onError: (err: any) => {
            console.log(err)
            toast.dismiss(toastId)
            toast.error(err.message || 'Product update failed')
          },
        },
      )
    })

    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-xl font-semibold">
              Edit Blood Product
            </DialogTitle>
            <DialogDescription className="sr-only">
              fill the form to edit the blood product
            </DialogDescription>
          </DialogHeader>
          <ScrollArea>
            <form onSubmit={onSubmit} className="h-fit max-h-[500px]">
              <div className="p-4 space-y-1">
                <div className="grid grid-cols-2 gap-3">
                  <SelectComponent
                    items={bloodProducts}
                    label="Select blood product"
                    name="blood_product"
                    placeholder="Blood Product"
                    control={control}
                    error={errors.blood_product?.message}
                  />
                  <SelectComponent
                    items={bloodTypes}
                    label="Select blood type"
                    name="blood_type"
                    placeholder="Blood Type"
                    control={control}
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
                  <DatePicker
                    control={control}
                    name="expiry_date"
                    label="Expiration Date"
                    placeholder="expiration date"
                    error={errors.expiry_date?.message}
                  />
                </div>
                <TextInput
                  control={control}
                  name="added_by"
                  label="Added by"
                  placeholder="added by"
                  error={errors.added_by?.message}
                  disabled
                />
              </div>
              <DialogFooter className=" flex justify-center sm:justify-center gap-3 px-[24px] py-[20px]">
                <DialogClose asChild>
                  <button
                    type="button"
                    className="px-4 min-w-[125px] py-3  border border-primary rounded-full text-sm font-medium text-primary"
                  >
                    Cancel
                  </button>
                </DialogClose>
                <button
                  type="submit"
                  className="px-3  py-2 min-w-[125px] bg-primary text-white rounded-full text-sm font-medium"
                >
                  Update Product
                </button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  },
)

EditProductDialog.displayName = 'EditProductDialog'
export { EditProductDialog }
