import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'

export const userProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine((val) => isValidPhoneNumber(val, 'GH'), {
      message: 'Invalid phone number',
    }),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
})

export type UserProfileSchemaData = z.infer<typeof userProfileSchema>
