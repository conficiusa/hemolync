import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { routeTree } from '@/routeTree.gen'

describe('Index Route', () => {
  let queryClient: QueryClient

  const renderWithRouter = () => {
    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    return render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )
  }

  beforeEach(() => {
    // Each test gets a fresh QueryClient instance
    queryClient = new QueryClient()
  })

  // Mock `window.matchMedia` (used by `sonner`)
  beforeAll(() => {
    if (!('matchMedia' in window)) {
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
    }
  })

  it('renders the home page when the user is not authenticated', async () => {
    // Mock an unauthenticated session
    queryClient.setQueryData(['session'], { access_token: null })

    renderWithRouter()

    expect(
      await screen.findByRole('heading', { name: /welcome to hemolync/i }),
    ).toBeInTheDocument()

    const loginLink = screen.getByRole('link', { name: /login/i })
    expect(loginLink).toHaveAttribute('href', '/auth/login')

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    expect(dashboardLink).toHaveAttribute('href', '/dashboard')
  })

  it('shows the welcome page correctly', async () => {
    // Simple test that doesn't rely on complex redirect logic
    queryClient.setQueryData(['session'], { access_token: null })

    renderWithRouter()

    expect(
      await screen.findByRole('heading', { name: /welcome to hemolync/i }),
    ).toBeInTheDocument()

    // Should have navigation elements
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
  })
})
