import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import type {
  BloodProductResponse,
  ProductSortBy,
  ProductSortOrder,
} from '@/lib/types/product.types'
import productsService from '@/lib/services/products.service'

const { fetchProducts } = productsService

export const fetchProductsQuery = (
  page: number = 1,
  sort_by: ProductSortBy = 'created_at',
  sort_order: ProductSortOrder = 'asc',
) => {
  return queryOptions<BloodProductResponse>({
    queryKey: ['inventory', page, sort_by, sort_order],
    queryFn: () => fetchProducts({ page, sort_by, sort_order }),
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
  })
}
