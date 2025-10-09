/**
 * SSE Client Manager
 * Provides connection pooling and management utilities
 */

import { SSEClient } from './client'
import type {
  SSEClientManager,
  SSEClientOptions,
  SSEConnectionInfo,
} from './types'

/**
 * Global SSE Client Manager
 * Manages multiple SSE connections and provides pooling functionality
 */
class SSEManager implements SSEClientManager {
  private clients = new Map<string, SSEClient<unknown>>()
  private connectionPool = new Map<string, SSEConnectionInfo>()

  /**
   * Get or create a client for the given URL
   */
  getClient<T = unknown>(
    url: string,
    options?: SSEClientOptions<T>,
  ): SSEClient<T> {
    const clientKey = this.generateClientKey(
      url,
      options as SSEClientOptions<unknown>,
    )

    if (!this.clients.has(clientKey)) {
      const client = new SSEClient<T>(url, options)
      this.clients.set(clientKey, client as SSEClient<unknown>)

      // Track connection info
      this.connectionPool.set(clientKey, client.getConnectionInfo())

      // Update connection info periodically
      const updateInterval = setInterval(() => {
        if (this.clients.has(clientKey)) {
          this.connectionPool.set(clientKey, client.getConnectionInfo())
        } else {
          clearInterval(updateInterval)
        }
      }, 1000)
    }

    return this.clients.get(clientKey) as SSEClient<T>
  }

  /**
   * Close a specific client connection
   */
  closeClient(url: string, options?: SSEClientOptions): void {
    const clientKey = this.generateClientKey(
      url,
      options as SSEClientOptions<unknown>,
    )
    const client = this.clients.get(clientKey)

    if (client) {
      client.destroy()
      this.clients.delete(clientKey)
      this.connectionPool.delete(clientKey)
    }
  }

  /**
   * Close all active connections
   */
  closeAll(): void {
    this.clients.forEach((client) => client.destroy())
    this.clients.clear()
    this.connectionPool.clear()
  }

  /**
   * Get all active connection URLs
   */
  getActiveConnections(): Array<string> {
    return Array.from(this.clients.keys())
  }

  /**
   * Get connection info for all active connections
   */
  getAllConnectionInfo(): Record<string, SSEConnectionInfo> {
    const info: Record<string, SSEConnectionInfo> = {}
    this.connectionPool.forEach((connectionInfo, key) => {
      info[key] = connectionInfo
    })
    return info
  }

  /**
   * Get connection info for a specific client
   */
  getConnectionInfo(
    url: string,
    options?: SSEClientOptions,
  ): SSEConnectionInfo | null {
    const clientKey = this.generateClientKey(
      url,
      options as SSEClientOptions<unknown>,
    )
    return this.connectionPool.get(clientKey) || null
  }

  /**
   * Check if a client exists for the given URL
   */
  hasClient(url: string, options?: SSEClientOptions): boolean {
    const clientKey = this.generateClientKey(
      url,
      options as SSEClientOptions<unknown>,
    )
    return this.clients.has(clientKey)
  }

  /**
   * Reconnect all clients
   */
  reconnectAll(): void {
    this.clients.forEach((client) => client.reconnect())
  }

  /**
   * Generate a unique key for a client based on URL and options
   */
  private generateClientKey(
    url: string,
    options?: SSEClientOptions<unknown>,
  ): string {
    const optionsKey = options
      ? JSON.stringify({
          baseUrl: options.baseUrl,
          queryParams: options.queryParams,
          headers: options.headers,
        })
      : ''
    return `${url}::${optionsKey}`
  }

  /**
   * Get statistics about all connections
   */
  getStats(): {
    totalConnections: number
    connectedCount: number
    connectingCount: number
    errorCount: number
    totalMessages: number
  } {
    let connectedCount = 0
    let connectingCount = 0
    let errorCount = 0
    let totalMessages = 0

    this.connectionPool.forEach((info) => {
      switch (info.state) {
        case 'connected':
          connectedCount++
          break
        case 'connecting':
        case 'reconnecting':
          connectingCount++
          break
        case 'error':
          errorCount++
          break
      }
      totalMessages += info.messageCount
    })

    return {
      totalConnections: this.connectionPool.size,
      connectedCount,
      connectingCount,
      errorCount,
      totalMessages,
    }
  }
}

// Global manager instance
export const sseManager = new SSEManager()

/**
 * Utility functions for SSE management
 */

/**
 * Create a singleton SSE client
 * @param url - The SSE endpoint URL
 * @param options - Client options
 * @returns A singleton SSE client instance
 */
export function createSingletonSSE<T = unknown>(
  url: string,
  options?: SSEClientOptions<T>,
): SSEClient<T> {
  return sseManager.getClient<T>(url, options)
}

/**
 * Create a new SSE client (not singleton)
 * @param url - The SSE endpoint URL
 * @param options - Client options
 * @returns A new SSE client instance
 */
export function createSSE<T = unknown>(
  url: string,
  options?: SSEClientOptions<T>,
): SSEClient<T> {
  return new SSEClient<T>(url, options)
}

/**
 * Close all SSE connections
 */
export function closeAllSSEConnections(): void {
  sseManager.closeAll()
}

/**
 * Get all active SSE connections
 */
export function getActiveSSEConnections(): Array<string> {
  return sseManager.getActiveConnections()
}

/**
 * Get SSE connection statistics
 */
export function getSSEStats() {
  return sseManager.getStats()
}

/**
 * Reconnect all SSE connections
 */
export function reconnectAllSSE(): void {
  sseManager.reconnectAll()
}

/**
 * Utility to create SSE URL with authentication
 * @param baseUrl - Base URL for the API
 * @param endpoint - SSE endpoint path
 * @param accessToken - Authentication token
 * @param additionalParams - Additional query parameters
 * @returns Complete SSE URL with authentication
 */
export function createSSEUrl(
  baseUrl: string,
  endpoint: string,
  accessToken: string,
  additionalParams: Record<string, string> = {},
): string {
  const url = new URL(endpoint, baseUrl)
  url.searchParams.set('access_token', accessToken)

  Object.entries(additionalParams).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  return url.toString()
}

/**
 * Utility to create SSE configuration for authenticated endpoints
 * @param accessToken - Authentication token
 * @param additionalParams - Additional query parameters
 * @returns SSE configuration object
 */
export function createAuthenticatedSSEConfig(
  accessToken: string,
  additionalParams: Record<string, string> = {},
) {
  return {
    queryParams: {
      access_token: accessToken,
      ...additionalParams,
    },
  }
}

/**
 * Utility to create SSE configuration with custom headers
 * @param headers - Custom headers
 * @returns SSE configuration object
 */
export function createSSEConfigWithHeaders(headers: Record<string, string>) {
  return {
    headers,
  }
}

/**
 * Utility to create SSE configuration with reconnection strategy
 * @param strategy - Reconnection strategy
 * @param maxAttempts - Maximum reconnection attempts
 * @param baseDelay - Base delay between attempts
 * @returns SSE configuration object
 */
export function createSSEConfigWithReconnection(
  strategy: 'exponential' | 'linear' | 'fixed' | 'none' = 'exponential',
  maxAttempts: number = 5,
  baseDelay: number = 1000,
) {
  return {
    reconnectStrategy: strategy,
    maxReconnectAttempts: maxAttempts,
    reconnectDelay: baseDelay,
  }
}
