import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'

interface MultiSelectOption {
  label: string
  value: string
}

interface MultiSelectDropdownProps {
  options: Array<MultiSelectOption>
  selectedValues: Array<string>
  onSelectionChange: (values: Array<string>) => void
  placeholder?: string
  className?: string
}

/**
 * Multi-select dropdown component for selecting multiple blood products
 * Supports checkbox-based selection with visual feedback
 */
export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = 'Select options',
  className,
}) => {
  const [open, setOpen] = React.useState(false)

  const handleToggleOption = React.useCallback(
    (value: string) => {
      const isSelected = selectedValues.includes(value)
      const newSelection = isSelected
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value]

      onSelectionChange(newSelection)
    },
    [selectedValues, onSelectionChange],
  )

  const handleSelectAll = React.useCallback(() => {
    const allValues = options.map((option) => option.value)
    const allSelected = allValues.every((value) =>
      selectedValues.includes(value),
    )

    if (allSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(allValues)
    }
  }, [options, selectedValues, onSelectionChange])

  const displayText = React.useMemo(() => {
    if (selectedValues.length === 0) {
      return placeholder
    }

    if (selectedValues.length === 1) {
      const option = options.find((opt) => opt.value === selectedValues[0])
      return option?.label || placeholder
    }

    if (selectedValues.length === options.length) {
      return 'All Blood Products'
    }

    return `${selectedValues.length} Blood Products Selected`
  }, [selectedValues, options, placeholder])

  const allSelected = React.useMemo(
    () => options.length > 0 && selectedValues.length === options.length,
    [options.length, selectedValues.length],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="button"
          aria-expanded={open}
          aria-label="Select blood products"
          className={cn(
            'justify-between text-left font-normal',
            selectedValues.length === 0 && 'text-muted-foreground',
            className,
          )}
        >
          <span className="truncate">{displayText}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-2">
          {/* Select All Option */}
          <div className="flex items-center space-x-2 p-2 hover:bg-accent hover:text-accent-foreground rounded-sm">
            <Checkbox
              id="select-all"
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              aria-label="Select all blood products"
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Select All
            </label>
          </div>

          {/* Individual Options */}
          {options.map((option) => {
            const isChecked = selectedValues.includes(option.value)
            return (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-2 hover:bg-accent hover:text-accent-foreground rounded-sm"
              >
                <Checkbox
                  id={option.value}
                  checked={isChecked}
                  onCheckedChange={() => handleToggleOption(option.value)}
                  aria-label={`Select ${option.label}`}
                />
                <label
                  htmlFor={option.value}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {option.label}
                </label>
                {isChecked && <Check className="h-4 w-4 text-primary" />}
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
