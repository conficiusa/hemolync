# Dashboard Chart Component Documentation

## Overview

The Dashboard Chart component is a sophisticated blood product inventory visualization tool that displays multiple blood product levels simultaneously over time. It features multi-select functionality, date range filtering, and interactive controls for comprehensive data analysis.

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
  return (
    <DashboardChart 
      className="custom-chart-styling"
      height={400}
    />
  )
}
```

## Blood Product Types

The chart supports the following blood product types:

| Product | Key | Color Variable | Default Display |
|---------|-----|----------------|-----------------|
| Whole Blood | `whole_blood` | `--chart-1` | ✓ |
| Red Blood Cells | `red_blood_cells` | `--chart-2` | ✓ |
| Platelets | `platelets` | `--chart-3` | ✓ |
| Fresh Frozen Plasma | `fresh_frozen_plasma` | `--chart-4` | ✗ |
| Cryoprecipitate | `cryoprecipitate` | `--chart-5` | ✗ |
| Albumin | `albumin` | `--chart-6` | ✗ |

## Data Structure

### Input Data Format
```typescript
interface ChartDataPoint {
  date: string              // ISO date string
  formattedDate: string     // Display-friendly date format
  whole_blood: number       // Inventory level
  red_blood_cells: number   // Inventory level
  platelets: number         // Inventory level
  fresh_frozen_plasma: number // Inventory level
  cryoprecipitate: number   // Inventory level
  albumin: number           // Inventory level
}
```

### Chart Data Transformation
The component transforms raw data into chart-compatible format:

```typescript
// Raw data → Chart data
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
  --chart-1: #e11d48;  /* Whole Blood - Red */
  --chart-2: #dc2626;  /* Red Blood Cells - Dark Red */
  --chart-3: #f97316;  /* Platelets - Orange */
  --chart-4: #eab308;  /* Fresh Frozen Plasma - Yellow */
  --chart-5: #22c55e;  /* Cryoprecipitate - Green */
  --chart-6: #3b82f6;  /* Albumin - Blue */
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
const defaultProducts = bloodProducts.slice(0, 3).map(p => p.value)
const defaultDateRange = {
  from: addDays(new Date(), -7),
  to: new Date()
}

// Data validation
const validatedData = chartData.filter(point => 
  point.date && typeof point.date === 'string'
)
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

## Future Enhancements

### Planned Features
1. **Export Functionality**: PDF/PNG export capabilities
2. **Data Annotations**: Add markers for significant events
3. **Zoom Controls**: Interactive zoom and pan functionality
4. **Real-time Updates**: WebSocket integration for live data
5. **Custom Time Ranges**: Quarterly, yearly, and custom period options

### API Integration Points
1. **Data Source Configuration**: Configurable API endpoints
2. **Caching Strategy**: Redis/memory caching for performance
3. **Error Recovery**: Retry mechanisms and fallback data
4. **Authentication**: JWT token integration for secure access

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

### Debug Mode
Enable debug logging by setting environment variable:
```bash
DEBUG_CHART=true npm run dev
```

This documentation provides comprehensive guidance for developers working with the Dashboard Chart component, ensuring consistent implementation and maintenance practices.