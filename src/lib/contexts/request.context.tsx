import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { newRequestSchemaData } from '@/components/request-form'

const STORAGE_KEY = 'hemolync:draftRequest'
const TTL_MS = 1 * 60 * 1000 // 3 minutes

export interface RequestDraftContextValue {
  draft: newRequestSchemaData | null
  setDraft: (data: newRequestSchemaData) => void
  clearDraft: () => void
}

interface StoredDraft {
  value: newRequestSchemaData
  expiresAt: number
}

const RequestDraftContext = createContext<RequestDraftContextValue | undefined>(
  undefined,
)

export function RequestDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<newRequestSchemaData | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed: StoredDraft = JSON.parse(raw)
      if (Date.now() > parsed.expiresAt) {
        window.sessionStorage.removeItem(STORAGE_KEY)
        return null
      }
      return parsed.value
    } catch {
      return null
    }
  })

  const setDraft = (data: newRequestSchemaData) => setDraftState(data)
  const clearDraft = () => setDraftState(null)

  useEffect(() => {
    if (draft) {
      const payload: StoredDraft = {
        value: draft,
        expiresAt: Date.now() + TTL_MS,
      }
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } else {
      window.sessionStorage.removeItem(STORAGE_KEY)
    }
  }, [draft])

  const value: RequestDraftContextValue = { draft, setDraft, clearDraft }

  return (
    <RequestDraftContext.Provider value={value}>
      {children}
    </RequestDraftContext.Provider>
  )
}

export function useRequestDraft() {
  const ctx = useContext(RequestDraftContext)
  if (!ctx) {
    throw new Error('useRequestDraft must be used within RequestDraftProvider')
  }
  return ctx
}
