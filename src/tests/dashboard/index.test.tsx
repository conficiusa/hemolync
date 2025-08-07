import '@testing-library/jest-dom/vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { routeTree } from '@/routeTree.gen'
import authService from '@/lib/services/auth.service'

// Mock the auth service to prevent HTTP requests
vi.mock('@/lib/services/auth.service', () => ({
  default: {
    getSession: vi.fn(),
    loginRequest: vi.fn(),
    logoutRequest: vi.fn(),
    updateUserRequest: vi.fn(),
  },
}))

describe('Dashboard Index Route', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    // Each test gets a fresh QueryClient instance with isolated state
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
          gcTime: 0,
        },
        mutations: {
          retry: false,
        },
      },
    })
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

  it('redirects to the login page when not authenticated', async () => {
    // Mock an unauthenticated session
    vi.mocked(authService.getSession).mockRejectedValue(
      new Error('Unauthorized'),
    )

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    // Navigate to a protected route (dashboard) to trigger authentication check
    await act(async () => {
      await router.navigate({ to: '/dashboard' })
    })

    await act(() => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>,
      )
    })

    await waitFor(() => {
      expect(window.location.pathname).toBe('/auth/login')
    })

    // Verify we're on the login page
    expect(
      await screen.findByRole('heading', { name: /welcome to hemolync/i }),
    ).toBeInTheDocument()

    // Verify login form elements are present
    const emailInput = screen.getByRole('textbox', { name: /email/i })
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')

    const passwordInput = screen.getByLabelText(/password/i)
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute('type', 'password')

    const loginButton = screen.getByRole('button', { name: /login/i })
    expect(loginButton).toBeInTheDocument()
    expect(loginButton).toHaveAttribute('type', 'submit')
  })

  it('allows access to /dashboard when the user is authenticated', async () => {
    // Mock session data
    const sessionData = {
      access_token: 'fake-token',
      user: {
        id: '1',
        email: 'test@test.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'admin',
        createdAt: new Date(),
        facility: {
          id: '1',
          facility_name: 'Test Hospital',
        },
      },
    }

    // Mock the auth service
    vi.mocked(authService.getSession).mockResolvedValue(sessionData)

    // Pre-populate QueryClient to avoid loading state
    queryClient.setQueryData(['session'], sessionData)

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    // Navigate to dashboard with authenticated user
    await act(async () => {
      await router.navigate({ to: '/dashboard' })
    })

    await act(() => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>,
      )
    })

    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard')
    })

    // ✅ Test for StatCards in the dashboard layout
    expect(await screen.findByText(/total blood in stock/i)).toBeInTheDocument()

    expect(screen.getByText(/200 units/i)).toBeInTheDocument()

    expect(screen.getByText(/total transferred/i)).toBeInTheDocument()

    expect(screen.getByText(/80 units/i)).toBeInTheDocument()

    expect(screen.getByText(/total request/i)).toBeInTheDocument()

    expect(screen.getByText(/50 units/i)).toBeInTheDocument()

    // ✅ Test for dashboard navigation (proves we're on dashboard, not login)
    expect(
      screen.getByRole('complementary'), // sidebar
    ).toBeInTheDocument()
  })
})
