import type { Pagination } from './system-types'

export type bloodType = 'A+' | 'A-' | 'B' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-'

export type BloodProductType =
  | 'Whole Blood'
  | 'Red Blood Cells'
  | 'Plasma'
  | 'Platelets'
  | 'Cryoprecipitate'

export type BloodProduct = {
  id: string
  blood_product: BloodProductType
  expiry_date: string
  quantity: number
  blood_type: bloodType
  added_by: string
  blood_bank_name: string
}

export type ProductSortBy =
  | 'created_at'
  | 'updated_at'
  | 'expiry_date'
  | 'blood_type'
  | 'blood_product'
  | 'quantity'
export type ProductSortOrder = 'asc' | 'desc'

export type FetchArgs = {
  page?: number
  page_size?: number
  sort_by?: ProductSortBy
  sort_order?: ProductSortOrder
}

export type BloodProductResponse = Pagination & {
  items: Array<BloodProduct>
}
