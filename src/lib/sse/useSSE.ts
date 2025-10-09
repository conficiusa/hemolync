/**
 * React Hook for Server-Sent Events
 * Provides type-safe SSE functionality with React state management
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  SSEConnectionInfo,
  SSEConnectionState,
  SSEEvent,
  UseSSEOptions,
  UseSSEReturn,
} from '@/lib/sse/types'
import { SSEClient } from '@/lib/sse/client'
import { debug } from '@/lib/sse/debug'

/**
 * Custom hook for Server-Sent Events with full type safety
 * @param url - The SSE endpoint URL
 * @param options - Configuration and event handlers
 * @returns SSE client state and control functions
 */
export function useSSE<T = unknown>(
  url: string,
  options: UseSSEOptions<T> = {},
): UseSSEReturn<T> {
  const {
    autoConnect = true,
    dependencies = [],
    handlers = {},
    ...clientOptions
  } = options

  // State management
  const [connectionState, setConnectionState] =
    useState<SSEConnectionState>('disconnected')
  const [connectionInfo, setConnectionInfo] = useState<SSEConnectionInfo>({
    state: 'disconnected',
    reconnectAttempts: 0,
    messageCount: 0,
  })
  const [lastMessage, setLastMessage] = useState<SSEEvent<T> | null>(null)
  const [messages, setMessages] = useState<Array<SSEEvent<T>>>([])

  // Client reference
  const clientRef = useRef<SSEClient<T> | null>(null)

  // Memoize the handlers object to prevent recreation
  const memoizedHandlers = useMemo(
    () => handlers,
    [
      handlers.onMessage,
      handlers.onConnect,
      handlers.onDisconnect,
      handlers.onError,
      handlers.onReconnect,
      handlers.onStateChange,
    ],
  )

  // Memoized event handlers
  const eventHandlers = useMemo(
    () => ({
      onMessage: (event: SSEEvent<T>) => {
        setLastMessage(event)
        setMessages((prev) => [...prev, event])
        memoizedHandlers.onMessage?.(event)
      },
      onConnect: (info: SSEConnectionInfo) => {
        setConnectionInfo(info)
        setConnectionState(info.state)
        memoizedHandlers.onConnect?.(info)
      },
      onDisconnect: (info: SSEConnectionInfo) => {
        setConnectionInfo(info)
        setConnectionState(info.state)
        memoizedHandlers.onDisconnect?.(info)
      },
      onError: (error: Error, info: SSEConnectionInfo) => {
        setConnectionInfo(info)
        setConnectionState(info.state)
        memoizedHandlers.onError?.(error, info)
      },
      onReconnect: (attempt: number, info: SSEConnectionInfo) => {
        setConnectionInfo(info)
        setConnectionState(info.state)
        memoizedHandlers.onReconnect?.(attempt, info)
      },
      onStateChange: (state: SSEConnectionState, info: SSEConnectionInfo) => {
        setConnectionInfo(info)
        setConnectionState(state)
        memoizedHandlers.onStateChange?.(state, info)
      },
    }),
    [memoizedHandlers],
  )

  // Memoize client options to prevent unnecessary updates
  const memoizedClientOptions = useMemo(
    () => clientOptions,
    [
      clientOptions.baseUrl,
      clientOptions.maxReconnectAttempts,
      clientOptions.reconnectDelay,
      clientOptions.maxReconnectDelay,
      clientOptions.reconnectStrategy,
      JSON.stringify(clientOptions.headers),
      JSON.stringify(clientOptions.queryParams),
      clientOptions.eventType,
    ],
  )

  // Initialize client - only recreate when URL changes
  useEffect(() => {
    debug.info('HOOK', `useSSE effect: Initialize client for ${url}`, {
      hasClient: !!clientRef.current,
      dependencies: [url],
    })

    if (!clientRef.current) {
      debug.info('HOOK', `Creating new SSEClient for ${url}`)
      clientRef.current = new SSEClient(url, {
        config: {
          ...clientOptions,
          autoConnect: false, // We'll handle connection manually
        },
        handlers: eventHandlers,
      })
    }

    return () => {
      debug.info('HOOK', `Cleaning up SSEClient for ${url}`)
      if (clientRef.current) {
        clientRef.current.destroy()
        clientRef.current = null
      }
    }
  }, [url]) // Only depend on URL - client will be updated via separate effects

  // Update client configuration when options change
  useEffect(() => {
    debug.debug('HOOK', `useSSE effect: Update config for ${url}`, {
      hasClient: !!clientRef.current,
      dependencies: Object.keys(memoizedClientOptions),
    })
    if (clientRef.current) {
      clientRef.current.updateConfig(memoizedClientOptions)
    }
  }, [memoizedClientOptions, url])

  // Update handlers when they change
  useEffect(() => {
    debug.debug('HOOK', `useSSE effect: Update handlers for ${url}`, {
      hasClient: !!clientRef.current,
      handlerKeys: Object.keys(eventHandlers),
    })
    if (clientRef.current) {
      clientRef.current.updateHandlers(eventHandlers)
    }
  }, [eventHandlers, url])

  // Auto-connect effect - only depend on autoConnect and url
  useEffect(() => {
    debug.info('HOOK', `useSSE effect: Auto-connect for ${url}`, {
      autoConnect,
      hasClient: !!clientRef.current,
      dependencies: [autoConnect, url],
    })

    if (autoConnect && clientRef.current) {
      clientRef.current.connect()
    }

    return () => {
      debug.info('HOOK', `useSSE effect: Disconnect cleanup for ${url}`)
      if (clientRef.current) {
        clientRef.current.disconnect()
      }
    }
  }, [autoConnect, url]) // Only depend on autoConnect and url

  // Control functions
  const connect = useCallback(() => {
    clientRef.current?.connect()
  }, [])

  const disconnect = useCallback(() => {
    clientRef.current?.disconnect()
  }, [])

  const reconnect = useCallback(() => {
    clientRef.current?.reconnect()
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setLastMessage(null)
  }, [])

  // Computed properties
  const isConnected = useMemo(
    () => connectionState === 'connected',
    [connectionState],
  )
  const isConnecting = useMemo(
    () =>
      connectionState === 'connecting' || connectionState === 'reconnecting',
    [connectionState],
  )
  const hasError = useMemo(() => connectionState === 'error', [connectionState])

  return {
    connectionState,
    connectionInfo,
    lastMessage,
    messages,
    connect,
    disconnect,
    reconnect,
    clearMessages,
    isConnected,
    isConnecting,
    hasError,
  }
}

/**
 * Simplified hook for basic SSE usage
 * @param url - The SSE endpoint URL
 * @param onMessage - Message handler function
 * @param options - Additional configuration
 */
export function useSimpleSSE<T = unknown>(
  url: string,
  onMessage: (data: T) => void,
  options: Omit<UseSSEOptions<T>, 'handlers'> = {},
): {
  connectionState: SSEConnectionState
  isConnected: boolean
  isConnecting: boolean
  hasError: boolean
  connect: () => void
  disconnect: () => void
  reconnect: () => void
} {
  const {
    connectionState,
    isConnected,
    isConnecting,
    hasError,
    connect,
    disconnect,
    reconnect,
  } = useSSE<T>(url, {
    ...options,
    handlers: {
      onMessage: (event) => onMessage(event.data),
    },
  })

  return {
    connectionState,
    isConnected,
    isConnecting,
    hasError,
    connect,
    disconnect,
    reconnect,
  }
}

/**
 * Hook for SSE with message filtering
 * @param url - The SSE endpoint URL
 * @param filter - Function to filter messages
 * @param options - Configuration options
 */
export function useFilteredSSE<T = unknown>(
  url: string,
  filter: (message: SSEEvent<T>) => boolean,
  options: UseSSEOptions<T> = {},
): UseSSEReturn<T> {
  const [filteredMessages, setFilteredMessages] = useState<Array<SSEEvent<T>>>(
    [],
  )

  const { messages, ...rest } = useSSE<T>(url, {
    ...options,
    handlers: {
      ...options.handlers,
      onMessage: (event) => {
        if (filter(event)) {
          setFilteredMessages((prev) => [...prev, event])
        }
        options.handlers?.onMessage?.(event)
      },
    },
  })

  return {
    ...rest,
    messages: filteredMessages,
  }
}
