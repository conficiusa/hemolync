/**
 * SSE Authorization Interceptor
 * Handles automatic token refresh for SSE connections when authorization is lost
 */

import { debug } from './debug'
import type { SSEClient } from './client'
import type { SSEConfig, SSEEvent } from './types'
import { RefreshToken } from '@/lib/hooks/useRefreshToken'

/**
 * Check if an SSE event indicates an authorization error
 */
export function shouldHandleAuthError(event: SSEEvent): boolean {
  const data = event.data as any

  return (
    data?.type === 'connection_terminated' &&
    data?.reason === 'authorization_lost'
  )
}

/**
 * Handle SSE authorization error by refreshing token and reconnecting
 * @param client - The SSE client instance
 * @param url - The SSE endpoint URL
 * @param currentConfig - Current SSE configuration
 * @returns Promise<boolean> - true if refresh was successful, false if failed
 */
export async function handleSSEAuthError<T = unknown>(
  client: SSEClient<T>,
  url: string,
  currentConfig: SSEConfig,
): Promise<boolean> {
  debug.info('AUTH', 'Handling SSE authorization error', {
    url,
    currentState: client.getConnectionInfo().state,
  })

  try {
    // Attempt to refresh the token
    debug.info('AUTH', 'Attempting to refresh token')
    const newToken = await RefreshToken()

    if (!newToken) {
      debug.error('AUTH', 'Token refresh failed - no token returned')
      await redirectToLogin()
      return false
    }

    debug.info('AUTH', 'Token refresh successful, updating SSE connection', {
      url,
    })

    // Update the configuration with the new token
    const updatedConfig = {
      ...currentConfig,
      queryParams: {
        ...currentConfig.queryParams,
        access_token: newToken,
      },
    }

    // Update the client configuration
    client.updateConfig(updatedConfig)

    // Reconnect with the new token
    client.reconnect()

    debug.info('AUTH', 'SSE connection updated and reconnected', {
      url,
    })

    return true
  } catch (error) {
    debug.error('AUTH', 'Token refresh failed with error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      url,
    })

    await redirectToLogin()
    return false
  }
}

/**
 * Redirect to login page with current location as return URL
 */
async function redirectToLogin(): Promise<void> {
  try {
    debug.info('AUTH', 'Redirecting to login page')

    const { router } = await import('@/main')
    const { getContext } = await import(
      '@/lib/integrations/tanstack-query/root-provider'
    )

    // Clear all queries
    const queryClient = getContext().queryClient
    queryClient.removeQueries()

    // Get current location for redirect after login
    const location = router.parseLocation()
    const redirect = encodeURIComponent(location.href)

    // Navigate to login
    await router.navigate({
      to: '/auth/login',
      search: redirect ? { redirect } : undefined,
      state: location.state,
      replace: true,
    })
  } catch (error) {
    debug.error('AUTH', 'Failed to redirect to login', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })

    // Fallback: reload the page to trigger auth flow
    window.location.href = '/auth/login'
  }
}

/**
 * Check if the current SSE configuration has auto-refresh enabled
 */
export function isAutoRefreshEnabled(config: SSEConfig): boolean {
  return config.autoRefreshToken !== false // default to true
}
