import type { Pagination } from './system-types'

export type BloodProduct = {
  id: string
  blood_product: string
  expiry_date: string
  quantity: number
  blood_type: string
  added_by: string
  blood_bank_name: string
}
export type BloodProductResponse = Pagination & {
  items: Array<BloodProduct>
}
