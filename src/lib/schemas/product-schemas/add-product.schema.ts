import { z } from 'zod'

export const addBloodSchema = z.object({
  // batch_number: z.string().min(1, 'Batch number is required'),
  blood_type: z.string().min(1, 'Blood group is required'),
  blood_product: z.string().min(1, 'Please specify type of blood product'),
  expiry_date: z.string().min(1, 'expiration date of blood is required'),
  added_by: z.string().min(1, 'Who is adding this blood'),
  quantity: z.number().gt(0, 'Quantity must be greater than 0'),
})
