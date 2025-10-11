/**
 * Core SSE Client Implementation
 * Provides robust, type-safe Server-Sent Events functionality
 */

import type {
  SSEConfig,
  SSEConnectionInfo,
  SSEConnectionState,
  SSEEvent,
  SSEEventHandlers,
  SSEMessageParser,
} from '@/lib/sse/types'
import { debug } from '@/lib/sse/debug'
import {
  handleSSEAuthError,
  isAutoRefreshEnabled,
  shouldHandleAuthError,
} from '@/lib/sse/auth-interceptor'
import { SSEError } from '@/lib/sse/types'

export class SSEClient<T = unknown> {
  private eventSource: EventSource | null = null
  private connectionInfo: SSEConnectionInfo
  private config: Required<SSEConfig>
  private handlers: SSEEventHandlers<T>
  private reconnectTimeoutId: NodeJS.Timeout | null = null
  private messageParser: SSEMessageParser<T>
  private url: string

  constructor(
    url: string,
    options: {
      config?: SSEConfig
      handlers?: SSEEventHandlers<T>
      messageParser?: SSEMessageParser<T>
    } = {},
  ) {
    this.url = url
    this.handlers = options.handlers || {}
    this.messageParser = options.messageParser || this.defaultMessageParser

    this.config = {
      baseUrl: '',
      maxReconnectAttempts: 5,
      reconnectDelay: 1000,
      maxReconnectDelay: 30000,
      reconnectStrategy: 'exponential',
      headers: {},
      queryParams: {},
      autoConnect: true,
      eventType: 'message',
      autoRefreshToken: true, // default to true
      ...options.config,
    }

    this.connectionInfo = {
      state: 'disconnected',
      reconnectAttempts: 0,
      messageCount: 0,
    }

    if (this.config.autoConnect) {
      this.connect()
    }
  }

  /**
   * Default message parser that attempts to parse JSON
   */
  private defaultMessageParser: SSEMessageParser<T> = (data: string): T => {
    try {
      return JSON.parse(data) as T
    } catch {
      return data as T
    }
  }

  /**
   * Build the complete URL with query parameters
   */
  private buildUrl(): string {
    const baseUrl = this.config.baseUrl || ''
    const fullUrl = `${baseUrl}${this.url}`

    if (Object.keys(this.config.queryParams).length === 0) {
      return fullUrl
    }

    const urlObj = new URL(fullUrl)
    Object.entries(this.config.queryParams).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value)
    })

    return urlObj.toString()
  }

  /**
   * Calculate reconnection delay based on strategy
   */
  private calculateReconnectDelay(): number {
    const { reconnectAttempts } = this.connectionInfo
    const { reconnectDelay, maxReconnectDelay, reconnectStrategy } = this.config

    switch (reconnectStrategy) {
      case 'exponential':
        return Math.min(
          reconnectDelay * Math.pow(2, reconnectAttempts),
          maxReconnectDelay,
        )
      case 'linear':
        return Math.min(
          reconnectDelay * (reconnectAttempts + 1),
          maxReconnectDelay,
        )
      case 'fixed':
        return reconnectDelay
      case 'none':
        return 0
      default:
        return reconnectDelay
    }
  }

  /**
   * Update connection state and notify handlers
   */
  private updateState(newState: SSEConnectionState, error?: Error): void {
    const oldState = this.connectionInfo.state

    if (oldState !== newState) {
      debug.logConnectionState(this.url, oldState, newState, {
        error: error?.message,
      })
    }

    this.connectionInfo.state = newState

    if (error) {
      this.connectionInfo.lastError = error
    }

    if (newState === 'connected') {
      this.connectionInfo.connectedAt = new Date()
      this.connectionInfo.reconnectAttempts = 0
      this.connectionInfo.lastError = undefined
    }

    // Notify state change handler
    if (oldState !== newState) {
      this.handlers.onStateChange?.(newState, this.connectionInfo)
    }

    // Notify specific state handlers
    switch (newState) {
      case 'connected':
        this.handlers.onConnect?.(this.connectionInfo)
        break
      case 'disconnected':
        this.handlers.onDisconnect?.(this.connectionInfo)
        break
      case 'error':
        if (error) {
          this.handlers.onError?.(error, this.connectionInfo)
        }
        break
    }
  }

  /**
   * Handle incoming SSE messages
   */
  private handleMessage = async (event: MessageEvent): Promise<void> => {
    try {
      const parsedData = this.messageParser(event.data)
      const sseEvent: SSEEvent<T> = {
        type: event.type || this.config.eventType,
        data: parsedData,
        id: event.lastEventId || undefined,
        timestamp: Date.now(),
      }

      this.connectionInfo.messageCount++
      this.connectionInfo.lastMessageAt = new Date()

      const eventSourceId = (this.eventSource as any)?.__sseId
      debug.debug(
        'MESSAGE',
        `Received message ${this.connectionInfo.messageCount}`,
        {
          type: sseEvent.type,
          id: sseEvent.id,
          url: this.url,
          eventSourceId,
        },
      )

      // Check if this is a connection event that should be filtered
      const data = parsedData as any
      if (
        data?.type === 'connection_established' ||
        data?.type === 'connection_terminated'
      ) {
        debug.info('MESSAGE', 'Filtering out connection event', {
          type: data.type,
          reason: data.reason,
          url: this.url,
        })

        // Handle authorization_lost events if auto-refresh is enabled
        if (
          data?.type === 'connection_terminated' &&
          data?.reason === 'authorization_lost' &&
          isAutoRefreshEnabled(this.config)
        ) {
          debug.info('MESSAGE', 'Handling authorization_lost event')
          await handleSSEAuthError(this, this.url, this.config)
        }

        // Don't pass connection events to user handlers
        return
      }

      // Check for authorization errors in other message types
      if (
        shouldHandleAuthError(sseEvent) &&
        isAutoRefreshEnabled(this.config)
      ) {
        debug.info('MESSAGE', 'Handling authorization error in message')
        await handleSSEAuthError(this, this.url, this.config)
        return
      }

      // Pass non-connection events to user handlers
      this.handlers.onMessage?.(sseEvent)
    } catch (error) {
      debug.error('MESSAGE', 'Failed to parse message', {
        error: error instanceof Error ? error.message : 'Unknown error',
        data: event.data,
        url: this.url,
      })
      const sseError = new SSEError(
        `Failed to parse message: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'PARSE_ERROR',
        this.connectionInfo,
      )
      this.updateState('error', sseError)
    }
  }

  /**
   * Handle connection errors
   */
  private handleError = async (event: Event): Promise<void> => {
    const readyState = this.eventSource?.readyState
    const eventSourceId = (this.eventSource as any)?.__sseId

    debug.error('ERROR', 'SSE error event fired', {
      readyState,
      currentState: this.connectionInfo.state,
      url: this.url,
      eventType: event.type,
      eventSourceId,
    })

    // Only treat as error if connection was open or closed
    // EventSource fires error events during CONNECTING state (readyState 0) which is normal
    if (readyState === EventSource.OPEN || readyState === EventSource.CLOSED) {
      debug.error(
        'ERROR',
        'Treating as actual error - connection was open/closed',
        { readyState },
      )

      // Check if this might be a 401 authorization error
      // Note: EventSource doesn't provide HTTP status codes, but we can try to handle
      // authorization errors if auto-refresh is enabled
      if (isAutoRefreshEnabled(this.config)) {
        debug.info(
          'ERROR',
          'Attempting to handle potential authorization error',
        )
        const refreshSuccess = await handleSSEAuthError(
          this,
          this.url,
          this.config,
        )

        if (refreshSuccess) {
          debug.info(
            'ERROR',
            'Token refresh successful, connection should be restored',
          )
          return
        }
      }

      const error = new SSEError(
        'SSE connection error',
        'CONNECTION_ERROR',
        this.connectionInfo,
      )
      this.updateState('error', error)
      this.scheduleReconnect()
    } else {
      debug.info(
        'ERROR',
        'Ignoring error event during CONNECTING state (normal behavior)',
        { readyState },
      )
    }
  }

  /**
   * Handle connection open
   */
  private handleOpen = (): void => {
    const eventSourceId = (this.eventSource as any)?.__sseId
    debug.info('OPEN', 'SSE connection opened successfully', {
      url: this.url,
      readyState: this.eventSource?.readyState,
      eventSourceId,
    })
    this.updateState('connected')
  }

  /**
   * Handle connection close
   */
  private handleClose = (): void => {
    const eventSourceId = (this.eventSource as any)?.__sseId
    debug.info('CLOSE', 'SSE connection closed by server', {
      url: this.url,
      readyState: this.eventSource?.readyState,
      eventSourceId,
    })
    this.updateState('disconnected')
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (
      this.connectionInfo.reconnectAttempts >= this.config.maxReconnectAttempts
    ) {
      debug.warn('RECONNECT', 'Max reconnection attempts reached, giving up', {
        attempts: this.connectionInfo.reconnectAttempts,
        maxAttempts: this.config.maxReconnectAttempts,
      })
      this.updateState('disconnected')
      return
    }

    if (this.config.reconnectStrategy === 'none') {
      debug.info('RECONNECT', 'Reconnection disabled, staying disconnected')
      this.updateState('disconnected')
      return
    }

    this.connectionInfo.reconnectAttempts++
    this.updateState('reconnecting')

    const delay = this.calculateReconnectDelay()

    debug.info(
      'RECONNECT',
      `Scheduling reconnection attempt ${this.connectionInfo.reconnectAttempts}`,
      {
        delay,
        strategy: this.config.reconnectStrategy,
        url: this.url,
      },
    )

    this.handlers.onReconnect?.(
      this.connectionInfo.reconnectAttempts,
      this.connectionInfo,
    )

    this.reconnectTimeoutId = setTimeout(() => {
      this.connect()
    }, delay)
  }

  /**
   * Connect to the SSE stream
   */
  public connect(): void {
    if (
      this.connectionInfo.state === 'connecting' ||
      this.connectionInfo.state === 'connected'
    ) {
      debug.debug('CONNECT', `Already ${this.connectionInfo.state}, skipping`, {
        url: this.url,
      })
      return
    }

    try {
      debug.info('CONNECT', `Starting connection to ${this.url}`, {
        currentState: this.connectionInfo.state,
        hasEventSource: !!this.eventSource,
        reconnectAttempts: this.connectionInfo.reconnectAttempts,
      })
      this.updateState('connecting')

      // Clean up existing connection without triggering state change
      if (this.reconnectTimeoutId) {
        debug.debug('CONNECT', 'Clearing existing reconnect timeout')
        clearTimeout(this.reconnectTimeoutId)
        this.reconnectTimeoutId = null
      }

      if (this.eventSource) {
        debug.debug('CONNECT', 'Cleaning up existing EventSource', {
          readyState: this.eventSource.readyState,
        })
        this.eventSource.removeEventListener(
          this.config.eventType,
          this.handleMessage,
        )
        this.eventSource.removeEventListener('open', this.handleOpen)
        this.eventSource.removeEventListener('close', this.handleClose)
        this.eventSource.onerror = null
        this.eventSource.close()
        this.eventSource = null
      }

      const url = this.buildUrl()
      debug.info('CONNECT', `Creating EventSource for ${url}`, {
        timestamp: Date.now(),
        reconnectAttempts: this.connectionInfo.reconnectAttempts,
      })
      this.eventSource = new EventSource(url)

      // Add a unique identifier to track this EventSource instance
      const eventSourceId = Math.random().toString(36).substr(2, 9)
      ;(this.eventSource as any).__sseId = eventSourceId
      debug.info('CONNECT', `EventSource created with ID: ${eventSourceId}`)

      // Set up event listeners
      this.eventSource.addEventListener(
        this.config.eventType,
        this.handleMessage,
      )
      this.eventSource.addEventListener('open', this.handleOpen)
      this.eventSource.addEventListener('close', this.handleClose)

      // Use onerror instead of addEventListener to avoid duplicate handlers
      this.eventSource.onerror = this.handleError

      debug.info('CONNECT', 'EventSource created and listeners attached', {
        eventType: this.config.eventType,
        readyState: this.eventSource.readyState,
      })
    } catch (error) {
      const sseError = new SSEError(
        `Failed to create SSE connection: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CONNECTION_FAILED',
        this.connectionInfo,
      )
      this.updateState('error', sseError)
    }
  }

  /**
   * Disconnect from the SSE stream
   */
  public disconnect(): void {
    debug.info('DISCONNECT', `Disconnecting SSE client for ${this.url}`, {
      currentState: this.connectionInfo.state,
      hasEventSource: !!this.eventSource,
    })

    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId)
      this.reconnectTimeoutId = null
    }

    if (this.eventSource) {
      this.eventSource.removeEventListener(
        this.config.eventType,
        this.handleMessage,
      )
      this.eventSource.removeEventListener('open', this.handleOpen)
      this.eventSource.removeEventListener('close', this.handleClose)
      this.eventSource.onerror = null
      this.eventSource.close()
      this.eventSource = null
    }

    this.updateState('disconnected')
  }

  /**
   * Reconnect to the SSE stream
   */
  public reconnect(): void {
    debug.info('RECONNECT', `Manual reconnect requested for ${this.url}`, {
      currentState: this.connectionInfo.state,
      reconnectAttempts: this.connectionInfo.reconnectAttempts,
    })
    this.connectionInfo.reconnectAttempts = 0
    this.connect()
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<SSEConfig>): void {
    debug.debug('CONFIG', `Updating config for ${this.url}`, {
      newConfigKeys: Object.keys(newConfig),
      currentState: this.connectionInfo.state,
    })
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Update event handlers
   */
  public updateHandlers(newHandlers: Partial<SSEEventHandlers<T>>): void {
    debug.debug('HANDLERS', `Updating handlers for ${this.url}`, {
      newHandlerKeys: Object.keys(newHandlers),
      currentState: this.connectionInfo.state,
    })
    this.handlers = { ...this.handlers, ...newHandlers }
  }

  /**
   * Get current connection information
   */
  public getConnectionInfo(): SSEConnectionInfo {
    return { ...this.connectionInfo }
  }

  /**
   * Check if client is connected
   */
  public isConnected(): boolean {
    return this.connectionInfo.state === 'connected'
  }

  /**
   * Check if client is connecting
   */
  public isConnecting(): boolean {
    return (
      this.connectionInfo.state === 'connecting' ||
      this.connectionInfo.state === 'reconnecting'
    )
  }

  /**
   * Check if client has an error
   */
  public hasError(): boolean {
    return this.connectionInfo.state === 'error'
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    debug.info('DESTROY', `Destroying SSE client for ${this.url}`, {
      currentState: this.connectionInfo.state,
      hasEventSource: !!this.eventSource,
    })
    this.disconnect()
    this.handlers = {}
  }
}
