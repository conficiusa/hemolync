import { memo, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { addDays } from 'date-fns'
import type { ChartConfig } from '@/components/ui/chart'
import type { DateRange } from '@/components/date-range-picker'
import type { ChartDataPoint } from '@/lib/data/mock-chart-data'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MultiSelectDropdown } from '@/components/multi-select-dropdown'
import { DateRangePicker } from '@/components/date-range-picker'
import { bloodProducts } from '@/lib/constants/blood-products'
import {
  filterChartDataByDateRange,
  getBloodProductChartConfig,
  mockChartData,
} from '@/lib/data/mock-chart-data'

const chartConfig = getBloodProductChartConfig() satisfies ChartConfig

/**
 * Dashboard chart component that displays blood product inventory levels over time
 * Supports multiple blood products displayed simultaneously as area curves
 * Includes date range filtering and multi-product selection
 */
export const DashboardChart = memo(() => {
  // Default to first 3 blood products for better initial visualization
  const defaultSelectedProducts = bloodProducts
    .slice(0, 3)
    .map((product) => product.value)

  const [selectedBloodProducts, setSelectedBloodProducts] = useState<Array<string>>(
    defaultSelectedProducts,
  )
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -7), // Default to last 7 days
    to: new Date(),
  })

  // Handle clearing date range - reset to last 7 days
  const handleClearDateRange = () => {
    setDateRange({
      from: addDays(new Date(), -7),
      to: new Date(),
    })
  }

  // Filter and transform data based on selected date range and blood products
  const chartData = useMemo(() => {
    const filteredData = filterChartDataByDateRange(
      mockChartData,
      dateRange.from,
      dateRange.to,
    )

    // Transform data to include all selected blood products
    return filteredData.map((point: ChartDataPoint) => {
      const transformedPoint: any = {
        date: point.formattedDate,
      }

      // Add data for each selected blood product
      selectedBloodProducts.forEach((productKey) => {
        const key = productKey as keyof Omit<
          ChartDataPoint,
          'date' | 'formattedDate'
        >
        transformedPoint[productKey] = point[key]
      })

      return transformedPoint
    })
  }, [dateRange.from, dateRange.to, selectedBloodProducts])

  // Get unique gradients for each selected product
  const gradientDefs = useMemo(() => {
    return selectedBloodProducts.map((productKey) => {
      const productConfig = chartConfig[productKey as keyof typeof chartConfig]
       
      return (
        <linearGradient
          key={productKey}
          id={`fill${productKey}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="5%" stopColor={productConfig.color} stopOpacity={0.3} />
          <stop
            offset="95%"
            stopColor={productConfig.color}
            stopOpacity={0.1}
          />
        </linearGradient>
      )
    })
  }, [selectedBloodProducts])

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
        <div className="min-w-0 flex-1">
          <MultiSelectDropdown
            options={bloodProducts}
            selectedValues={selectedBloodProducts}
            onSelectionChange={setSelectedBloodProducts}
            placeholder="Select blood products"
            className="text-foreground py-2 px-6 justify-between flex border-none text-sm"
          />
        </div>
        <div className="ml-4">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onClear={handleClearDateRange}
            placeholder="Select date range"
            className="w-auto"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toString()}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <defs>{gradientDefs}</defs>
            {/* Render multiple Area components for each selected blood product */}
            {selectedBloodProducts.map((productKey) => {
              const productConfig =
                chartConfig[productKey as keyof typeof chartConfig]
              return (
                <Area
                  key={productKey}
                  dataKey={productKey}
                  type="natural"
                  fill={`url(#fill${productKey})`}
                  fillOpacity={0.4}
                  stroke={productConfig.color}
                  strokeWidth={2}
                  name={productConfig.label}
                />
              )
            })}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
})

DashboardChart.displayName = 'DashboardChart'
export default DashboardChart
