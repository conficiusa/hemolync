import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import type { BloodProductResponse } from '@/lib/types/product.types'
import { protectedApi } from '@/lib/server/protected-api'

export type ProductSortBy =
  | 'created_at'
  | 'updated_at'
  | 'expiry_date'
  | 'blood_type'
  | 'blood_product'
  | 'quantity'
export type ProductSortOrder = 'asc' | 'desc'
type FetchArgs = {
  page?: number
  page_size?: number
  sort_by?: ProductSortBy
  sort_order?: ProductSortOrder
}

const fetchProducts = async ({
  page,
  page_size,
  sort_by,
  sort_order,
}: FetchArgs) => {
  try {
    const response = await protectedApi.get(
      `/blood-inventory/?page=${page ?? 1}&page_size=${page_size ?? 5}&sort_by=${sort_by ?? 'created_at'}&sort_order=${sort_order ?? 'asc'}`,
    )
    return response.data as BloodProductResponse
  } catch (error: any) {
    throw error.response
  }
}

export const fetchProductsQuery = (
  page: number = 1,
  sort_by: ProductSortBy = 'created_at',
  sort_order: ProductSortOrder = 'asc',
) => {
  return queryOptions<BloodProductResponse>({
    queryKey: ['inventory', page, sort_by, sort_order],
    queryFn: () => fetchProducts({ page, sort_by, sort_order }),
    staleTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
  })
}
