import {  Controller  } from 'react-hook-form'
import type {Control, Path} from 'react-hook-form';
import type { ZodSchema, z } from 'zod'
import { cn } from '@/lib/utils'

export const TextInputBuilder = <T extends ZodSchema<any, any, any>>({
  control,
  type = 'text',
  placeholder,
  error,
  name,
  required = false,
  label,
  labelClassName,
}: {
  control: Control<z.infer<T>>
  type?: 'text' | 'password' | 'email'
  placeholder?: string
  required?: boolean
  label?: string
  error?: string
  name: Path<z.infer<T>>
  labelClassName?: string
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur } }) => (
        <div>
          <div className="space-y-2">
            {label && (
              <label
                htmlFor={name}
                className={cn(
                  `block text-sm font-medium text-foreground `,
                  labelClassName,
                )}
              >
                {label}
              </label>
            )}
            <input
              aria-invalid={!!error}
              type={type}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              id={name}
              placeholder={placeholder}
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required={required}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive pt-0.5 px-2]">{error}</p>
          )}
        </div>
      )}
    />
  )
}
