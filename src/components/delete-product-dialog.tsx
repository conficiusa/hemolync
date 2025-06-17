import { memo } from 'react'
import { toast } from 'sonner'
import type { BloodProduct } from '@/lib/types/product.types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import useMutateProduct from '@/lib/data/mutations/mutate-product'

interface DeleteProductDialogProps {
  children: React.ReactNode
  product: BloodProduct
  onDeleted?: () => void
}

const DeleteProductDialog = memo(function DeleteProductDialog({
  children,
  product,
  onDeleted,
}: DeleteProductDialogProps) {
  
  const {
    deleteProductMutation: { mutate: deleteProduct, isPending },
  } = useMutateProduct()

  const handleDelete = () => {
    const toastId = toast.loading('Deleting product...')
    deleteProduct(product.id, {
      onSuccess: () => {
        toast.dismiss(toastId)
        toast.success(`${product.blood_product} deleted successfully`)
        onDeleted?.()
      },
      onError: (err: any) => {
        console.error(err)
        toast.dismiss(toastId)
        toast.error(err.message || 'Product deletion failed')
      },
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Blood Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {product.blood_product}? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
})

DeleteProductDialog.displayName = 'DeleteProductDialog'
export { DeleteProductDialog }
