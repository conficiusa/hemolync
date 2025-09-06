import { addDays, endOfDay, format, isWithinInterval, startOfDay } from 'date-fns'

export interface ChartDataPoint {
  date: string
  formattedDate: string
  whole_blood: number
  red_blood_cells: number
  platelets: number
  fresh_frozen_plasma: number
  cryoprecipitate: number
  albumin: number
}

/**
 * Generates mock chart data for blood product inventory levels over time
 * @param startDate - The start date for data generation
 * @param endDate - The end date for data generation
 * @returns Array of chart data points
 */
export const generateMockChartData = (
  startDate: Date = new Date(2024, 0, 1), // Default to Jan 1, 2024
  endDate: Date = new Date(), // Default to today
): Array<ChartDataPoint> => {
  const data: Array<ChartDataPoint> = []
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  
  // Base inventory levels for each blood product
  const baseInventory = {
    whole_blood: 150,
    red_blood_cells: 200,
    platelets: 80,
    fresh_frozen_plasma: 120,
    cryoprecipitate: 45,
    albumin: 90,
  }

  for (let i = 0; i <= totalDays; i++) {
    const currentDate = addDays(startDate, i)
    
    // Create realistic fluctuations with some patterns
    // Weekend dip (less donations), Monday-Wednesday peak
    const dayOfWeek = currentDate.getDay()
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.0
    const midWeekBoost = dayOfWeek >= 1 && dayOfWeek <= 3 ? 1.2 : 1.0
    
    // Seasonal variation (lower in holidays/summer)
    const month = currentDate.getMonth()
    const seasonalMultiplier = month === 11 || month === 0 || month === 6 || month === 7 ? 0.8 : 1.0
    
    // Random daily variation
    const randomVariation = 0.8 + Math.random() * 0.4 // 80% to 120%
    
    const totalMultiplier = weekendMultiplier * midWeekBoost * seasonalMultiplier * randomVariation

    data.push({
      date: currentDate.toISOString(),
      formattedDate: format(currentDate, 'MMM dd'),
      whole_blood: Math.round(baseInventory.whole_blood * totalMultiplier + (Math.random() - 0.5) * 30),
      red_blood_cells: Math.round(baseInventory.red_blood_cells * totalMultiplier + (Math.random() - 0.5) * 40),
      platelets: Math.round(baseInventory.platelets * totalMultiplier + (Math.random() - 0.5) * 20),
      fresh_frozen_plasma: Math.round(baseInventory.fresh_frozen_plasma * totalMultiplier + (Math.random() - 0.5) * 25),
      cryoprecipitate: Math.round(baseInventory.cryoprecipitate * totalMultiplier + (Math.random() - 0.5) * 15),
      albumin: Math.round(baseInventory.albumin * totalMultiplier + (Math.random() - 0.5) * 20),
    })
  }

  return data
}

/**
 * Filters chart data to only include dates within the specified range
 * @param data - The full chart data array
 * @param startDate - Filter start date (inclusive)
 * @param endDate - Filter end date (inclusive)
 * @returns Filtered chart data array
 */
export const filterChartDataByDateRange = (
  data: Array<ChartDataPoint>,
  startDate?: Date,
  endDate?: Date,
): Array<ChartDataPoint> => {
  if (!startDate && !endDate) {
    return data
  }

  return data.filter((point) => {
    const pointDate = new Date(point.date)
    
    if (startDate && endDate) {
      return isWithinInterval(pointDate, {
        start: startOfDay(startDate),
        end: endOfDay(endDate),
      })
    }
    
    if (startDate) {
      return pointDate >= startOfDay(startDate)
    }
    
    if (endDate) {
      return pointDate <= endOfDay(endDate)
    }
    
    return true
  })
}

/**
 * Gets the chart configuration for blood products
 */
export const getBloodProductChartConfig = () => ({
  whole_blood: {
    label: 'Whole Blood',
    color: 'hsl(var(--chart-1))',
  },
  red_blood_cells: {
    label: 'Red Blood Cells',
    color: 'hsl(var(--chart-2))',
  },
  platelets: {
    label: 'Platelets',
    color: 'hsl(var(--chart-3))',
  },
  fresh_frozen_plasma: {
    label: 'Fresh Frozen Plasma',
    color: 'hsl(var(--chart-4))',
  },
  cryoprecipitate: {
    label: 'Cryoprecipitate',
    color: 'hsl(var(--chart-5))',
  },
  albumin: {
    label: 'Albumin',
    color: 'hsl(var(--chart-6))',
  },
})

// Generate a default dataset for the past 6 months
export const mockChartData = generateMockChartData(
  addDays(new Date(), -180), // 6 months ago
  new Date(), // today
)