import { useMutation } from '@tanstack/react-query'
import { protectedApi } from '@/lib/server/protected-api'

const addProduct = async (data: any) => {
  const response = await protectedApi.post('/blood-inventory/', data)
  return response
}

const updateProduct = async (data: any) => {
  const response = await protectedApi.patch(`/blood-inventory/${data.id}`, data)
  return response
}

const deleteProduct = async (id: string) => {
  const response = await protectedApi.delete(`/blood-inventory/${id}`)
  return response
}

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
