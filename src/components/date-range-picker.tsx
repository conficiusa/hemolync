import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface DateRangePickerProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  onClear?: () => void
  placeholder?: string
  className?: string
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  onClear,
  placeholder = 'Pick a date range',
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const formatDateRange = React.useCallback(
    (range: DateRange) => {
      if (range.from) {
        if (range.to) {
          return `${format(range.from, 'LLL dd, y')} - ${format(range.to, 'LLL dd, y')}`
        } else {
          return format(range.from, 'LLL dd, y')
        }
      }
      return placeholder
    },
    [placeholder],
  )

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onClear?.()
    },
    [onClear]
  )

  const showClearButton = React.useMemo(
    () => onClear && (dateRange.from || dateRange.to),
    [onClear, dateRange.from, dateRange.to]
  )

  return (
    <div className={cn('grid gap-2', className)}>
      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-range-picker"
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !dateRange.from && 'text-muted-foreground',
                showClearButton && 'pr-10'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateRange(dateRange)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={(range) => {
                if (range) {
                  onDateRangeChange({
                    from: range.from,
                    to: range.to,
                  })
                  // Close popover when both dates are selected
                  if (range.from && range.to) {
                    setOpen(false)
                  }
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        
        {/* Clear button */}
        {showClearButton && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleClear}
            aria-label="Clear date range"
            type="button"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}
