import type { Pagination } from '@/lib/types/system-types'
import type { BloodProductType, BloodType } from '@/lib/types/product.types'

export type getFacilitiesWithRequirementsArgs = {
  blood_type?: BloodType
  blood_product?: BloodProductType
}

export type PlacingRequestFacility = {
  facility_id: string
  facility_name: string
}

export type PlacingRequestFacilityResponse = {
  items: Array<PlacingRequestFacility>
  pagination: Pagination
}
