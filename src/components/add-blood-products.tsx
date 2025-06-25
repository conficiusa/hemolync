import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRouteApi } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
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
import useMutateProduct from '@/lib/data/mutations/mutate-product'
import { NaturalLanguageDatePicker } from '@/components/natural-language-datepicker'

type FormData = z.infer<typeof addBloodSchema>
const AddBloodDialog = memo(
  ({ children }: { children: React.ReactNode }) => {
    const routeApi = getRouteApi('/dashboard')
    const { user } = routeApi.useLoaderData()
    const {
      addProductMutation: { mutate: addProduct, isPending },
    } = useMutateProduct()
    const queryClient = useQueryClient()
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>({
      resolver: zodResolver(addBloodSchema),
      defaultValues: {
        blood_product: '',
        expiry_date: '',
        quantity: 0,
        blood_type: '',
        added_by: user.name,
      },
    })

    const onSubmit = handleSubmit((data: FormData) => {
      addProduct(data, {
        onSuccess: () => {
          toast.success('Product added successfully')
          queryClient.invalidateQueries({ queryKey: ['inventory'] })
        },
        onError: (err: any) => {
          toast.error(err.message || 'Product addition failed')
        },
      })
    })

    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-xl font-semibold">
              Add Blood
            </DialogTitle>
            <DialogDescription className="sr-only">
              fill the form to add the blood product
            </DialogDescription>
          </DialogHeader>
          <ScrollArea>
            <form onSubmit={onSubmit} className="h-fit max-h-[500px]">
              <div className="p-4 space-y-2">
                <div className="grid grid-cols-2 gap-5">
                  <SelectComponent
                    items={bloodProducts.map((product) => ({
                      label: product.label,
                      value: product.label,
                    }))}
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
                <div className="grid grid-cols-2 gap-5 items-start">
                  <div className="self-start">
                    <TextInput
                      control={control}
                      name="quantity"
                      label="Quantity"
                      type="number"
                      placeholder="quantity"
                      error={errors.quantity?.message}
                    />
                  </div>
                  <div className="self-start">
                    <NaturalLanguageDatePicker
                      control={control}
                      name="expiry_date"
                      label="Expiration Date"
                      placeholder="enter number of days"
                      error={errors.expiry_date?.message}
                      description="Expires on"
                    />
                  </div>
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
                  disabled={isPending}
                  type="submit"
                  className="px-3  py-3 min-w-[125px] bg-primary text-white rounded-full flex justify-center items-center text-sm font-medium disabled:opacity-65"
                >
                  {isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    'Add Product'
                  )}
                </button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.children === nextProps.children
  },
)

AddBloodDialog.displayName = 'AddBloodDialog'
export { AddBloodDialog }
