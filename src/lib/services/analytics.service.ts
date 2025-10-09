import { addDays } from 'date-fns'
import type { BloodProductType, BloodType } from '@/lib/types/product.types'
import { protectedApi } from '@/lib/server/protected-api'

export type FetchDashboardDistributionArgs = {
  from_date?: string
  to_date?: string
  blood_products?: Array<BloodProductType>
  blood_types?: Array<BloodType>
}
export type ChartDataPoint = {
  date: string
  formattedDate: string
  whole_blood: number | null
  red_blood_cells: number | null
  platelets: number | null
  fresh_frozen_plasma: number | null
  cryoprecipitate: number | null
  albumin: number | null
}

type Metric = {
  value: number
  change: number
  direction: 'up' | 'down' | 'neutral'
}
export type SummaryResponse = {
  stock: Metric
  transferred: Metric
  requests: Metric
}
export type DashboardDistributionResponse = {
  success: boolean
  data: Array<ChartDataPoint>
}

export const defaultBloodProducts: Array<BloodProductType> = [
  'Whole Blood',
  'Plasma',
  'Platelets',
]
export const defaultBloodTypes: Array<BloodType> = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
]
export const defaultDateRange = {
  startDate: addDays(new Date(), -7).toISOString(),
  endDate: new Date().toISOString(),
}

/**
 * Analytics Service
 *
 * This service is responsible for making requests to the analytics API endpoints.
 * It provides methods to fetch
 * these methods will be called by the tansack query hooks.
 *
 * @module AnalyticsService
 * @category Services
 * @subcategory Analytics
 * @example
 * import analyticsService from '@/lib/services/analytics.service'
 * const { fetchAnalyticsData } = analyticsService
 *
 * @returns {Object} An object containing methods to interact with the analytics API.
 */
export class AnalyticsService {
  /**
   * Fetch Dashboard Summary
   * This method fetches a summary of key metrics for the dashboard.
   * @returns A promise that resolves to an object containing the total units of blood in stock, total units distributed, and total units received.
   */

  async fetchDashboardSummary() {
    const response = await protectedApi.get('/dashboard/summary')
    return response.data as SummaryResponse
  }
  /**
   * Fetch Dashboard Distribution
   * This method fetches the quantity of blood products distributed within a specified date range,
   * filtered by blood product types and blood types.
   * @param {FetchDashboardDistributionArgs} args - The arguments for fetching the dashboard distribution.
   * @param {string} args.startDate - The start date for the distribution (YYYY-MM-DD).
   * @param {string} args.endDate - The end date for the distribution (YYYY-MM-DD).
   * @param {Array<BloodProductType>} args.products - The list of blood products to include in the distribution.
   * @param {Array<BloodType>} args.bloodType - The list of blood types to include in the distribution.
   */
  async fetchDashboardDistribution(args?: FetchDashboardDistributionArgs) {
    if (!args) {
      args = {
        from_date: defaultDateRange.startDate,
        to_date: defaultDateRange.endDate,
        blood_products: defaultBloodProducts,
        blood_types: defaultBloodTypes,
      }
    }
    // Extract parameters from arguments
    const { from_date, to_date, blood_products, blood_types } = args

    // Use defaults if no products or blood types specified
    const finalProducts =
      !blood_products || blood_products.length === 0
        ? defaultBloodProducts
        : blood_products
    const finalBloodTypes =
      !blood_types || blood_types.length === 0 ? defaultBloodTypes : blood_types

    // Build query parameters
    const queryParams = new URLSearchParams()
    queryParams.append('from_date', from_date ?? defaultDateRange.startDate)
    queryParams.append('to_date', to_date ?? defaultDateRange.endDate)

    finalProducts.forEach((product) =>
      queryParams.append('blood_products', product),
    )
    finalBloodTypes.forEach((type) => queryParams.append('blood_types', type))

    // Make API request
    const response = await protectedApi.get('/dashboard/distribution-chart', {
      params: queryParams,
    })

    return response.data as DashboardDistributionResponse
  }
}
