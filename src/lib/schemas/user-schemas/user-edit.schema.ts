import { z } from 'zod'

export const UserEditSchema = z.object({
  name: z.string().min(1, 'Username is required'),
  role: z.string().min(1, 'User role is required'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Invalid email address'),
})
export type EditUserFormData = z.infer<typeof UserEditSchema>
