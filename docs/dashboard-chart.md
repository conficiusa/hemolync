# Dashboard Chart Component Documentation

## Overview

The Dashboard Chart component is a sophisticated blood product inventory visualization tool that displays multiple blood product levels simultaneously over time. It features multi-select functionality, date range filtering, and interactive controls for comprehensive data analysis.

**Current State**: Uses mock data for development and testing
**Target State**: Integrates with REST API endpoint for real inventory data with configurable date ranges (defaults to last 7 days)

## Features

### Multi-Product Display

- **Simultaneous Visualization**: Display multiple blood products as overlapping area curves
- **Color Differentiation**: Each blood product uses a unique color scheme for easy identification
- **Default Selection**: Automatically selects the first 3 blood products for optimal initial viewing

### Interactive Controls

- **Multi-Select Dropdown**: Checkbox-based selection for multiple blood products
- **Date Range Picker**: Calendar-based date selection with visual feedback
- **Clear Functionality**: One-click reset to default 7-day range
- **Responsive Design**: Adapts to different screen sizes

### Data Management

- **Real-time Filtering**: Data updates instantly based on selected filters
- **Date Range Validation**: Ensures data integrity and proper date handling
- **Performance Optimization**: Memoized calculations for smooth interactions

## Component Architecture

```typescript
interface DashboardChartProps {
  // Optional props for future extensibility
  className?: string
  height?: number
  customConfig?: ChartConfig
}
```

### Key Dependencies

- `recharts`: For chart rendering and interactions
- `date-fns`: For date calculations and formatting
- `@radix-ui`: For accessible UI components
- Custom UI components: Button, Card, Popover, etc.

## Usage Examples

### Basic Usage

```tsx
import DashboardChart from '@/components/dashboard-chart'

function Dashboard() {
  return (
    <div className="p-6">
      <DashboardChart />
    </div>
  )
}
```

### With Custom Configuration

```tsx
import DashboardChart from '@/components/dashboard-chart'

function CustomDashboard() {
  return <DashboardChart className="custom-chart-styling" height={400} />
}
```

## Blood Product Types

The chart supports the following blood product types:

| Product             | Key                   | Color Variable | Default Display |
| ------------------- | --------------------- | -------------- | --------------- |
| Whole Blood         | `whole_blood`         | `--chart-1`    | ✓               |
| Red Blood Cells     | `red_blood_cells`     | `--chart-2`    | ✓               |
| Platelets           | `platelets`           | `--chart-3`    | ✓               |
| Fresh Frozen Plasma | `fresh_frozen_plasma` | `--chart-4`    | ✗               |
| Cryoprecipitate     | `cryoprecipitate`     | `--chart-5`    | ✗               |
| Albumin             | `albumin`             | `--chart-6`    | ✗               |

## API Integration

### API Endpoint Specification

The dashboard chart requires a REST API endpoint to fetch blood product inventory data with date range filtering.

#### Endpoint Details

**URL**: `/api/dashboard/inventory-chart`  
**Method**: `GET`  
**Authentication**: Required (JWT Bearer token)

#### Query Parameters

| Parameter | Type              | Required | Default    | Description                               |
| --------- | ----------------- | -------- | ---------- | ----------------------------------------- |
| `from`    | string (ISO 8601) | No       | 7 days ago | Start date for data filtering (inclusive) |
| `to`      | string (ISO 8601) | No       | Today      | End date for data filtering (inclusive)   |

#### Example Requests

```bash
# Default 7-day range
GET /api/dashboard/inventory-chart

# Custom date range
GET /api/dashboard/inventory-chart?from=2024-01-01T00:00:00Z&to=2024-01-07T23:59:59Z

# Last 30 days
GET /api/dashboard/inventory-chart?from=2024-01-01T00:00:00Z&to=2024-01-30T23:59:59Z
```

### API Response Format

#### Success Response (200 OK)

```typescript
interface ApiResponse {
  success: boolean
  data: ChartDataPoint[]
  meta: {
    totalRecords: number
    dateRange: {
      from: string // ISO 8601 date string
      to: string // ISO 8601 date string
    }
    bloodProducts: string[] // Available blood product types
  }
}
```

#### Response Data Structure

```typescript
interface ChartDataPoint {
  date: string // ISO 8601 date string (e.g., "2024-01-15T10:30:00Z")
  formattedDate: string // Display-friendly format (e.g., "Jan 15")
  whole_blood: number // Inventory level
  red_blood_cells: number // Inventory level
  platelets: number // Inventory level
  fresh_frozen_plasma: number // Inventory level
  cryoprecipitate: number // Inventory level
  albumin: number // Inventory level
}
```

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-15T10:30:00Z",
      "formattedDate": "Jan 15",
      "whole_blood": 150,
      "red_blood_cells": 200,
      "platelets": 80,
      "fresh_frozen_plasma": 120,
      "cryoprecipitate": 45,
      "albumin": 90
    },
    {
      "date": "2024-01-16T10:30:00Z",
      "formattedDate": "Jan 16",
      "whole_blood": 145,
      "red_blood_cells": 195,
      "platelets": 85,
      "fresh_frozen_plasma": 115,
      "cryoprecipitate": 50,
      "albumin": 95
    }
  ],
  "meta": {
    "totalRecords": 8,
    "dateRange": {
      "from": "2024-01-08T00:00:00Z",
      "to": "2024-01-15T23:59:59Z"
    },
    "bloodProducts": [
      "whole_blood",
      "red_blood_cells",
      "platelets",
      "fresh_frozen_plasma",
      "cryoprecipitate",
      "albumin"
    ]
  }
}
```

#### Error Response (400/500)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "The 'from' date cannot be after the 'to' date",
    "details": {
      "from": "2024-01-15T00:00:00Z",
      "to": "2024-01-10T00:00:00Z"
    }
  }
}
```

### Chart Data Transformation

The component transforms API data into chart-compatible format:

```typescript
// API response data → Chart data
{
  date: "Jan 15",
  whole_blood: 150,
  red_blood_cells: 200,
  platelets: 80
  // ... other selected products
}
```

## Styling and Theming

### CSS Variables

The chart uses CSS custom properties for theming:

```css
:root {
  --chart-1: #e11d48; /* Whole Blood - Red */
  --chart-2: #dc2626; /* Red Blood Cells - Dark Red */
  --chart-3: #f97316; /* Platelets - Orange */
  --chart-4: #eab308; /* Fresh Frozen Plasma - Yellow */
  --chart-5: #22c55e; /* Cryoprecipitate - Green */
  --chart-6: #3b82f6; /* Albumin - Blue */
}
```

### Customization Options

- **Gradient Fills**: Each area uses a gradient from opaque to transparent
- **Stroke Weights**: 2px stroke width for clear differentiation
- **Opacity Levels**: 0.4 fill opacity for overlay visibility
- **Responsive Heights**: 300px default height with responsive scaling

## Accessibility Features

### Keyboard Navigation

- **Tab Navigation**: All interactive elements are keyboard accessible
- **Enter/Space**: Activates dropdowns and buttons
- **Escape**: Closes open popovers and dropdowns
- **Arrow Keys**: Navigate within dropdown options

### Screen Reader Support

- **ARIA Labels**: Comprehensive labeling for all interactive elements
- **Role Attributes**: Proper semantic roles for complex interactions
- **Live Regions**: Dynamic content updates announced to screen readers
- **Focus Management**: Logical focus flow throughout the component

### Visual Accessibility

- **High Contrast**: Colors meet WCAG contrast requirements
- **Focus Indicators**: Clear visual focus states
- **Touch Targets**: Minimum 44px touch target sizes
- **Reduced Motion**: Respects user's motion preferences

## Performance Considerations

### Optimization Strategies

- **Memoization**: `useMemo` for expensive calculations
- **Callback Optimization**: `useCallback` for event handlers
- **Component Memoization**: `memo` wrapper for the entire component
- **Selective Re-renders**: Efficient dependency arrays

### Memory Management

- **Data Filtering**: Only process visible date ranges
- **Gradient Cleanup**: Dynamic gradient generation and cleanup
- **Event Listener Management**: Proper cleanup of event listeners

## Integration Guidelines

### Implementation Pattern

Follow the existing service-query pattern used throughout the codebase:

#### 1. Create Dashboard Service (`src/lib/services/dashboard.service.ts`)

```typescript
import { protectedApi } from '@/lib/server/protected-api'
import type { ChartDataPoint } from '@/lib/types/dashboard.types'

interface FetchChartDataParams {
  from?: string // ISO 8601 date string
  to?: string // ISO 8601 date string
}

interface ChartApiResponse {
  success: boolean
  data: ChartDataPoint[]
  meta: {
    totalRecords: number
    dateRange: {
      from: string
      to: string
    }
    bloodProducts: string[]
  }
}

const dashboardService = {
  fetchChartData: async ({
    from,
    to,
  }: FetchChartDataParams = {}): Promise<ChartApiResponse> => {
    try {
      const params = new URLSearchParams()
      if (from) params.append('from', from)
      if (to) params.append('to', to)

      const queryString = params.toString()
      const url = `/dashboard/inventory-chart${queryString ? `?${queryString}` : ''}`

      const response = await protectedApi.get(url)
      return response.data
    } catch (error: any) {
      throw error.response?.data || error || 'Failed to fetch chart data'
    }
  },
}

export default dashboardService
```

#### 2. Create Query Function (`src/lib/data/queries/dashboard/fetch-chart-data.ts`)

```typescript
import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import type { ChartDataPoint } from '@/lib/types/dashboard.types'
import dashboardService from '@/lib/services/dashboard.service'

export interface FetchChartDataParams {
  from?: Date
  to?: Date
}

export const fetchChartDataQuery = ({ from, to }: FetchChartDataParams) => {
  // Convert Date objects to ISO strings for the API
  const fromIso = from?.toISOString()
  const toIso = to?.toISOString()

  return queryOptions<{
    data: ChartDataPoint[]
    meta: {
      totalRecords: number
      dateRange: { from: string; to: string }
      bloodProducts: string[]
    }
  }>({
    queryKey: ['dashboard', 'chart-data', fromIso, toIso],
    queryFn: () =>
      dashboardService.fetchChartData({ from: fromIso, to: toIso }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
  })
}
```

#### 3. Create Type Definitions (`src/lib/types/dashboard.types.ts`)

```typescript
export interface ChartDataPoint {
  date: string // ISO 8601 date string
  formattedDate: string // Display-friendly format
  whole_blood: number
  red_blood_cells: number
  platelets: number
  fresh_frozen_plasma: number
  cryoprecipitate: number
  albumin: number
}

export interface ChartApiResponse {
  success: boolean
  data: ChartDataPoint[]
  meta: {
    totalRecords: number
    dateRange: {
      from: string
      to: string
    }
    bloodProducts: string[]
  }
}

export interface DateRange {
  from: Date
  to: Date
}
```

#### 4. Update Dashboard Chart Component

```typescript
import { useQuery } from '@tanstack/react-query'
import { addDays } from 'date-fns'
import { fetchChartDataQuery } from '@/lib/data/queries/dashboard/fetch-chart-data'
import type { DateRange } from '@/lib/types/dashboard.types'

// ... existing imports ...

export const DashboardChart = memo(() => {
  // ... existing state ...

  const { data: chartResponse, isLoading, error } = useQuery(
    fetchChartDataQuery({
      from: dateRange.from,
      to: dateRange.to,
    })
  )

  const chartData = useMemo(() => {
    if (!chartResponse?.data) return []

    // Transform data based on selected products
    return chartResponse.data.map((point) => {
      const transformedPoint: any = {
        date: point.formattedDate,
      }

      selectedBloodProducts.forEach((productKey) => {
        transformedPoint[productKey] = point[productKey as keyof ChartDataPoint]
      })

      return transformedPoint
    })
  }, [chartResponse?.data, selectedBloodProducts])

  // Handle loading and error states
  if (isLoading) {
    return <ChartSkeleton />
  }

  if (error) {
    return <ChartError error={error} />
  }

  // ... rest of component ...
})
```

### State Management

```typescript
// Component manages its own state
const [selectedBloodProducts, setSelectedBloodProducts] = useState<string[]>()
const [dateRange, setDateRange] = useState<DateRange>()

// External state can be passed via props (future enhancement)
interface DashboardChartProps {
  initialSelection?: string[]
  initialDateRange?: DateRange
  onSelectionChange?: (products: string[]) => void
  onDateRangeChange?: (range: DateRange) => void
}
```

### Error Handling

```typescript
// Graceful fallbacks
const defaultProducts = bloodProducts.slice(0, 3).map((p) => p.value)
const defaultDateRange = {
  from: addDays(new Date(), -7),
  to: new Date(),
}

// Data validation
const validatedData = chartData.filter(
  (point) => point.date && typeof point.date === 'string',
)

// API error handling
const { data, error, isLoading } = useQuery(fetchChartDataQuery(params))

if (error) {
  // Handle API errors gracefully
  console.error('Failed to fetch chart data:', error)
  // Show error message to user or fallback to cached data
}
```

## Testing Strategy

### Unit Tests

- **Component Rendering**: Verify chart elements render correctly
- **User Interactions**: Test dropdown selections and date changes
- **Data Processing**: Validate data transformation logic
- **Edge Cases**: Handle empty data sets and invalid dates

### Integration Tests

- **API Integration**: Test with real data sources
- **State Management**: Verify state updates and persistence
- **Performance**: Measure rendering performance with large datasets
- **Cross-browser**: Ensure compatibility across target browsers

### Visual Testing

- **Screenshot Comparison**: Automated visual regression testing
- **Responsive Testing**: Verify appearance across screen sizes
- **Color Accessibility**: Validate color contrast and colorblind-friendly palettes
- **Animation Testing**: Ensure smooth transitions and interactions

## Backend Implementation Considerations

### Database Schema

The backend should aggregate blood product inventory data from your existing blood inventory tables. Consider creating a view or materialized view for efficient querying:

```sql
-- Example view for chart data aggregation
CREATE VIEW dashboard_inventory_chart AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(CASE WHEN blood_type = 'whole_blood' THEN 1 END) as whole_blood,
  COUNT(CASE WHEN blood_type = 'red_blood_cells' THEN 1 END) as red_blood_cells,
  COUNT(CASE WHEN blood_type = 'platelets' THEN 1 END) as platelets,
  COUNT(CASE WHEN blood_type = 'fresh_frozen_plasma' THEN 1 END) as fresh_frozen_plasma,
  COUNT(CASE WHEN blood_type = 'cryoprecipitate' THEN 1 END) as cryoprecipitate,
  COUNT(CASE WHEN blood_type = 'albumin' THEN 1 END) as albumin
FROM blood_inventory
WHERE status = 'available'
  AND created_at >= $1  -- from date
  AND created_at <= $2  -- to date
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date;
```

### Performance Optimization

1. **Indexing**: Create composite indexes on `(created_at, blood_type, status)`
2. **Caching**: Cache results for common date ranges (last 7 days, 30 days)
3. **Pagination**: For large datasets, consider pagination with date-based cursors
4. **Materialized Views**: Pre-compute aggregations for faster queries

### Data Validation

```typescript
// Backend validation middleware
const validateDateRange = (req: Request, res: Response, next: NextFunction) => {
  const { from, to } = req.query

  if (from && to) {
    const fromDate = new Date(from as string)
    const toDate = new Date(to as string)

    if (fromDate > toDate) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATE_RANGE',
          message: 'The from date cannot be after the to date',
        },
      })
    }

    // Prevent queries for too large date ranges
    const daysDiff =
      (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysDiff > 365) {
      // Max 1 year
      return res.status(400).json({
        success: false,
        error: {
          code: 'DATE_RANGE_TOO_LARGE',
          message: 'Date range cannot exceed 365 days',
        },
      })
    }
  }

  next()
}
```

## Future Enhancements

### Frontend Features

1. **Export Functionality**: PDF/PNG export capabilities
2. **Data Annotations**: Add markers for significant events
3. **Zoom Controls**: Interactive zoom and pan functionality
4. **Real-time Updates**: WebSocket integration for live data
5. **Custom Time Ranges**: Quarterly, yearly, and custom period options

### Backend Enhancements

1. **Advanced Filtering**: Filter by facility, blood type variants, or donor characteristics
2. **Real-time Aggregation**: WebSocket support for live inventory updates
3. **Data Export**: CSV/Excel export of raw chart data
4. **Analytics**: Trend analysis and forecasting capabilities
5. **Alerting**: Automated alerts for inventory thresholds

### API Integration Points

1. **Data Source Configuration**: Configurable API endpoints
2. **Caching Strategy**: Redis/memory caching for performance
3. **Error Recovery**: Retry mechanisms and fallback data
4. **Authentication**: JWT token integration for secure access
5. **Rate Limiting**: Prevent abuse of chart data endpoints

### Extensibility

```typescript
// Plugin system for custom blood products
interface BloodProductPlugin {
  key: string
  label: string
  color: string
  validator: (value: number) => boolean
  formatter: (value: number) => string
}

// Custom chart types
interface ChartTypePlugin {
  type: 'line' | 'bar' | 'scatter' | 'custom'
  component: React.ComponentType<ChartProps>
  config: ChartConfig
}
```

## Troubleshooting

### Common Issues

1. **Chart Not Rendering**

   - Verify data format matches `ChartDataPoint` interface
   - Check CSS variables are properly defined
   - Ensure recharts dependencies are installed

2. **Date Range Issues**

   - Validate date objects are properly formatted
   - Check timezone handling for consistent behavior
   - Verify date-fns version compatibility

3. **Performance Problems**

   - Reduce date range for large datasets
   - Limit number of selected blood products
   - Check for memory leaks in event handlers

4. **Styling Problems**
   - Verify CSS custom properties are inherited
   - Check for conflicting styles from parent components
   - Ensure proper CSS cascade order

#### API Integration Issues

1. **API Connection Failed**

   - Verify API endpoint URL is correct (`/api/dashboard/inventory-chart`)
   - Check JWT authentication token is valid
   - Confirm protectedApi is properly configured
   - Test API endpoint directly with tools like Postman

2. **No Data Returned**

   - Check date range parameters are in ISO 8601 format
   - Verify database has data for the requested date range
   - Confirm blood product types match expected values
   - Check for database connection issues

3. **Slow API Response**

   - Ensure proper database indexes exist
   - Check if query result caching is enabled
   - Verify date range isn't too large (max 365 days)
   - Consider implementing pagination for large datasets

4. **Data Format Mismatch**

   - Validate API response matches `ChartApiResponse` interface
   - Check that all blood product fields are present
   - Verify date fields are in ISO 8601 format
   - Ensure numeric values are properly typed

### Debug Mode

Enable debug logging by setting environment variable:

```bash
DEBUG_CHART=true npm run dev
```

This documentation provides comprehensive guidance for developers working with the Dashboard Chart component, ensuring consistent implementation and maintenance practices.
