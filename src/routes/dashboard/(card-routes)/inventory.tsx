import Inventory from '@/components/inventory'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/(card-routes)/inventory')({
  component: InventoryPage,
})

function InventoryPage() {
  return <Inventory />
}
