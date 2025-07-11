import { createFileRoute } from '@tanstack/react-router'
import Inventory from '@/components/inventory'
import { fetchProductsQuery } from '@/lib/data/queries/inventory/fetch-products'
import Loader from '@/components/loader'
import ErrorBoundary from '@/components/error-boundary'

export const Route = createFileRoute('/dashboard/(card-routes)/inventory')({
  component: InventoryPage,
  pendingComponent: () => {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  },
  loader: ({ context }) => {
    const { queryClient } = context
    queryClient.prefetchQuery(fetchProductsQuery())
  },
  errorComponent: ErrorBoundary,
})

function InventoryPage() {
  return <Inventory />
}
