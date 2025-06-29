import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'

export const UserEditSchema = z.object({
  role: z.string().min(1, 'User role is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine((val) => isValidPhoneNumber(val, 'GH'), {
      message: 'Invalid phone number',
    }),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Invalid email address'),
})
export type EditUserFormData = z.infer<typeof UserEditSchema>
