import { queryOptions } from '@tanstack/react-query'
import { protectedApi } from '@/lib/server/protected-api'

const fetchProducts = async () => {
    try {
    await new Promise((resolve) => setTimeout(resolve, 10000))
    const response = await protectedApi.get('/blood-inventory/')
    return response.data
  } catch (error: any) {
    throw error.response
  }
}

export const fetchProductsQuery = queryOptions({
  queryKey: ['blood-products'],
  queryFn: fetchProducts,
  staleTime: 1000 * 60 * 60, // 1 hour in milliseconds
})
