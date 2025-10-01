import type { BloodProductType } from '../types/product.types'

export const bloodProducts: Array<{
  label: BloodProductType
  value: BloodProductType
}> = [
  { label: 'Whole Blood', value: 'Whole Blood' },
  { label: 'Red Blood Cells', value: 'Red Blood Cells' },
  { label: 'Platelets', value: 'Platelets' },
  { label: 'Plasma', value: 'Plasma' },
  { label: 'Cryoprecipitate', value: 'Cryoprecipitate' },
  // { label: 'Albumin', value: 'Albumin' },
]

export const bloodTypes = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
]
