import { z } from 'zod'

export const addBloodSchema = z.object({
  batch_number: z.string().min(1, 'Batch number is required'),
  type: z.string().min(1, 'Blood group is required'),
  blood_product: z.string().min(1, 'Please specify type of blood product'),
  expiration_date: z.string().min(1, 'expiration date of blood is required'),
  collection_date: z
    .string()
    .min(1, 'Please specify when this blood was collected'),
  added_by: z.string().min(1, 'Who is adding this blood'),
})
