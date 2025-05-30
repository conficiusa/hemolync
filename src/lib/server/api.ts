import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

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
