import { memo, useMemo, useState, useTransition } from 'react'
import { ChevronsUpDown, Pencil, Trash2 } from 'lucide-react'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { InventoryTableEmpty } from './inventory-table-empty'
import type { BloodProduct } from '@/lib/types/product.types'
import type {
  ProductSortBy,
  ProductSortOrder,
} from '@/lib/data/queries/inventory/fetch-products'
import { fetchProductsQuery } from '@/lib/data/queries/inventory/fetch-products'
import { Checkbox } from '@/components/ui/checkbox'
import { EditProductDialog } from '@/components/edit-product-dialog'
import { DeleteProductDialog } from '@/components/delete-product-dialog'
import TablePagination from '@/components/table-pagination'
import { cn } from '@/lib/utils'

const tableHeaders = [
  {
    label: 'Blood Type',
    key: 'blood_type',
    sortable: true,
  },
  {
    label: 'Blood Product',
    key: 'blood_product',
    sortable: true,
  },
  {
    label: 'Quantity',
    key: 'quantity',
    sortable: true,
  },
  {
    label: 'Expiry Date',
    key: 'expiry_date',
    sortable: true,
  },
  {
    label: 'Blood Bank',
    key: 'blood_bank_name',
  },
]
const InventoryTable = memo(() => {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<ProductSortBy>('created_at')
  const [sortOrder, setSortOrder] = useState<ProductSortOrder>('asc')
  const [, startTransition] = useTransition()
  const { data,isFetching } = useSuspenseQuery(fetchProductsQuery(page, sortBy, sortOrder))
  const queryClient = useQueryClient()

  const pagination =() => {
    const { items, ...rest } = data
    return rest
  }

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      setPage(newPage)
    })
  }

  const handleSortChange = (
    newSortBy: ProductSortBy,
    newSortOrder: ProductSortOrder,
  ) => {
    startTransition(() => {
      if (newSortBy === sortBy) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        setSortBy(newSortBy)
        setSortOrder(newSortOrder)
      }
    })
  }
  const onDelete = () => {
    if (data.items.length === 1 && !pagination().has_next && page > 1) {
      startTransition(() => {
        handlePageChange(page - 1)
      })
      return
    }
    queryClient.invalidateQueries({ queryKey: ['inventory'] })
  }

  if (!data.items.length && !isFetching) {
    return <InventoryTableEmpty />
  }
  return (
    <>
      <table className="text-sm w-full whitespace-nowrap">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 px-4 text-left">
              <Checkbox
                className="data-[state=checked]:bg-transparent"
                checkStyle="text-primary"
              />
            </th>
            {tableHeaders.map((header) => (
              <th
                key={header.key}
                className="py-3 px-4 text-left text-sm font-medium text-gray-500 cursor-default"
                onClick={() =>
                  handleSortChange(header.key as ProductSortBy, sortOrder)
                }
              >
                <span className="inline-flex items-center gap-1">
                  {header.label}
                  {header.sortable && (
                    <ChevronsUpDown
                      size={14}
                      className={cn(
                        sortBy === header.key && 'font-bold text-black',
                      )}
                    />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.items.map((product: BloodProduct) => (
            <tr
              key={product.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-4 px-4">
                <Checkbox
                  className="data-[state=checked]:bg-transparent"
                  checkStyle="text-primary"
                />
              </td>
              <td className="py-4 px-4 text-sm text-gray-900">
                {product.blood_type}
              </td>
              <td className="py-4 px-4 text-sm text-gray-900">
                {product.blood_product}
              </td>
              <td className="py-4 px-4 text-sm text-gray-900">
                {product.quantity}
              </td>
              <td className="py-4 px-4 text-sm text-gray-500">
                {format(product.expiry_date, 'MMM dd, yyyy')}
              </td>
              <td className="py-4 px-4 text-sm text-gray-500">
                {product.blood_bank_name}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <DeleteProductDialog product={product} onDeleted={onDelete}>
                    <button className="p-1 text-muted-foreground/70 hover:text-muted-foreground">
                      <Trash2 size={14} />
                    </button>
                  </DeleteProductDialog>
                  <EditProductDialog product={product}>
                    <button className="p-1 text-muted-foreground/70 hover:text-muted-foreground">
                      <Pencil size={14} />
                    </button>
                  </EditProductDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination {...pagination()} onPageChange={handlePageChange} />
    </>
  )
})

InventoryTable.displayName = 'InventoryTable'
export default InventoryTable
