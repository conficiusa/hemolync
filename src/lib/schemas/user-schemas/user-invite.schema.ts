import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'

export const UserInviteSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  password_confirm: z.string().min(1, 'Confirm password is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine((val) => isValidPhoneNumber(val, 'GH'), {
      message: 'Invalid phone number',
    }),
  name: z.string().min(1, 'Username is required'),
  role: z.string().min(1, 'User role is required'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Invalid email address'),
})

export type UserInviteFormData = z.infer<typeof UserInviteSchema>
