import { useRouter } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export default function InventoryError({ error }: { error: any }) {
  const router = useRouter()
  const { reset } = useQueryErrorResetBoundary()

  // Reset react-query error boundary when this component first renders
  useEffect(() => {
    reset()
  }, [reset])

  return (
    <div className="flex flex-col gap-4 items-center justify-center py-12">
      <Alert variant="destructive">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Error loading inventory</AlertTitle>
        <AlertDescription>
          {error?.message ?? 'Something went wrong.'}
        </AlertDescription>
      </Alert>

      <Button
        onClick={() => {
          // Invalidate the inventory route to retrigger loader & queries
          router.invalidate()
        }}
      >
        Retry
      </Button>
    </div>
  )
}
