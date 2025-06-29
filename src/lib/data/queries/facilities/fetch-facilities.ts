import { queryOptions } from '@tanstack/react-query'
import type { getFacilitiesWithRequirementsArgs } from '@/lib/types/facilities.types'
import type { Facility } from '@/lib/types/system-types'
import facilitiesServices from '@/lib/services/facilities.service'

export const fetchBloodBanksQuery = (
  args: getFacilitiesWithRequirementsArgs = {},
) => {
  return queryOptions<Array<Facility>, getFacilitiesWithRequirementsArgs>({
    queryKey: ['facilities', ...Object.values(args)],
    queryFn: () => facilitiesServices.getFacilitiesWithRequirements(args),
    staleTime: 1000 * 60 * 60,
  })
}
