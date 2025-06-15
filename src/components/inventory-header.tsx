import { useSuspenseQuery } from '@tanstack/react-query'
import { Download, Plus } from 'lucide-react'
import { AddBloodDialog } from '@/components/add-blood-products'
import { fetchProductsQuery } from '@/lib/data/queries/inventory/fetch-products'
import { Button } from '@/components/ui/button'

const InventoryHeader = () => {
  const { data, error } = useSuspenseQuery(fetchProductsQuery)

  if (error) return null
  if (!data.length) return null

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="md:text-xl text-lg font-bold">Blood Products</h2>
      </div>
      <div className="flex items-center gap-3">
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search Product"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-sm w-[200px] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div> */}
        <AddBloodDialog>
          <button className="bg-primary text-white px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </AddBloodDialog>
        <Button
          size={'icon'}
          variant={'outline'}
          className="border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default InventoryHeader
