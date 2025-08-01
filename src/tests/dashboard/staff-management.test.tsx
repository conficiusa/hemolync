import '@testing-library/jest-dom/vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { User } from '@/lib/types/system-types'
import authService from '@/lib/services/auth.service'
import { protectedApi } from '@/lib/server/protected-api'
import { routeTree } from '@/routeTree.gen'

// Mock the auth service
vi.mock('@/lib/services/auth.service', () => ({
  default: {
    getSession: vi.fn(),
    loginRequest: vi.fn(),
    logoutRequest: vi.fn(),
    updateUserRequest: vi.fn(),
  },
}))

// Mock the protected API for staff operations
vi.mock('@/lib/server/protected-api', () => ({
  protectedApi: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('Staff Management Page', () => {
  let queryClient: QueryClient

  const createSessionData = (
    role:
      | 'facility_administrator'
      | 'staff'
      | 'lab_manager' = 'facility_administrator',
  ) => ({
    access_token: 'fake-token',
    user: {
      id: '1',
      email: 'admin@test.com',
      first_name: 'Admin',
      last_name: 'User',
      role,
      phone: '+233123456789',
      created_at: '2024-01-01T00:00:00Z',
      last_login: '2024-01-15T10:30:00Z',
      emailVerified: true,
      facility: {
        id: '1',
        facility_name: 'Test Hospital',
      },
    },
  })

  const createStaffData = (): Array<User> => [
    {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@test.com',
      role: 'staff',
      phone: '+233123456789',
      created_at: '2024-01-01T00:00:00Z',
      last_login: '2024-01-10T09:00:00Z',
      emailVerified: true,
    },
    {
      id: '2',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@test.com',
      role: 'lab_manager',
      phone: '+233987654321',
      created_at: '2024-01-02T00:00:00Z',
      last_login: null,
      emailVerified: true,
    },
    {
      id: '3',
      first_name: 'Bob',
      last_name: 'Johnson',
      email: 'bob.johnson@test.com',
      role: 'facility_administrator',
      phone: '+233555123456',
      created_at: '2024-01-03T00:00:00Z',
      last_login: '2024-01-14T14:22:00Z',
      emailVerified: true,
    },
  ]

  beforeEach(() => {
    // Create a fresh QueryClient with isolated state
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
    // Clear all mocks
    vi.clearAllMocks()
  })

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

  it('should redirect non-facility_administrator users to dashboard', async () => {
    const sessionData = createSessionData('staff') // Non-admin user
    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    queryClient.setQueryData(['session'], sessionData)

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    // Try to navigate to staff-management route
    await router.navigate({ to: '/dashboard/staff-management' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    // Should be redirected to dashboard
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard')
    })

    // Should see dashboard content, not staff management
    expect(await screen.findByText(/total blood in stock/i)).toBeInTheDocument()
  }, 15000)

  it('should allow facility_administrator to access staff management', async () => {
    const sessionData = createSessionData('facility_administrator')
    const staffData = createStaffData()

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(protectedApi.get).mockResolvedValue({ data: staffData })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(['staff'], staffData)

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/staff-management' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    // Should stay on staff management route
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard/staff-management')
    })

    // Should see staff management content
    expect(await screen.findByText('Users')).toBeInTheDocument()
    expect(screen.getByText('3 users')).toBeInTheDocument()
  }, 15000)

  it('should display empty state when no staff members exist', async () => {
    const sessionData = createSessionData('facility_administrator')
    const emptyStaffData: Array<User> = []

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(protectedApi.get).mockResolvedValue({ data: emptyStaffData })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(['staff'], emptyStaffData)

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/staff-management' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    // Should show empty state
    expect(
      await screen.findByText('No staff members available'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'No staff members available. Invite a staff member to get started.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Invite Staff Member' }),
    ).toBeInTheDocument()

    // Header should not be visible when empty
    expect(screen.queryByText('Users')).not.toBeInTheDocument()
  }, 10000)

  it('should display staff table with all user information', async () => {
    const sessionData = createSessionData('facility_administrator')
    const staffData = createStaffData()

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(protectedApi.get).mockResolvedValue({ data: staffData })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(['staff'], staffData)

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/staff-management' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    // Verify header is present
    expect(await screen.findByText('Users')).toBeInTheDocument()
    expect(screen.getByText('3 users')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add User' })).toBeInTheDocument()

    // Verify table headers
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email address')).toBeInTheDocument()
    expect(screen.getByText('Date Joined')).toBeInTheDocument()
    expect(screen.getByText('Last Login')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()

    // Verify staff data is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@test.com')).toBeInTheDocument()
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument()
    expect(screen.getByText('Jan 10, 2024')).toBeInTheDocument()

    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('jane.smith@test.com')).toBeInTheDocument()
    expect(screen.getByText('Jan 2, 2024')).toBeInTheDocument()
    expect(screen.getByText('N/A')).toBeInTheDocument() // No last login

    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    expect(screen.getByText('bob.johnson@test.com')).toBeInTheDocument()
    expect(screen.getByText('Jan 3, 2024')).toBeInTheDocument()
    expect(screen.getByText('Jan 14, 2024')).toBeInTheDocument()
  }, 10000)

  it('should display role badges with correct styling', async () => {
    const sessionData = createSessionData('facility_administrator')
    const staffData = createStaffData()

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(protectedApi.get).mockResolvedValue({ data: staffData })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(['staff'], staffData)

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/staff-management' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Users')).toBeInTheDocument()
    })

    // Check role badges are displayed with correct text
    expect(screen.getByText('Staff')).toBeInTheDocument()
    expect(screen.getByText('Lab manager')).toBeInTheDocument()
    expect(screen.getByText('Facility administrator')).toBeInTheDocument()

    // Check role badge styling classes
    const staffBadge = screen.getByText('Staff')
    expect(staffBadge).toHaveClass('bg-blue-50', 'text-blue-700')

    const labManagerBadge = screen.getByText('Lab manager')
    expect(labManagerBadge).toHaveClass('bg-pink-50', 'text-pink-700')

    const adminBadge = screen.getByText('Facility administrator')
    expect(adminBadge).toHaveClass('bg-amber-50', 'text-amber-700')
  }, 10000)

  it('should display edit and delete action buttons for each user', async () => {
    const sessionData = createSessionData('facility_administrator')
    const staffData = createStaffData()

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(protectedApi.get).mockResolvedValue({ data: staffData })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(['staff'], staffData)

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/staff-management' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Users')).toBeInTheDocument()
    })

    // Check that table rows contain action buttons
    const tableRows = screen.getAllByRole('row')
    // Skip header row, count data rows
    const dataRows = tableRows.slice(1)
    expect(dataRows.length).toBe(3) // Should have 3 staff members

    // Each row should have action buttons (at least edit and delete)
    dataRows.forEach((row) => {
      const buttonsInRow = row.querySelectorAll('button')
      expect(buttonsInRow.length).toBeGreaterThanOrEqual(2) // At least edit and delete buttons
    })

    // Verify there are action buttons for all users
    const allButtons = screen.getAllByRole('button')
    const actionButtons = allButtons.filter(
      (button) =>
        button.querySelector('svg') &&
        button.closest('tr') && // Button is in a table row
        !button.textContent?.includes('Add User'),
    )

    // Should have action buttons for all users (at least 6 total)
    expect(actionButtons.length).toBeGreaterThanOrEqual(6)
  }, 10000)

  it('should display search input in header', async () => {
    const sessionData = createSessionData('facility_administrator')
    const staffData = createStaffData()

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(protectedApi.get).mockResolvedValue({ data: staffData })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(['staff'], staffData)

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/staff-management' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Users')).toBeInTheDocument()
    })

    // Check search input is present
    const searchInput = screen.getByPlaceholderText('Search user')
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute('type', 'text')

    // Check search icon is present
    const searchIcon = searchInput.parentElement?.querySelector('svg')
    expect(searchIcon).toBeInTheDocument()
  }, 10000)

  it('should display download button in header', async () => {
    const sessionData = createSessionData('facility_administrator')
    const staffData = createStaffData()

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(protectedApi.get).mockResolvedValue({ data: staffData })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(['staff'], staffData)

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/staff-management' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Users')).toBeInTheDocument()
    })

    // Find download button by looking for buttons with download icon
    const allButtons = screen.getAllByRole('button')
    const downloadButton = allButtons.find((button) => {
      const svg = button.querySelector('svg')
      return svg && !button.textContent?.includes('Add User')
    })
    expect(downloadButton).toBeInTheDocument()
  }, 10000)

  it('should display user count badge correctly', async () => {
    const sessionData = createSessionData('facility_administrator')

    // Test with different staff counts
    const staffDataLarge = [
      ...createStaffData(),
      {
        id: '4',
        first_name: 'Alice',
        last_name: 'Wilson',
        email: 'alice.wilson@test.com',
        role: 'staff' as const,
        phone: '+233111222333',
        created_at: '2024-01-04T00:00:00Z',
        last_login: '2024-01-12T11:15:00Z',
        emailVerified: true,
      },
      {
        id: '5',
        first_name: 'Charlie',
        last_name: 'Brown',
        email: 'charlie.brown@test.com',
        role: 'lab_manager' as const,
        phone: '+233444555666',
        created_at: '2024-01-05T00:00:00Z',
        last_login: null,
        emailVerified: true,
      },
    ] // 5 users

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(protectedApi.get).mockResolvedValue({ data: staffDataLarge })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(['staff'], staffDataLarge)

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/staff-management' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    // Should show correct user count
    expect(await screen.findByText('5 users')).toBeInTheDocument()

    // Badge should have correct styling
    const badge = screen.getByText('5 users')
    expect(badge).toHaveClass('bg-[#f8e3e8]', 'text-primary-accent-foreground')
  }, 10000)

  it('should handle error state when staff fetch fails', async () => {
    const sessionData = createSessionData('facility_administrator')
    vi.mocked(authService.getSession).mockResolvedValue(sessionData)

    // Mock API to throw an error
    vi.mocked(protectedApi.get).mockRejectedValue(
      new Error('Failed to fetch staff'),
    )

    // Pre-populate session data but NOT staff data, so the loader will fail
    queryClient.setQueryData(['session'], sessionData)

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    // Expect the navigation to throw due to the error in the loader
    await expect(
      router.navigate({ to: '/dashboard/staff-management' }),
    ).rejects.toThrow()

    // The error should be thrown during navigation/loader execution
    // This is expected behavior for TanStack Router error handling
  }, 15000)

  it('should format dates correctly', async () => {
    const sessionData = createSessionData('facility_administrator')
    const staffData: Array<User> = [
      {
        id: '1',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        role: 'staff',
        phone: '+233123456789',
        created_at: '2024-03-15T09:30:00Z',
        last_login: '2024-05-22T14:45:00Z',
        emailVerified: true,
      },
      {
        id: '2',
        first_name: 'Another',
        last_name: 'User',
        email: 'another@example.com',
        role: 'lab_manager',
        phone: '+233987654321',
        created_at: '2024-12-01T16:20:00Z',
        last_login: null, // No last login
        emailVerified: true,
      },
    ]

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(protectedApi.get).mockResolvedValue({ data: staffData })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(['staff'], staffData)

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/staff-management' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Users')).toBeInTheDocument()
    })

    // Check formatted dates (MMM d, yyyy format)
    expect(screen.getByText('Mar 15, 2024')).toBeInTheDocument() // created_at
    expect(screen.getByText('May 22, 2024')).toBeInTheDocument() // last_login
    expect(screen.getByText('Dec 1, 2024')).toBeInTheDocument() // created_at

    // Check null last_login shows "N/A"
    const naElements = screen.getAllByText('N/A')
    expect(naElements.length).toBeGreaterThan(0)
  }, 10000)

  it('should handle different user roles correctly', async () => {
    const sessionData = createSessionData('facility_administrator')
    const staffData: Array<User> = [
      {
        id: '1',
        first_name: 'Staff',
        last_name: 'Member',
        email: 'staff@test.com',
        role: 'staff',
        phone: '+233123456789',
        created_at: '2024-01-01T00:00:00Z',
        last_login: '2024-01-10T09:00:00Z',
        emailVerified: true,
      },
      {
        id: '2',
        first_name: 'Lab',
        last_name: 'Manager',
        email: 'lab@test.com',
        role: 'lab_manager',
        phone: '+233987654321',
        created_at: '2024-01-02T00:00:00Z',
        last_login: null,
        emailVerified: true,
      },
      {
        id: '3',
        first_name: 'Facility',
        last_name: 'Admin',
        email: 'admin@test.com',
        role: 'facility_administrator',
        phone: '+233555123456',
        created_at: '2024-01-03T00:00:00Z',
        last_login: '2024-01-14T14:22:00Z',
        emailVerified: true,
      },
    ]

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(protectedApi.get).mockResolvedValue({ data: staffData })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(['staff'], staffData)

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/staff-management' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Users')).toBeInTheDocument()
    })

    // Check all role types are displayed and formatted correctly
    expect(screen.getByText('Staff')).toBeInTheDocument()
    expect(screen.getByText('Lab manager')).toBeInTheDocument()
    expect(screen.getByText('Facility administrator')).toBeInTheDocument()

    // Check user information is displayed
    expect(screen.getByText('Staff Member')).toBeInTheDocument()
    expect(screen.getByText('Lab Manager')).toBeInTheDocument()
    expect(screen.getByText('Facility Admin')).toBeInTheDocument()
  }, 10000)

  it('should display header buttons only when staff data exists', async () => {
    const sessionData = createSessionData('facility_administrator')
    const staffData = createStaffData()

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(protectedApi.get).mockResolvedValue({ data: staffData })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(['staff'], staffData)

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/staff-management' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Users')).toBeInTheDocument()
    })

    // Header should be visible with all elements
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('3 users')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search user')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add User' })).toBeInTheDocument()

    // Download button should be present (icon button)
    const buttons = screen.getAllByRole('button')
    const downloadButton = buttons.find(
      (button) =>
        button.querySelector('svg') &&
        !button.textContent?.includes('Add User'),
    )
    expect(downloadButton).toBeInTheDocument()
  }, 10000)
})
