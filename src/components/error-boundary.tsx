import { useRouter } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'

export default function ErrorBoundary({ error }: { error: any }) {
  const router = useRouter()
  const { reset } = useQueryErrorResetBoundary()

  // Reset react-query error boundary when this component first renders
  useEffect(() => {
    reset()
  }, [reset])

  return (
    <div className="flex bg-background my-5 rounded-lg shadow-sm flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="flex items-center justify-center rounded-full bg-muted p-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">
          Error loading data
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {error?.data?.detail ?? 'Something went wrong.'}
        </p>
      </div>
      <Button
        className="w-[250px]"
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
