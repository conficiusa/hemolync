import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import TanstackQueryLayout from '@/lib/integrations/tanstack-query/layout'

import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import type { AuthContextType } from '@/lib/types/system-types'

interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />

      <TanstackQueryLayout />
      <Toaster richColors />
    </>
  ),
})
