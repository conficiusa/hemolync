import { useMutation } from '@tanstack/react-query'
import productsService from '@/lib/services/products.service'

const { addProduct, updateProduct, deleteProduct } = productsService
const useMutateProduct = () => {
  // add product
  const addProductMutation = useMutation({
    mutationKey: ['inventory'],
    mutationFn: addProduct,
  })

  // update product
  const updateProductMutation = useMutation({
    mutationKey: ['inventory'],
    mutationFn: updateProduct,
  })

  // delete product
  const deleteProductMutation = useMutation({
    mutationKey: ['inventory'],
    mutationFn: deleteProduct,
  })

  return { addProductMutation, updateProductMutation, deleteProductMutation }
}
export default useMutateProduct
