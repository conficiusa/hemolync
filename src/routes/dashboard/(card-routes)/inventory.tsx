import { createFileRoute } from '@tanstack/react-router'
import Inventory from '@/components/inventory'
import { fetchProductsQuery } from '@/lib/data/queries/inventory/fetch-products'

export const Route = createFileRoute('/dashboard/(card-routes)/inventory')({
  component: InventoryPage,
  loader: ({ context }) => {
    const { queryClient } = context
    queryClient.prefetchQuery(fetchProductsQuery)
  },
})

function InventoryPage() {
  return <Inventory />
}
