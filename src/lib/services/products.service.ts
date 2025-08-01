import type { FetchArgs } from '@/lib/types/product.types'
import { protectedApi } from '@/lib/server/protected-api'

const productsService = {
  fetchProducts: async ({
    page,
    page_size,
    sort_by,
    sort_order,
  }: FetchArgs) => {
    try {
      const response = await protectedApi.get(
        `/blood-inventory/?page=${page ?? 1}&page_size=${page_size ?? 10}&sort_by=${sort_by ?? 'created_at'}&sort_order=${sort_order ?? 'asc'}`,
      )
      return response.data
    } catch (error: any) {
      throw error.response || error || 'Something went wrong.'
    }
  },

  addProduct: async (data: any) => {
    const response = await protectedApi.post('/blood-inventory/', data)
    return response
  },

  updateProduct: async (data: any) => {
    const response = await protectedApi.patch(
      `/blood-inventory/${data.id}`,
      data,
    )
    return response
  },

  deleteProduct: async (id: string) => {
    const response = await protectedApi.delete(`/blood-inventory/${id}`)
    return response
  },
}

export default productsService
