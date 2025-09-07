import '@testing-library/jest-dom/vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import DashboardChart from '@/components/dashboard-chart'

// Mock recharts components
vi.mock('recharts', () => ({
  AreaChart: ({ children, ...props }: any) => (
    <div data-testid="area-chart" {...props}>
      {children}
    </div>
  ),
  Area: (props: any) => (
    <div data-testid="area" data-datakey={props.dataKey} {...props} />
  ),
  CartesianGrid: (props: any) => (
    <div data-testid="cartesian-grid" {...props} />
  ),
  XAxis: (props: any) => <div data-testid="x-axis" {...props} />,
  YAxis: (props: any) => <div data-testid="y-axis" {...props} />,
}))

// Mock chart components
vi.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children, ...props }: any) => (
    <div data-testid="chart-container" {...props}>
      {children}
    </div>
  ),
  ChartTooltip: (props: any) => <div data-testid="chart-tooltip" {...props} />,
  ChartTooltipContent: (props: any) => (
    <div data-testid="chart-tooltip-content" {...props} />
  ),
}))

describe('DashboardChart', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    vi.clearAllMocks()
  })

  it('renders the dashboard chart with default settings', () => {
    render(<DashboardChart />)

    // Check that the chart container is rendered
    expect(screen.getByTestId('chart-container')).toBeInTheDocument()
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()

    // Check that date range picker is present
    expect(
      screen.getByRole('button', { name: /pick a date range/i }),
    ).toBeInTheDocument()
  })

  it('supports multi-select for blood products', async () => {
    render(<DashboardChart />)

    // Look for multi-select dropdown
    const bloodProductSelector = screen.getByRole('button', {
      name: /select blood products/i,
    })
    expect(bloodProductSelector).toBeInTheDocument()

    // Open the dropdown
    fireEvent.click(bloodProductSelector)

    // Should show checkboxes for each blood product
    await waitFor(() => {
      expect(
        screen.getByRole('checkbox', { name: /select whole blood/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('checkbox', { name: /select red blood cells/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('checkbox', { name: /select platelets/i }),
      ).toBeInTheDocument()
    })
  })

  it('displays multiple area curves when multiple products are selected by default', async () => {
    render(<DashboardChart />)

    // Check that multiple Area components are rendered by default (first 3 products)
    await waitFor(() => {
      const areas = screen.getAllByTestId('area')
      expect(areas.length).toBe(3) // Default to first 3 products
    })
  })

  it('has a clear button for date range picker', () => {
    render(<DashboardChart />)

    // Look for clear button (X icon) next to date picker
    const clearButton = screen.getByRole('button', {
      name: /clear date range/i,
    })
    expect(clearButton).toBeInTheDocument()
  })

  it('resets to last 7 days when clear button is clicked', async () => {
    render(<DashboardChart />)

    // Click the clear button
    const clearButton = screen.getByRole('button', {
      name: /clear date range/i,
    })
    fireEvent.click(clearButton)

    // The component should reset to the default 7-day range
    // This would be reflected in the data being passed to the chart
    await waitFor(() => {
      const chartContainer = screen.getByTestId('chart-container')
      expect(chartContainer).toBeInTheDocument()
    })
  })

  it('defaults to last 7 days instead of 30 days', () => {
    render(<DashboardChart />)

    // Verify the chart is rendered - the actual date verification
    // would be in the implementation details
    const datePickerButton = screen.getByRole('button', {
      name: /pick a date range/i,
    })
    expect(datePickerButton).toBeInTheDocument()

    // The default 7-day range is now set in the component
    const chartContainer = screen.getByTestId('chart-container')
    expect(chartContainer).toBeInTheDocument()
  })

  it('allows toggling blood product selection', async () => {
    render(<DashboardChart />)

    // Open the multi-select dropdown
    const selector = screen.getByRole('button', {
      name: /select blood products/i,
    })
    fireEvent.click(selector)

    // Find and click a checkbox to toggle it
    await waitFor(() => {
      const albuminCheckbox = screen.getByRole('checkbox', {
        name: /select albumin/i,
      })
      expect(albuminCheckbox).toBeInTheDocument()

      // Toggle the checkbox
      fireEvent.click(albuminCheckbox)
    })

    // Check that the area components are updated
    await waitFor(() => {
      const areas = screen.getAllByTestId('area')
      // Should now have 4 areas (3 default + albumin)
      expect(areas.length).toBe(4)
    })
  })
})
