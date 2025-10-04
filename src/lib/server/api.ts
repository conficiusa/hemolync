import axios from 'axios'

export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://apis.donorcom.org/api'
    : 'http://localhost:8000/api'

export const WS_URL =
  process.env.NODE_ENV === 'production'
    ? 'wss://apis.donorcom.org/api'
    : 'ws://localhost:8000/api'

/**
 * Converts an HTTP URL to a WebSocket URL
 */
export function getWebSocketUrl(httpUrl: string): string {
  return httpUrl.replace(/^https?:\/\//, (match) =>
    match === 'https://' ? 'wss://' : 'ws://',
  )
}
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export const protectedApi = axios.create({
  baseURL: API_URL,

  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})
