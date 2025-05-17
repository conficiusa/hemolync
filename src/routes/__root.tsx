import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { QueryClient } from '@tanstack/react-query'
import type { AuthContextType } from '@/lib/types/system-types'
import TanstackQueryLayout from '@/lib/integrations/tanstack-query/layout'
import { Toaster } from '@/components/ui/sonner'

interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
      <TanstackQueryLayout />
      <Toaster richColors />
    </>
  )
}
