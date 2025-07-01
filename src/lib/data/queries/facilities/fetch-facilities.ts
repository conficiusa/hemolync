import { queryOptions } from '@tanstack/react-query'
import type {
  PlacingRequestFacilityResponse,
  getFacilitiesWithRequirementsArgs,
} from '@/lib/types/facilities.types'
import facilitiesServices from '@/lib/services/facilities.service'

export const fetchBloodBanksQuery = (
  args: getFacilitiesWithRequirementsArgs = {},
) => {
  return queryOptions<
    PlacingRequestFacilityResponse,
    getFacilitiesWithRequirementsArgs
  >({
    queryKey: ['facilities', ...Object.values(args)],
    queryFn: () => facilitiesServices.getFacilitiesWithRequirements(args),
    staleTime: 1000 * 60 * 60,
    enabled: !!args.blood_product && !!args.blood_type,
  })
}
