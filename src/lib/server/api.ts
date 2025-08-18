import axios from 'axios'

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://backend.donorcom.org'
    : 'http://localhost:8000/api'
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
