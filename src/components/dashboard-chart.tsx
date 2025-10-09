import { useSuspenseQuery } from '@tanstack/react-query'
import { memo, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import type { ChartConfig } from '@/components/ui/chart'
import type { BloodProductType } from '@/lib/types/product.types'
import type { DateRange } from '@/components/date-range-picker'
import type { ChartDataPoint } from '@/lib/services/analytics.service'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MultiSelectDropdown } from '@/components/multi-select-dropdown'
import { DateRangePicker } from '@/components/date-range-picker'
import { bloodProducts } from '@/lib/constants/blood-products'
import {
  defaultBloodProducts,
  defaultBloodTypes,
  defaultDateRange,
} from '@/lib/services/analytics.service'
import { fetchBloodDistribution } from '@/lib/data/queries/dashboard/fetch-distribution'

// Chart configuration mapping display names to colors
const chartConfig = {
  'Whole Blood': {
    label: 'Whole Blood',
    color: 'var(--chart-1)',
  },
  'Red Blood Cells': {
    label: 'Red Blood Cells',
    color: 'var(--chart-2)',
  },
  Plasma: {
    label: 'Plasma',
    color: 'var(--chart-4)',
  },
  Platelets: {
    label: 'Platelets',
    color: 'var(--chart-3)',
  },
  Cryoprecipitate: {
    label: 'Cryoprecipitate',
    color: 'var(--chart-5)',
  },
  Albumin: {
    label: 'Albumin',
    color: 'var(--chart-6)',
  },
} satisfies ChartConfig

/**
 * Dashboard chart component that displays blood product inventory levels over time
 * Supports multiple blood products displayed simultaneously as area curves
 * Includes date range filtering and multi-product selection
 */
export const DashboardChart = memo(() => {
  const [selectedBloodProducts, setSelectedBloodProducts] =
    useState<Array<BloodProductType>>(defaultBloodProducts)

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(defaultDateRange.startDate),
    to: new Date(defaultDateRange.endDate),
  })

  // Fetch initial data to populate chart (could be used for further enhancements)
  const {
    data: { data },
  } = useSuspenseQuery(
    fetchBloodDistribution({
      blood_products: selectedBloodProducts,
      blood_types: defaultBloodTypes,
      to_date: dateRange.to?.toISOString(),
      from_date: dateRange.from?.toISOString(),
    }),
  )

  // Handle clearing date range - reset to last 7 days
  const handleClearDateRange = () => {
    setDateRange({
      from: new Date(defaultDateRange.startDate),
      to: new Date(defaultDateRange.endDate),
    })
  }

  // // Filter and transform data based on selected date range and blood products
  const chartData = useMemo(() => {
    const filteredData = data.filter((point: ChartDataPoint) => {
      return selectedBloodProducts.some((dataKey) => {
        const key = dataKey as keyof Omit<
          ChartDataPoint,
          'date' | 'formattedDate'
        >
        return point[key] !== null
      })
    })
    // Transform data to include all selected blood products
    return filteredData.map((point: ChartDataPoint) => {
      const transformedPoint: any = {
        date: point.formattedDate,
      }

      // Add data for each selected blood product using display names as keys
      selectedBloodProducts.forEach((dataKey) => {
        const key = dataKey as keyof Omit<
          ChartDataPoint,
          'date' | 'formattedDate'
        >
        transformedPoint[dataKey] = point[key]
      })

      return transformedPoint
    })
  }, [dateRange.from, dateRange.to, selectedBloodProducts])

  // Get unique gradients for each selected product
  const gradientDefs = useMemo(() => {
    return selectedBloodProducts.map((dataKey) => {
      const productConfig = chartConfig[dataKey as keyof typeof chartConfig]

      return (
        <linearGradient
          key={dataKey}
          id={`fill${dataKey.replace(/\s+/g, '')}`}
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
        <div className="flex-1">
          <MultiSelectDropdown
            options={bloodProducts}
            selectedValues={selectedBloodProducts}
            onSelectionChange={setSelectedBloodProducts}
            className="text-foreground py-2 px-6 justify-between flex border-none text-sm"
          />
        </div>
        <div>
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
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              labelFormatter={(label) => `Date: ${label}`}
              animationEasing="linear"
            />
            <defs>{gradientDefs}</defs>
            {/* Render multiple Area components for each selected blood product */}
            {selectedBloodProducts.map((dataKey) => {
              const productConfig =
                chartConfig[dataKey as keyof typeof chartConfig]
              return (
                <Area
                  key={dataKey}
                  dataKey={dataKey}
                  type="natural"
                  fill={`url(#fill${dataKey.replace(/\s+/g, '')})`}
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
