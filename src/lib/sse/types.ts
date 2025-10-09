/**
 * SSE (Server-Sent Events) Client Types
 * Provides comprehensive type safety for SSE connections
 */

// Forward declaration for SSEClient class
declare class SSEClient<T = unknown> {
  constructor(url: string, options?: any)
}

export type SSEConnectionState =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'reconnecting'

export type SSEReconnectStrategy = 'exponential' | 'linear' | 'fixed' | 'none'

export interface SSEConfig {
  /** Base URL for the SSE endpoint */
  baseUrl?: string
  /** Maximum number of reconnection attempts */
  maxReconnectAttempts?: number
  /** Base delay between reconnection attempts (ms) */
  reconnectDelay?: number
  /** Maximum delay between reconnection attempts (ms) */
  maxReconnectDelay?: number
  /** Reconnection strategy */
  reconnectStrategy?: SSEReconnectStrategy
  /** Custom headers to include in the request */
  headers?: Record<string, string>
  /** Query parameters to include in the URL */
  queryParams?: Record<string, string>
  /** Whether to automatically connect on initialization */
  autoConnect?: boolean
  /** Custom event type to listen for (default: 'message') */
  eventType?: string
}

export interface SSEEvent<T = unknown> {
  /** Event type */
  type: string
  /** Event data */
  data: T
  /** Event ID for tracking */
  id?: string
  /** Retry interval in milliseconds */
  retry?: number
  /** Timestamp when event was received */
  timestamp: number
}

export interface SSEConnectionInfo {
  /** Current connection state */
  state: SSEConnectionState
  /** Number of reconnection attempts made */
  reconnectAttempts: number
  /** Last error that occurred */
  lastError?: Error
  /** Connection start time */
  connectedAt?: Date
  /** Last message received time */
  lastMessageAt?: Date
  /** Total messages received */
  messageCount: number
}

export interface SSEEventHandlers<T = unknown> {
  /** Called when a message is received */
  onMessage?: (event: SSEEvent<T>) => void
  /** Called when connection is established */
  onConnect?: (connectionInfo: SSEConnectionInfo) => void
  /** Called when connection is lost */
  onDisconnect?: (connectionInfo: SSEConnectionInfo) => void
  /** Called when an error occurs */
  onError?: (error: Error, connectionInfo: SSEConnectionInfo) => void
  /** Called when reconnection is attempted */
  onReconnect?: (attempt: number, connectionInfo: SSEConnectionInfo) => void
  /** Called when connection state changes */
  onStateChange?: (
    state: SSEConnectionState,
    connectionInfo: SSEConnectionInfo,
  ) => void
}

export interface SSEClientOptions<T = unknown> extends SSEConfig {
  /** Event handlers */
  handlers?: SSEEventHandlers<T>
}

export interface UseSSEOptions<T = unknown> extends SSEClientOptions<T> {
  /** Whether to automatically connect when the hook mounts */
  autoConnect?: boolean
  /** Dependencies that should trigger reconnection */
  dependencies?: Array<unknown>
}

export interface UseSSEReturn<T = unknown> {
  /** Current connection state */
  connectionState: SSEConnectionState
  /** Connection information */
  connectionInfo: SSEConnectionInfo
  /** Latest received message */
  lastMessage: SSEEvent<T> | null
  /** All received messages */
  messages: Array<SSEEvent<T>>
  /** Connect to the SSE stream */
  connect: () => void
  /** Disconnect from the SSE stream */
  disconnect: () => void
  /** Reconnect to the SSE stream */
  reconnect: () => void
  /** Clear all stored messages */
  clearMessages: () => void
  /** Whether the client is currently connected */
  isConnected: boolean
  /** Whether the client is currently connecting */
  isConnecting: boolean
  /** Whether the client has encountered an error */
  hasError: boolean
}

export class SSEError extends Error {
  constructor(
    message: string,
    public code: string,
    public connectionInfo?: SSEConnectionInfo,
  ) {
    super(message)
    this.name = 'SSEError'
  }
}

export type SSEMessageParser<T = unknown> = (data: string) => T

export interface SSEClientManager {
  /** Get or create a client for the given URL */
  getClient: <T = unknown>(
    url: string,
    options?: SSEClientOptions<T>,
  ) => SSEClient<T>
  /** Close all active connections */
  closeAll: () => void
  /** Get all active connections */
  getActiveConnections: () => Array<string>
}
