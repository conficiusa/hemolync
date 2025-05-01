import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import type React from 'react'
import { TextInputBuilder } from '@/components/textInputBuilder'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { addBloodSchema } from '@/lib/schemas/product-schemas/add-product.schema'
import SelectComponent from '@/components/select-component'
import { bloodProducts } from '@/lib/constants/blood-products'
import { ScrollArea } from '@/components/ui/scroll-area'

type FormData = z.infer<typeof addBloodSchema>
const AddBloodDialog = memo(({ children }: { children: React.ReactNode }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addBloodSchema),
    defaultValues: {
      batch_number: '',
      blood_product: '',
      collection_date: '',
      expiration_date: '',
      type: '',
      added_by: 'Bright Adu',
    },
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-semibold">Add Blood</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[80dvh]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <TextInputBuilder
                  control={control}
                  name="batch_number"
                  label="Batch Number"
                  placeholder="Enter batch number"
                  error={errors.batch_number?.message}
                />

                <TextInputBuilder
                  control={control}
                  name="collection_date"
                  label="Collection Date"
                  placeholder="Enter collection Date"
                  error={errors.collection_date?.message}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <SelectComponent
                  items={bloodProducts}
                  label="Select blood product"
                  name="blood_product"
                  placeholder="Blood Product"
                  control={control}
                  error={errors.blood_product?.message}
                />
                <TextInputBuilder
                  control={control}
                  name="type"
                  label="Blood Group"
                  placeholder="eg. AB+"
                  error={errors.type?.message}
                />
              </div>

              <TextInputBuilder
                control={control}
                name="expiration_date"
                label="Expiration Date"
                placeholder="expiration date"
                error={errors.expiration_date?.message}
              />
              <TextInputBuilder
                control={control}
                name="added_by"
                label="Added by"
                placeholder="added by"
                error={errors.added_by?.message}
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
                Add Product
              </button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
})

AddBloodDialog.displayName = 'AddBloodDialog'
export { AddBloodDialog }
