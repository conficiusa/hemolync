import { z } from 'zod'

export const newRequestSchema = z.object({
  blood_type: z.string().min(1, 'Blood group is required'),
  blood_product: z.string().min(1, 'Please specify the blood product'),
  quantity: z.number().gt(0, 'Quantity must be greater than 0'),
  priority: z.string().min(1, 'Please select a priority'),
  notes: z.string().optional(),
  dispatched_to_id: z
    .string()
    .min(1, 'Please select a facility to place the request'),
})
