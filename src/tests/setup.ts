/*
 * Global test setup for Vitest.
 * Adds a JSDOM-friendly stub for `window.matchMedia`,
 * which some UI libraries (e.g. sonner) rely on at import time.
 */
import { vi } from 'vitest'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
