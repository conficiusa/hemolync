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
    [onClear],
  )

  const showClearButton = React.useMemo(
    () => onClear && (dateRange.from || dateRange.to),
    [onClear, dateRange.from, dateRange.to],
  )

  return (
    <div>
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-range-picker"
              variant="outline"
              aria-label="Pick a date range"
              className={cn(
                'justify-start text-left font-normal',
                !dateRange.from && 'text-muted-foreground',
                showClearButton && 'pr-10',
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
            variant="secondary"
            size="icon"
          
            onClick={handleClear}
            aria-label="Clear date range"
            type="button"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
