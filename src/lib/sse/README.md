# SSE (Server-Sent Events) Client

A comprehensive, type-safe Server-Sent Events client for React applications with advanced features like connection pooling, automatic reconnection, and full TypeScript support.

## Features

- 🔒 **Type Safety**: Full TypeScript support with generic types for message data
- 🔄 **Auto Reconnection**: Configurable reconnection strategies (exponential, linear, fixed, none)
- 🏊 **Connection Pooling**: Global connection manager for efficient resource usage
- ⚡ **React Integration**: Custom hooks for seamless React integration
- 🛡️ **Error Handling**: Comprehensive error handling and recovery
- 📊 **Connection Monitoring**: Real-time connection state and statistics
- 🎯 **Message Filtering**: Built-in message filtering capabilities
- 🔧 **Flexible Configuration**: Highly configurable for various use cases

## Quick Start

### Basic Usage

```tsx
import { useSSE } from '@/lib/sse'

interface Notification {
  id: string
  message: string
  timestamp: number
}

function NotificationsComponent({ accessToken }: { accessToken: string }) {
  const { messages, isConnected, hasError } = useSSE<Notification>(
    '/notifications/stream',
    {
      baseUrl: 'http://localhost:8000/api',
      queryParams: { access_token: accessToken },
      handlers: {
        onMessage: (event) => {
          console.log('New notification:', event.data)
        },
        onError: (error) => {
          console.error('Connection error:', error)
        },
      },
    },
  )

  return (
    <div>
      <div>
        Status: {isConnected ? 'Connected' : hasError ? 'Error' : 'Connecting'}
      </div>
      <div>Messages: {messages.length}</div>
    </div>
  )
}
```

### Simple Usage

For basic scenarios where you only need message handling:

```tsx
import { useSimpleSSE } from '@/lib/sse'

function SimpleComponent({ accessToken }: { accessToken: string }) {
  const { isConnected, connect, disconnect } = useSimpleSSE<string>(
    '/simple/stream',
    (message) => {
      console.log('Message:', message)
    },
    {
      baseUrl: 'http://localhost:8000/api',
      queryParams: { access_token: accessToken },
    },
  )

  return (
    <button onClick={isConnected ? disconnect : connect}>
      {isConnected ? 'Disconnect' : 'Connect'}
    </button>
  )
}
```

### Filtered Messages

For scenarios where you only want specific messages:

```tsx
import { useFilteredSSE } from '@/lib/sse'

interface SystemEvent {
  type: 'error' | 'warning' | 'info'
  message: string
}

function SystemEventsComponent({ accessToken }: { accessToken: string }) {
  const { messages } = useFilteredSSE<SystemEvent>(
    '/system/events',
    (event) => event.data.type === 'error', // Only show errors
    {
      baseUrl: 'http://localhost:8000/api',
      queryParams: { access_token: accessToken },
    },
  )

  return (
    <div>
      <h3>System Errors ({messages.length})</h3>
      {messages.map((event, index) => (
        <div key={index} className="text-red-500">
          {event.data.message}
        </div>
      ))}
    </div>
  )
}
```

## API Reference

### useSSE Hook

The main hook for SSE functionality with full type safety.

```tsx
function useSSE<T = unknown>(
  url: string,
  options?: UseSSEOptions<T>,
): UseSSEReturn<T>
```

#### Parameters

- `url`: The SSE endpoint URL
- `options`: Configuration options (see below)

#### Returns

- `connectionState`: Current connection state
- `connectionInfo`: Detailed connection information
- `lastMessage`: Latest received message
- `messages`: All received messages
- `connect()`: Connect to the SSE stream
- `disconnect()`: Disconnect from the SSE stream
- `reconnect()`: Reconnect to the SSE stream
- `clearMessages()`: Clear all stored messages
- `isConnected`: Whether currently connected
- `isConnecting`: Whether currently connecting
- `hasError`: Whether there's an error

### Configuration Options

```tsx
interface UseSSEOptions<T> {
  // Connection settings
  baseUrl?: string
  autoConnect?: boolean
  dependencies?: unknown[]

  // Reconnection settings
  maxReconnectAttempts?: number
  reconnectDelay?: number
  maxReconnectDelay?: number
  reconnectStrategy?: 'exponential' | 'linear' | 'fixed' | 'none'

  // Request settings
  headers?: Record<string, string>
  queryParams?: Record<string, string>
  eventType?: string

  // Event handlers
  handlers?: {
    onMessage?: (event: SSEEvent<T>) => void
    onConnect?: (info: SSEConnectionInfo) => void
    onDisconnect?: (info: SSEConnectionInfo) => void
    onError?: (error: Error, info: SSEConnectionInfo) => void
    onReconnect?: (attempt: number, info: SSEConnectionInfo) => void
    onStateChange?: (state: SSEConnectionState, info: SSEConnectionInfo) => void
  }
}
```

### Utility Functions

#### Authentication Helpers

```tsx
import { createAuthenticatedSSEConfig } from '@/lib/sse'

// Create config with authentication
const config = createAuthenticatedSSEConfig(accessToken, {
  user_id: '123',
  channel: 'notifications',
})
```

#### Connection Management

```tsx
import {
  closeAllSSEConnections,
  getActiveSSEConnections,
  getSSEStats,
} from '@/lib/sse'

// Close all connections
closeAllSSEConnections()

// Get active connections
const activeConnections = getActiveSSEConnections()

// Get connection statistics
const stats = getSSEStats()
```

## Advanced Usage

### Custom Message Parser

```tsx
const { messages } = useSSE<CustomData>('/custom/stream', {
  messageParser: (data: string) => {
    const parsed = JSON.parse(data)
    return {
      payload: parsed.content,
      metadata: {
        source: parsed.origin,
        version: parsed.v,
      },
    }
  },
})
```

### Connection Pooling

The SSE client automatically manages connections through a global manager. Multiple components using the same URL will share the same connection.

```tsx
// Both components will share the same connection
function Component1() {
  const { messages } = useSSE<Data>('/shared/stream', { baseUrl: API_URL })
  // ...
}

function Component2() {
  const { messages } = useSSE<Data>('/shared/stream', { baseUrl: API_URL })
  // ...
}
```

### Error Handling

```tsx
const { hasError, connectionInfo, reconnect } = useSSE<Data>('/stream', {
  handlers: {
    onError: (error, info) => {
      console.error('SSE Error:', error.message)
      console.log('Connection info:', info)

      // Custom error handling logic
      if (error.message.includes('authentication')) {
        // Handle auth errors
      }
    },
  },
})

// Manual reconnection
if (hasError) {
  return <button onClick={reconnect}>Reconnect</button>
}
```

## Migration from Old Client

If you're migrating from the old `useSseClient` hook:

### Before

```tsx
const { message } = useSseClient({
  url: '/notifications/sse/stream',
  access_token,
})
```

### After

```tsx
const { messages, isConnected } = useSSE<Notification>(
  '/notifications/sse/stream',
  {
    baseUrl: API_URL,
    ...createAuthenticatedSSEConfig(access_token),
    handlers: {
      onMessage: (event) => {
        // Handle new message
      },
    },
  },
)
```

## Best Practices

1. **Type Safety**: Always define interfaces for your message data
2. **Error Handling**: Implement proper error handling in your event handlers
3. **Connection Management**: Use the connection state to provide user feedback
4. **Resource Cleanup**: The hooks automatically clean up connections on unmount
5. **Reconnection**: Configure appropriate reconnection strategies for your use case
6. **Performance**: Use message filtering when you only need specific messages

## Troubleshooting

### Common Issues

1. **Connection not establishing**: Check your baseUrl and endpoint URL
2. **Authentication errors**: Verify your access token and query parameters
3. **Type errors**: Ensure your message interface matches the server response
4. **Memory leaks**: The client automatically cleans up, but ensure you're not storing references to old messages

### Debug Mode

Enable debug logging by setting up error handlers:

```tsx
const { connectionState, connectionInfo } = useSSE<Data>('/stream', {
  handlers: {
    onStateChange: (state, info) => {
      console.log('SSE State:', state, info)
    },
    onError: (error, info) => {
      console.error('SSE Error:', error, info)
    },
  },
})
```
