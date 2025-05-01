import { createFileRoute } from '@tanstack/react-router'
import Inventory from '@/components/inventory'

export const Route = createFileRoute('/dashboard/(card-routes)/inventory')({
  component: InventoryPage,
})

function InventoryPage() {
  return <Inventory />
}
