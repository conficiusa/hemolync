import { memo } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { getStatusBadgeClass } from '@/lib/utils'

interface BloodProduct {
  id: number
  batchNumber: string
  productName: string
  dateAdded: string
  expirationDate: string
  status: 'In Stock' | 'Limited' | 'Out of Stock' | 'Expired'
}

const bloodProducts: Array<BloodProduct> = [
  {
    id: 1,
    batchNumber: '14637',
    productName: 'Whole Blood',
    dateAdded: '12/04/2024',
    expirationDate: '12/04/2024',
    status: 'Expired',
  },
  {
    id: 2,
    batchNumber: '14637',
    productName: 'Concentrated Red Cells (CRC)',
    dateAdded: '12/04/2024',
    expirationDate: '12/04/2024',
    status: 'Expired',
  },
  {
    id: 3,
    batchNumber: '14637',
    productName: 'Fresh frozen plasma (FFP)',
    dateAdded: '12/04/2024',
    expirationDate: '12/04/2024',
    status: 'In Stock',
  },
  {
    id: 4,
    batchNumber: '14637',
    productName: 'Platelets',
    dateAdded: '12/04/2024',
    expirationDate: '12/04/2024',
    status: 'Out of Stock',
  },
  {
    id: 5,
    batchNumber: '14637',
    productName: 'Cryoprecipitate',
    dateAdded: '12/04/2024',
    expirationDate: '12/04/2024',
    status: 'Out of Stock',
  },
  {
    id: 6,
    batchNumber: '14637',
    productName: 'Platelets',
    dateAdded: '12/04/2024',
    expirationDate: '12/04/2024',
    status: 'Limited',
  },
  {
    id: 7,
    batchNumber: '14637',
    productName: 'Fresh frozen plasma (FFP)',
    dateAdded: '12/04/2024',
    expirationDate: '12/04/2024',
    status: 'Expired',
  },
  {
    id: 8,
    batchNumber: '14637',
    productName: 'Platelets',
    dateAdded: '12/04/2024',
    expirationDate: '12/04/2024',
    status: 'Out of Stock',
  },
  {
    id: 9,
    batchNumber: '14637',
    productName: 'Cryoprecipitate',
    dateAdded: '12/04/2024',
    expirationDate: '12/04/2024',
    status: 'In Stock',
  },
]
const InventoryTable = memo(() => {
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
            Batch Number
          </th>
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
            Blood Product
          </th>
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
            Date Added
          </th>
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
            Expiration Date
          </th>
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
            Status
          </th>
          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {bloodProducts.map((product) => (
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
              {product.batchNumber}
            </td>
            <td className="py-4 px-4 text-sm text-gray-900">
              {product.productName}
            </td>
            <td className="py-4 px-4 text-sm text-gray-500">
              {product.dateAdded}
            </td>
            <td className="py-4 px-4 text-sm text-gray-500">
              {product.expirationDate}
            </td>
            <td className="py-4 px-4">
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                  product.status,
                )}`}
              >
                {product.status}
              </span>
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
