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
import SelectDropdown from '@/components/selectDropdown'
import { DateRangePicker } from '@/components/date-range-picker'
import { bloodProducts } from '@/lib/constants/blood-products'
import {
  filterChartDataByDateRange,
  getBloodProductChartConfig,
  mockChartData,
} from '@/lib/data/mock-chart-data'

const chartConfig = getBloodProductChartConfig() satisfies ChartConfig

export const DashboardChart = memo(() => {
  const [selectedBloodProduct, setSelectedBloodProduct] = useState<string | null>(
    bloodProducts[0]?.value || null,
  )
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30), // Default to last 30 days
    to: new Date(),
  })

  // Filter and transform data based on selected date range and blood product
  const chartData = useMemo(() => {
    const filteredData = filterChartDataByDateRange(
      mockChartData,
      dateRange.from,
      dateRange.to,
    )

    // Transform data to match chart requirements
    return filteredData.map((point: ChartDataPoint) => ({
      date: point.formattedDate,
      value: selectedBloodProduct 
        ? point[selectedBloodProduct as keyof Omit<ChartDataPoint, 'date' | 'formattedDate'>]
        : point.red_blood_cells, // Default to red blood cells
    }))
  }, [dateRange.from, dateRange.to, selectedBloodProduct])

  // Get the current blood product config for styling
  const currentProductConfig = useMemo(() => {
    if (!selectedBloodProduct) {
      return chartConfig.red_blood_cells
    }
    const productKey = selectedBloodProduct as keyof typeof chartConfig
    return chartConfig[productKey]
  }, [selectedBloodProduct])

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
        <div className="min-w-0 flex-1">
          <SelectDropdown
            selected={selectedBloodProduct}
            setSelected={setSelectedBloodProduct}
            items={bloodProducts}
            fieldClassName="text-foreground py-2 px-6 justify-between flex border-none text-sm"
          />
        </div>
        <div className="ml-4">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
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
              formatter={(value) => [
                value,
                currentProductConfig.label,
              ]}
            />
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={currentProductConfig.color}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={currentProductConfig.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillValue)"
              fillOpacity={0.4}
              stroke={currentProductConfig.color}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
})

DashboardChart.displayName = 'DashboardChart'
export default DashboardChart
