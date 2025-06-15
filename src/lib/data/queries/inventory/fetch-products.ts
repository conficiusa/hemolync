import { queryOptions } from '@tanstack/react-query'
import { protectedApi } from '@/lib/server/protected-api'

const fetchProducts = async () => {
  try {
    const response = await protectedApi.get('/blood-inventory/')
    return response.data
  } catch (error: any) {
    throw error.response
  }
}

export const fetchProductsQuery = queryOptions({
  queryKey: ['inventory'],
  queryFn: fetchProducts,
  staleTime: 1000 * 60 * 60,
})
