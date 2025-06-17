import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Controller } from 'react-hook-form'
import type { Control, Path } from 'react-hook-form'
import type { ZodSchema, z } from 'zod'
import { cn } from '@/lib/utils'

export const TextInput = <T extends ZodSchema<any, any, any>>({
  control,
  type = 'text',
  placeholder,
  error,
  name,
  required = false,
  label,
  labelClassName,
  ...rest
}: {
  control: Control<z.infer<T>>
  type?: 'text' | 'password' | 'email' | 'tel' | 'number'
  placeholder?: string
  required?: boolean
  label?: string
  error?: string
  name: Path<z.infer<T>>
  labelClassName?: string
  [key: string]: any
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const togglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  const inputType = () => {
    if (type === 'password' && showPassword) return 'text'
    return type
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void,
  ) => {
    if (type === 'number') {
      const value = e.target.value === '' ? undefined : Number(e.target.value)
      onChange(value)
    } else {
      onChange(e.target.value)
    }
  }

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

            <div className="relative">
              <input
                aria-invalid={!!error}
                type={inputType()}
                onBlur={onBlur}
                onChange={(e) => handleChange(e, onChange)}
                {...rest}
                value={value}
                id={name}
                placeholder={placeholder}
                className={cn(
                  'w-full rounded-lg border border-input bg-background px-3 py-3  text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                  error && 'border-2 border-destructive',
                  type === 'password' && 'pr-10',
                )}
                required={required}
              />
              {type === 'password' && (
                <WhichEye
                  showPassword={showPassword}
                  togglePassword={togglePassword}
                />
              )}
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive pt-0.5 px-2">
              {error}
            </p>
          )}
        </div>
      )}
    />
  )
}

type WhichEyeProps = {
  showPassword: boolean
  togglePassword: () => void
}
const WhichEye = ({ showPassword, togglePassword }: WhichEyeProps) => {
  if (showPassword)
    return (
      <EyeOff
        className="absolute top-3 right-4"
        onClick={() => togglePassword()}
      />
    )
  return (
    <Eye className="absolute top-3 right-4" onClick={() => togglePassword()} />
  )
}
