'use client'

import * as React from 'react'
import { Controller } from 'react-hook-form'
import { parseDate } from 'chrono-node'
import { CalendarIcon } from 'lucide-react'
import type { Control } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

function formatDate(date: Date | undefined) {
  if (!date) {
    return ''
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function NaturalLanguageDatePicker({
  control,
  name,
  label,
  placeholder,
  error,
  description,
}: {
  control: Control<any>
  name: string
  label: string
  placeholder: string
  error?: string
  description?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')
  const [date, setDate] = React.useState<Date | undefined>(
    parseDate(value) || undefined,
  )
  const [month, setMonth] = React.useState<Date | undefined>(date)
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="space-y-3">
          <Label htmlFor={name} className="px-1">
            {label}
          </Label>
          <div className="relative flex gap-2">
            <input
              id={name}
              value={value}
              type="text"
              placeholder={placeholder}
              className={cn(
                'w-full rounded-lg border border-input bg-background px-3 py-3  text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                error && 'border-2 border-destructive',
              )}
              onChange={(e) => {
                const newDate = parseDate(`In ${e.target.value} days`)
                setValue(e.target.value.replace(/[^0-9]/g, ''))
                if (newDate) {
                  setDate(newDate)
                  setMonth(newDate)
                  field.onChange(new Date(newDate.setHours(0, 0, 0, 0)).toISOString())
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setOpen(true)
                }
              }}
            />
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant="ghost"
                  className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                >
                  <CalendarIcon className="size-3.5" />
                  <span className="sr-only">Select date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  month={month}
                  onMonthChange={setMonth}
                  onSelect={(newDate) => {
                    field.onChange(newDate?.toISOString())
                    setDate(newDate)
                    setValue(formatDate(newDate))
                    setOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="text-muted-foreground px-1 text-sm">
            {description && date && (
              <>
                {description}{' '}
                <span className="font-medium">{formatDate(date)}</span>.
              </>
            )}
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
      )}
    />
  )
}
