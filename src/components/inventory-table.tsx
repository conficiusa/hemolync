import { memo } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { InventoryTableError } from './inventory-table-error'
import { Checkbox } from '@/components/ui/checkbox'
import { getStatusBadgeClass } from '@/lib/utils'
import { fetchProductsQuery } from '@/lib/data/queries/inventory/fetch-products'

interface BloodProduct {
  id: string
  blood_product: string
  blood_type: string
  quantity: number
  expiry_date: string
  blood_bank_name: string
  added_by_name: string
  created_at: string
  updated_at: string
}

const InventoryTable = memo(() => {
  const { data, error } = useSuspenseQuery(fetchProductsQuery)

  if (error) {
    return <InventoryTableError />
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="py-3 px-4 text-left">
            <Checkbox
              className="data-[state=checked]:bg-transparent"
              checkStyle="text-primary"
            />
          </th>
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
            Blood Type
          </th>
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
            Blood Product
          </th>
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
            Quantity
          </th>
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
            Expiry Date
          </th>
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
            Blood Bank
          </th>
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((product: BloodProduct) => (
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
              {new Date(product.expiry_date).toLocaleDateString()}
            </td>
            <td className="py-4 px-4 text-sm text-gray-500">
              {product.blood_bank_name}
            </td>
            <td className="py-4 px-4">
              <div className="flex items-center gap-2">
                <button className="p-1 text-muted-foreground/70 hover:text-muted-foreground">
                  <Trash2 size={14} />
                </button>
                <button className="p-1 text-muted-foreground/70 hover:text-muted-foreground">
                  <Pencil size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
})

InventoryTable.displayName = 'InventoryTable'
export default InventoryTable
