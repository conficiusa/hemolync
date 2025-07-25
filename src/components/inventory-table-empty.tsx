import { memo } from 'react'
import { DropletOff, Plus } from 'lucide-react'
import { AddBloodDialog } from '@/components/add-blood-products'

const InventoryTableEmpty = memo(() => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="flex items-center justify-center rounded-full bg-muted p-4">
        <DropletOff className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">
          No blood products available
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Your inventory is currently empty. Start tracking by adding your first
          blood product.
        </p>
      </div>
      <AddBloodDialog>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-sm text-sm font-medium">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </AddBloodDialog>
    </div>
  )
})

InventoryTableEmpty.displayName = 'InventoryTableEmpty'
export default InventoryTableEmpty
