import { memo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { BloodProduct } from '@/lib/types/product.types'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import useMutateProduct from '@/lib/data/mutations/mutate-product'

interface DeleteProductDialogProps {
  children: React.ReactNode
  product: BloodProduct
}

const DeleteProductDialog = memo(function DeleteProductDialog({
  children,
  product,
}: DeleteProductDialogProps) {
  const {
    deleteProductMutation: { mutate: deleteProduct, isLoading },
  } = useMutateProduct()
  const queryClient = useQueryClient()

  const handleDelete = () => {
    const toastId = toast.loading('Deleting product...')
    deleteProduct(product.id, {
      onSuccess: () => {
        toast.dismiss(toastId)
        toast.success(`${product.blood_product} deleted successfully`)
        queryClient.invalidateQueries({ queryKey: ['inventory'] })
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
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
})

DeleteProductDialog.displayName = 'DeleteProductDialog'
export { DeleteProductDialog }
