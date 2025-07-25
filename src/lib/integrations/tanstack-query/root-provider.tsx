import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RequestDraftProvider } from '@/lib/contexts/request.context'

const queryClient = new QueryClient()

export function getContext() {
  return {
    queryClient,
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <RequestDraftProvider>{children}</RequestDraftProvider>
    </QueryClientProvider>
  )
}
