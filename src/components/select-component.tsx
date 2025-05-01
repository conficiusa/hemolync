import { Controller } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

interface SelectComponentProps {
  items: Array<{ value: string; label: string }>
  placeholder: string
  name: string
  control?: any
  label: string
  description?: string | null
  empty?: string
  labelClassName?: string
  error?: string
}

export default function SelectComponent({
  items,
  placeholder,
  name,
  control,
  label,
  description = null,
  labelClassName,
  empty,
  error,
}: SelectComponentProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className={cn(
              `block text-sm font-medium text-foreground `,
              labelClassName,
            )}
          >
            {label}
          </Label>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <SelectTrigger
              id={name}
              className={cn(
                'text-muted-foreground w-full py-2 sm:py-[22px]',
                field.value && 'text-black dark:text-white',
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <SelectItem value={item.value.toString()} key={index}>
                    {item.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem className="whitespace-wrap" value="">
                  {empty || 'no items to choose from'}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {description && (
            <p className="text-sm text-muted-foreground pt-0.5 px-2">
              {description}
            </p>
          )}
          {/* Error message */}
          {error && (
            <p className="text-sm text-destructive pt-0.5 px-2">{error}</p>
          )}
        </div>
      )}
    />
  )
}
