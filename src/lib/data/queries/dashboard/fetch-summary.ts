import { queryOptions } from '@tanstack/react-query'
import type { SummaryResponse } from '@/lib/services/analytics.service'
import { AnalyticsService } from '@/lib/services/analytics.service'

export const fetchDashboardSummary = () => {
  const analyticsService = new AnalyticsService()
  return queryOptions<SummaryResponse>({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => analyticsService.fetchDashboardSummary(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
