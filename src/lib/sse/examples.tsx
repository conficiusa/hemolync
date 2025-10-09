// /**
//  * SSE Client Usage Examples
//  * Demonstrates various ways to use the type-safe SSE client
//  */

// import React from 'react'
// import {
//   createAuthenticatedSSEConfig,
//   useFilteredSSE,
//   useSSE,
//   useSimpleSSE,
// } from './index'

// // Example 1: Basic usage with type safety
// interface ChatMessage {
//   id: string
//   user: string
//   message: string
//   timestamp: number
// }

// export function ChatComponent({ accessToken }: { accessToken: string }) {
//   const { messages, isConnected, hasError, reconnect } = useSSE<ChatMessage>(
//     '/chat/stream',
//     {
//       baseUrl: 'http://localhost:8000/api',
//       ...createAuthenticatedSSEConfig(accessToken),
//       handlers: {
//         onMessage: (event) => {
//           console.log('New chat message:', event.data)
//         },
//         onError: (error) => {
//           console.error('Chat connection error:', error)
//         },
//       },
//     },
//   )

//   return (
//     <div>
//       <div>
//         Status: {isConnected ? 'Connected' : hasError ? 'Error' : 'Connecting'}
//       </div>
//       <div>Messages: {messages.length}</div>
//       {hasError && <button onClick={reconnect}>Reconnect</button>}
//     </div>
//   )
// }

// // Example 2: Simple usage for basic scenarios
// export function SimpleNotificationComponent({
//   accessToken,
// }: {
//   accessToken: string
// }) {
//   const { isConnected, connect, disconnect } = useSimpleSSE<string>(
//     '/notifications/stream',
//     (message) => {
//       // Type-safe message handling
//       console.log('Notification:', message)
//     },
//     {
//       baseUrl: 'http://localhost:8000/api',
//       ...createAuthenticatedSSEConfig(accessToken),
//     },
//   )

//   return (
//     <div>
//       <button onClick={isConnected ? disconnect : connect}>
//         {isConnected ? 'Disconnect' : 'Connect'}
//       </button>
//     </div>
//   )
// }

// // Example 3: Filtered messages
// interface SystemEvent {
//   type: 'error' | 'warning' | 'info'
//   message: string
//   timestamp: number
// }

// export function SystemEventsComponent({
//   accessToken,
// }: {
//   accessToken: string
// }) {
//   const { messages } = useFilteredSSE<SystemEvent>(
//     '/system/events',
//     (event) => event.data.type === 'error', // Only show error events
//     {
//       baseUrl: 'http://localhost:8000/api',
//       ...createAuthenticatedSSEConfig(accessToken),
//     },
//   )

//   return (
//     <div>
//       <h3>System Errors ({messages.length})</h3>
//       {messages.map((event, index) => (
//         <div key={index} className="text-red-500">
//           {event.data.message}
//         </div>
//       ))}
//     </div>
//   )
// }

// // Example 4: Custom message parser
// interface CustomData {
//   payload: string
//   metadata: {
//     source: string
//     version: string
//   }
// }

// export function CustomParserComponent({
//   accessToken,
// }: {
//   accessToken: string
// }) {
//   const { messages } = useSSE<CustomData>('/custom/stream', {
//     baseUrl: 'http://localhost:8000/api',
//     ...createAuthenticatedSSEConfig(accessToken),
//     // Custom message parser
//     messageParser: (data: string) => {
//       const parsed = JSON.parse(data)
//       return {
//         payload: parsed.content,
//         metadata: {
//           source: parsed.origin,
//           version: parsed.v,
//         },
//       }
//     },
//   })

//   return (
//     <div>
//       {messages.map((event, index) => (
//         <div key={index}>
//           <div>Source: {event.data.metadata.source}</div>
//           <div>Version: {event.data.metadata.version}</div>
//           <div>Payload: {event.data.payload}</div>
//         </div>
//       ))}
//     </div>
//   )
// }

// // Example 5: Advanced configuration with reconnection
// export function AdvancedSSEComponent({ accessToken }: { accessToken: string }) {
//   const {
//     connectionState,
//     connectionInfo,
//     messages,
//     connect,
//     disconnect,
//     reconnect,
//     clearMessages,
//   } = useSSE<ChatMessage>('/advanced/chat', {
//     baseUrl: 'http://localhost:8000/api',
//     ...createAuthenticatedSSEConfig(accessToken),
//     maxReconnectAttempts: 10,
//     reconnectDelay: 2000,
//     reconnectStrategy: 'exponential',
//     handlers: {
//       onConnect: (info) => {
//         console.log('Connected at:', info.connectedAt)
//       },
//       onReconnect: (attempt, info) => {
//         console.log(`Reconnection attempt ${attempt}`)
//       },
//       onStateChange: (state, _info) => {
//         console.log('State changed to:', state)
//       },
//     },
//   })

//   return (
//     <div>
//       <div>State: {connectionState}</div>
//       <div>Attempts: {connectionInfo.reconnectAttempts}</div>
//       <div>Messages: {connectionInfo.messageCount}</div>
//       <div>
//         <button onClick={connect}>Connect</button>
//         <button onClick={disconnect}>Disconnect</button>
//         <button onClick={reconnect}>Reconnect</button>
//         <button onClick={clearMessages}>Clear Messages</button>
//       </div>
//     </div>
//   )
// }
