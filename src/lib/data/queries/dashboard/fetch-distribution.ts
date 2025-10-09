import { queryOptions } from '@tanstack/react-query'
import type {
  DashboardDistributionResponse,
  FetchDashboardDistributionArgs,
} from '@/lib/services/analytics.service'
import {
  AnalyticsService,
  defaultBloodProducts,
  defaultBloodTypes,
  defaultDateRange,
} from '@/lib/services/analytics.service'

export const fetchBloodDistribution = (
  args?: FetchDashboardDistributionArgs,
) => {
  if (!args) {
    args = {
      from_date: defaultDateRange.startDate,
      to_date: defaultDateRange.endDate,
      blood_products: defaultBloodProducts,
      blood_types: defaultBloodTypes,
    }
  }

  const { from_date, to_date, blood_products, blood_types } = args
  const analyticsService = new AnalyticsService()
  return queryOptions<DashboardDistributionResponse>({
    queryKey: [
      'dashboard',
      'distribution',
      from_date,
      to_date,
      blood_products,
      blood_types,
    ],
    queryFn: () => analyticsService.fetchDashboardDistribution(args),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
