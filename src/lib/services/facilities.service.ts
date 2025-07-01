import type { getFacilitiesWithRequirementsArgs } from '@/lib/types/facilities.types'
import { protectedApi } from '@/lib/server/protected-api'

const facilitiesServices = {
  getFacilitiesWithRequirements: async ({
    blood_type,
    blood_product,
  }: getFacilitiesWithRequirementsArgs) => {
    const query = new URLSearchParams()
    if (blood_product) {
      query.set('blood_product', blood_product as unknown as string)
    }
    if (blood_type) {
      query.set('blood_type', blood_type as unknown as string)
    }
    const response = await protectedApi.get(
      `/blood-inventory/facilities/search-stock?${query.toString()}`,
    )

    return response.data
  },
}

export default facilitiesServices
