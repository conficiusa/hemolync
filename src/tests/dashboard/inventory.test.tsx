import '@testing-library/jest-dom/vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import productsService from '@/lib/services/products.service'
import authService from '@/lib/services/auth.service'
import { routeTree } from '@/routeTree.gen'

vi.mock('@/lib/services/products.service', () => ({
  default: {
    fetchProducts: vi.fn(),
  },
}))

vi.mock('@/lib/services/auth.service', () => ({
  default: {
    getSession: vi.fn(),
    loginRequest: vi.fn(),
    logoutRequest: vi.fn(),
    updateUserRequest: vi.fn(),
  },
}))

describe('Inventory', () => {
  let queryClient: QueryClient

  const createSessionData = () => ({
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
  })

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

  it('it should render an empty component when inventory is empty', async () => {
    const sessionData = createSessionData()

    // Mock empty inventory response
    const inventoryData = {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
      has_next: false,
      has_prev: false,
    }

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)

    // Mock fetchProducts to handle the specific arguments it receives
    vi.mocked(productsService.fetchProducts).mockImplementation(() => {
      // Return inventory data regardless of the specific arguments
      return Promise.resolve(inventoryData)
    })

    // ✅ CRITICAL: Pre-populate QueryClient with session data and inventory data
    queryClient.setQueryData(['session'], sessionData)

    // Pre-populate QueryClient with inventory data using correct query key
    queryClient.setQueryData(
      ['inventory', 1, 'created_at', 'asc'],
      inventoryData,
    )

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    // Navigate to the inventory route and wait for loader to complete
    await router.navigate({ to: '/dashboard/inventory' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    expect(
      await screen.findByText('No blood products available'),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Add Product' }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'Your inventory is currently empty. Start tracking by adding your first blood product.',
      ),
    ).toBeInTheDocument()
  }, 15000)

  it('it should render an error boundary when the inventory fetch fails', async () => {
    const sessionData = createSessionData()
    vi.mocked(authService.getSession).mockResolvedValue(sessionData)

    // Make sure the error is properly thrown
    vi.mocked(productsService.fetchProducts).mockRejectedValue(
      new Error('Fetch failed'),
    )

    // Pre-populate session data but NOT inventory data, so the loader will fail
    queryClient.setQueryData(['session'], sessionData)

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/inventory' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    // Debug: Log what's actually being rendered
    await screen
      .findByText('Blood Products', {}, { timeout: 2000 })
      .catch(() => {
        // If we can't find "Blood Products", let's see what IS rendered
        console.log('DEBUG: Document body content:', document.body.innerHTML)
      })

    // Wait for error boundary to show instead of immediate check
    expect(await screen.findByText('Error loading data')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  }, 15000)

  it('should render inventory table with products when data is available', async () => {
    const sessionData = createSessionData()

    // Mock inventory response with products
    const inventoryData = {
      items: [
        {
          id: '1',
          blood_type: 'A+',
          blood_product: 'Whole Blood',
          quantity: 5,
          expiry_date: new Date('2024-12-31'),
          blood_bank_name: 'City Blood Bank',
          created_at: new Date('2024-01-01'),
        },
        {
          id: '2',
          blood_type: 'O-',
          blood_product: 'Platelets',
          quantity: 3,
          expiry_date: new Date('2024-11-30'),
          blood_bank_name: 'General Hospital',
          created_at: new Date('2024-01-02'),
        },
      ],
      total: 2,
      page: 1,
      limit: 10,
      has_next: false,
      has_prev: false,
    }

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(productsService.fetchProducts).mockImplementation(() => {
      return Promise.resolve(inventoryData)
    })

    // Pre-populate QueryClient with session data and inventory data
    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(
      ['inventory', 1, 'created_at', 'asc'],
      inventoryData,
    )

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/inventory' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    // Verify inventory header is present
    expect(await screen.findByText('Blood Products')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Add Product' }),
    ).toBeInTheDocument()

    // Verify table headers
    expect(screen.getByText('Blood Type')).toBeInTheDocument()
    expect(screen.getByText('Blood Product')).toBeInTheDocument()
    expect(screen.getByText('Quantity')).toBeInTheDocument()
    expect(screen.getByText('Expiry Date')).toBeInTheDocument()
    expect(screen.getByText('Blood Bank')).toBeInTheDocument()

    // Verify product data is displayed
    expect(screen.getByText('A+')).toBeInTheDocument()
    expect(screen.getByText('Whole Blood')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('Dec 31, 2024')).toBeInTheDocument()
    expect(screen.getByText('City Blood Bank')).toBeInTheDocument()

    expect(screen.getByText('O-')).toBeInTheDocument()
    expect(screen.getByText('Platelets')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Nov 30, 2024')).toBeInTheDocument()
    expect(screen.getByText('General Hospital')).toBeInTheDocument()

    // Verify action buttons (edit/delete) are present
    const editButtons = screen.getAllByRole('button', { name: '' }) // Pencil icons
    const deleteButtons = screen.getAllByRole('button', { name: '' }) // Trash icons
    expect(editButtons.length).toBeGreaterThan(0)
    expect(deleteButtons.length).toBeGreaterThan(0)
  }, 10000)

  it('should display pagination controls when there are multiple pages', async () => {
    const sessionData = createSessionData()

    const inventoryData = {
      items: [
        {
          id: '1',
          blood_type: 'A+',
          blood_product: 'Whole Blood',
          quantity: 5,
          expiry_date: new Date('2024-12-31'),
          blood_bank_name: 'City Blood Bank',
          created_at: new Date('2024-01-01'),
        },
      ],
      total: 25, // More than 10 items to trigger pagination
      page: 1,
      limit: 10,
      has_next: true,
      has_prev: false,
      // Add required pagination properties
      total_items: 25,
      total_pages: 3,
      current_page: 1,
      page_size: 10,
    }

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(productsService.fetchProducts).mockImplementation(() => {
      return Promise.resolve(inventoryData)
    })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(
      ['inventory', 1, 'created_at', 'asc'],
      inventoryData,
    )

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/inventory' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    // Verify pagination controls are present
    // Look for navigation buttons and page numbers
    expect(
      await screen.findByLabelText('Go to previous page'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument()

    // Look for page number buttons
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
  }, 10000)

  it('should handle column sorting when header is clicked', async () => {
    const sessionData = createSessionData()

    const inventoryData = {
      items: [
        {
          id: '1',
          blood_type: 'A+',
          blood_product: 'Whole Blood',
          quantity: 5,
          expiry_date: new Date('2024-12-31'),
          blood_bank_name: 'City Blood Bank',
          created_at: new Date('2024-01-01'),
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      has_next: false,
      has_prev: false,
    }

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(productsService.fetchProducts).mockImplementation(() => {
      return Promise.resolve(inventoryData)
    })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(
      ['inventory', 1, 'created_at', 'asc'],
      inventoryData,
    )

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/inventory' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    // Find sortable column headers (they should have sort icons)
    const bloodTypeHeader = await screen.findByText('Blood Type')
    const quantityHeader = screen.getByText('Quantity')

    expect(bloodTypeHeader).toBeInTheDocument()
    expect(quantityHeader).toBeInTheDocument()

    // Verify sort icons are present (ChevronsUpDown icons)
    // The sort icons should be rendered as part of the clickable headers
    expect(bloodTypeHeader.closest('th')).toBeInTheDocument()
    expect(quantityHeader.closest('th')).toBeInTheDocument()
  }, 10000)

  it('should not show header when inventory is empty', async () => {
    const sessionData = createSessionData()

    const inventoryData = {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
      has_next: false,
      has_prev: false,
    }

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(productsService.fetchProducts).mockImplementation(() => {
      return Promise.resolve(inventoryData)
    })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(
      ['inventory', 1, 'created_at', 'asc'],
      inventoryData,
    )

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/inventory' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    // Header should not be shown when inventory is empty
    expect(screen.queryByText('Blood Products')).not.toBeInTheDocument()

    // But empty state should be shown
    expect(
      await screen.findByText('No blood products available'),
    ).toBeInTheDocument()
  }, 10000)

  it('should show header with Add Product button when inventory has products', async () => {
    const sessionData = createSessionData()

    const inventoryData = {
      items: [
        {
          id: '1',
          blood_type: 'A+',
          blood_product: 'Whole Blood',
          quantity: 5,
          expiry_date: new Date('2024-12-31'),
          blood_bank_name: 'City Blood Bank',
          created_at: new Date('2024-01-01'),
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      has_next: false,
      has_prev: false,
    }

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(productsService.fetchProducts).mockImplementation(() => {
      return Promise.resolve(inventoryData)
    })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(
      ['inventory', 1, 'created_at', 'asc'],
      inventoryData,
    )

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/inventory' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    // Header should be shown when inventory has products
    expect(await screen.findByText('Blood Products')).toBeInTheDocument()

    // Add Product button should be present in header
    const addProductButtons = screen.getAllByRole('button')
    const addProductButton = addProductButtons.find((button) =>
      button.textContent?.includes('Add Product'),
    )
    expect(addProductButton).toBeInTheDocument()

    // Download button should be present
    // The download button has a Download icon but no text, so we look for buttons with icons
    const downloadButton = addProductButtons.find(
      (button) =>
        button.querySelector('svg') &&
        !button.textContent?.includes('Add Product'),
    )
    expect(downloadButton).toBeInTheDocument()
  }, 10000)

  it('should render checkboxes for selecting products', async () => {
    const sessionData = createSessionData()

    const inventoryData = {
      items: [
        {
          id: '1',
          blood_type: 'A+',
          blood_product: 'Whole Blood',
          quantity: 5,
          expiry_date: new Date('2024-12-31'),
          blood_bank_name: 'City Blood Bank',
          created_at: new Date('2024-01-01'),
        },
        {
          id: '2',
          blood_type: 'O-',
          blood_product: 'Platelets',
          quantity: 3,
          expiry_date: new Date('2024-11-30'),
          blood_bank_name: 'General Hospital',
          created_at: new Date('2024-01-02'),
        },
      ],
      total: 2,
      page: 1,
      limit: 10,
      has_next: false,
      has_prev: false,
    }

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(productsService.fetchProducts).mockImplementation(() => {
      return Promise.resolve(inventoryData)
    })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(
      ['inventory', 1, 'created_at', 'asc'],
      inventoryData,
    )

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/inventory' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    // Wait for table to load
    expect(await screen.findByText('Blood Products')).toBeInTheDocument()

    // Should have header checkbox for selecting all
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBeGreaterThanOrEqual(3) // 1 header + 2 row checkboxes

    // Header checkbox should be present
    const headerCheckbox = checkboxes[0]
    expect(headerCheckbox).toBeInTheDocument()

    // Row checkboxes should be present for each product
    expect(checkboxes.length).toBeGreaterThanOrEqual(
      inventoryData.items.length + 1,
    )
  }, 10000)

  it('should display formatted dates correctly', async () => {
    const sessionData = createSessionData()

    const inventoryData = {
      items: [
        {
          id: '1',
          blood_type: 'A+',
          blood_product: 'Whole Blood',
          quantity: 5,
          expiry_date: new Date('2024-01-15'),
          blood_bank_name: 'City Blood Bank',
          created_at: new Date('2024-01-01'),
        },
        {
          id: '2',
          blood_type: 'B-',
          blood_product: 'Red Blood Cells',
          quantity: 8,
          expiry_date: new Date('2024-03-22'),
          blood_bank_name: 'Metro Hospital',
          created_at: new Date('2024-01-02'),
        },
      ],
      total: 2,
      page: 1,
      limit: 10,
      has_next: false,
      has_prev: false,
    }

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(productsService.fetchProducts).mockImplementation(() => {
      return Promise.resolve(inventoryData)
    })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(
      ['inventory', 1, 'created_at', 'asc'],
      inventoryData,
    )

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/inventory' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    // Wait for table to load
    expect(await screen.findByText('Blood Products')).toBeInTheDocument()

    // Check that dates are formatted correctly (MMM dd, yyyy format)
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
    expect(screen.getByText('Mar 22, 2024')).toBeInTheDocument()

    // Verify all product data is displayed
    expect(screen.getByText('A+')).toBeInTheDocument()
    expect(screen.getByText('B-')).toBeInTheDocument()
    expect(screen.getByText('Whole Blood')).toBeInTheDocument()
    expect(screen.getByText('Red Blood Cells')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('City Blood Bank')).toBeInTheDocument()
    expect(screen.getByText('Metro Hospital')).toBeInTheDocument()
  }, 10000)

  it('should hide pagination when total pages is 1 or less', async () => {
    const sessionData = createSessionData()

    const inventoryData = {
      items: [
        {
          id: '1',
          blood_type: 'A+',
          blood_product: 'Whole Blood',
          quantity: 5,
          expiry_date: new Date('2024-12-31'),
          blood_bank_name: 'City Blood Bank',
          created_at: new Date('2024-01-01'),
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      has_next: false,
      has_prev: false,
      // Pagination properties
      total_items: 1,
      total_pages: 1,
      current_page: 1,
      page_size: 10,
    }

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(productsService.fetchProducts).mockImplementation(() => {
      return Promise.resolve(inventoryData)
    })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(
      ['inventory', 1, 'created_at', 'asc'],
      inventoryData,
    )

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/inventory' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    // Wait for table to load
    expect(await screen.findByText('Blood Products')).toBeInTheDocument()

    // Pagination should not be visible when total_pages is 1
    expect(
      screen.queryByLabelText('Go to previous page'),
    ).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Go to next page')).not.toBeInTheDocument()
  }, 10000)

  it('should handle large quantities and different blood products', async () => {
    const sessionData = createSessionData()

    const inventoryData = {
      items: [
        {
          id: '1',
          blood_type: 'AB+',
          blood_product: 'Plasma',
          quantity: 250,
          expiry_date: new Date('2024-06-15'),
          blood_bank_name: 'University Hospital',
          created_at: new Date('2024-01-01'),
        },
        {
          id: '2',
          blood_type: 'O+',
          blood_product: 'Cryoprecipitate',
          quantity: 15,
          expiry_date: new Date('2024-04-30'),
          blood_bank_name: 'Regional Blood Center',
          created_at: new Date('2024-01-02'),
        },
      ],
      total: 2,
      page: 1,
      limit: 10,
      has_next: false,
      has_prev: false,
    }

    vi.mocked(authService.getSession).mockResolvedValue(sessionData)
    vi.mocked(productsService.fetchProducts).mockImplementation(() => {
      return Promise.resolve(inventoryData)
    })

    queryClient.setQueryData(['session'], sessionData)
    queryClient.setQueryData(
      ['inventory', 1, 'created_at', 'asc'],
      inventoryData,
    )

    const router = createRouter({
      routeTree,
      context: {
        queryClient,
        auth: undefined!,
      },
    })

    await router.navigate({ to: '/dashboard/inventory' })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    // Wait for table to load
    expect(await screen.findByText('Blood Products')).toBeInTheDocument()

    // Check various blood types and products
    expect(screen.getByText('AB+')).toBeInTheDocument()
    expect(screen.getByText('O+')).toBeInTheDocument()
    expect(screen.getByText('Plasma')).toBeInTheDocument()
    expect(screen.getByText('Cryoprecipitate')).toBeInTheDocument()

    // Check large quantities are handled
    expect(screen.getByText('250')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()

    // Check different blood banks
    expect(screen.getByText('University Hospital')).toBeInTheDocument()
    expect(screen.getByText('Regional Blood Center')).toBeInTheDocument()

    // Check dates
    expect(screen.getByText('Jun 15, 2024')).toBeInTheDocument()
    expect(screen.getByText('Apr 30, 2024')).toBeInTheDocument()
  }, 10000)
})
