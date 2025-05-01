import { z } from 'zod'

export const LoginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Invalid email address'),
})
