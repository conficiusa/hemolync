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
      startDate: defaultDateRange.startDate,
      endDate: defaultDateRange.endDate,
      products: defaultBloodProducts,
      bloodType: defaultBloodTypes,
    }
  }

  const { startDate, endDate, products, bloodType } = args
  const analyticsService = new AnalyticsService()
  return queryOptions<DashboardDistributionResponse>({
    queryKey: [
      'dashboard',
      'distribution',
      startDate,
      endDate,
      products,
      bloodType,
    ],
    queryFn: () => analyticsService.fetchDashboardDistribution(args),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
