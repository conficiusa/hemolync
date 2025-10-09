/**
 * SSE (Server-Sent Events) Library
 * Comprehensive, type-safe SSE client for React applications
 */

// Core exports
export { SSEClient } from './client'
export { useSSE, useSimpleSSE, useFilteredSSE } from './useSSE'

// Manager and utilities
export {
  sseManager,
  createSingletonSSE,
  createSSE,
  closeAllSSEConnections,
  getActiveSSEConnections,
  getSSEStats,
  reconnectAllSSE,
  createSSEUrl,
  createAuthenticatedSSEConfig,
  createSSEConfigWithHeaders,
  createSSEConfigWithReconnection,
} from './manager'

// Types
export type {
  SSEConnectionState,
  SSEReconnectStrategy,
  SSEConfig,
  SSEEvent,
  SSEConnectionInfo,
  SSEEventHandlers,
  SSEClientOptions,
  UseSSEOptions,
  UseSSEReturn,
  SSEMessageParser,
  SSEClientManager,
} from './types'

// Value exports
export { SSEError } from './types'

// Debug utilities
export { debug, isSSEDebugEnabled } from './debug'
