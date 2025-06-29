import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type DatePickerProps = {
  control: Control<any>
  placeholder: string
  name: string
  label: string
  error?: string
  disabled?: (date: Date) => boolean
  labelClassName?: string
}
export function DatePicker({
  control,
  name,
  placeholder,
  error,
  label,
  disabled,
  labelClassName,
}: DatePickerProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal py-[22px] focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:border-0',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon />
                  {field.value ? (
                    format(field.value, 'PPP')
                  ) : (
                    <span>{placeholder || 'Pick a date'}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) =>
                    field.onChange(date ? date.toISOString() : '')
                  }
                  autoFocus
                  disabled={disabled}
                />
              </PopoverContent>
            </Popover>
          </div>
          {error && (
            <p className="text-sm text-destructive pt-0.5 px-2">{error}</p>
          )}
        </div>
      )}
    />
  )
}
