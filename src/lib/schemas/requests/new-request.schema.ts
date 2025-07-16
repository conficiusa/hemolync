import { z } from 'zod'

const bloodProductSchema = z.union([
  z.literal('Whole Blood'),
  z.literal('Red Blood Cells'),
  z.literal('Plasma'),
  z.literal('Platelets'),
  z.literal('Cryoprecipitate'),
  z.literal('Fresh Frozen Plasma'),
  z.literal(''),
])
const bloodTypeSchema = z.union([
  z.literal('A+'),
  z.literal('A-'),
  z.literal('B+'),
  z.literal('B-'),
  z.literal('AB+'),
  z.literal('AB-'),
  z.literal('O+'),
  z.literal('O-'),
  z.literal(''),
])

export const newRequestSchema = z
  .object({
    blood_type: bloodTypeSchema,
    blood_product: bloodProductSchema,
    quantity_requested: z.number().gt(0, 'Quantity must be greater than 0'),
    priority: z.string().min(1, 'Please select a priority level'),
    notes: z.string().optional(),
    facility_ids: z
      .array(z.string())
      .min(1, 'Please select at least one facility'),
  })
  .refine((data) => data.blood_type !== '', {
    message: 'Please select a blood type',
    path: ['blood_type'],
  })
  .refine((data) => data.blood_product !== '', {
    message: 'Please select a blood product',
    path: ['blood_product'],
  })
