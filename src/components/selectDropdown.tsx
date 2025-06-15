'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type SelectDropdownProps = {
  items?: Array<{ value: string; label: string }>
  selected: string | null
  setSelected: (value: any) => void
  placeholder?: string
  fieldClassName?: string
  error?: string
}
const defaultItems = [
  { value: 'Administrator', label: 'Administrator' },
  { value: 'Blood bank in-charge', label: 'Blood bank in-charge' },
  { value: 'Staff', label: 'Staff' },
]
const SelectDropdown = ({
  items = defaultItems,
  selected,
  setSelected,
  error,
  placeholder = 'Select',
  fieldClassName,
}: SelectDropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleSelect = (value: string) => {
    setSelected(value)
    setIsDropdownOpen(false)
  }

  return (
    <Popover>
      <div className="relative">
        <PopoverTrigger asChild>
          <div>
            <button
              type="button"
              className={cn(
                'flex w-full items-center justify-between rounded-lg border border-[#d0d5dd] bg-white px-4 py-2.5 text-left text-[#667085] focus:outline-none',
                fieldClassName,
              )}
              onClick={toggleDropdown}
            >
              {items.find((item) => item.value === selected)?.label ||
                placeholder}
              <ChevronDown className="h-5 w-5 text-[#98a2b3]" />
            </button>
            {error && (
              <p className="text-sm text-destructive pt-0.5 px-2">{error}</p>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="absolute -top-8 left-0 w-[240px] rounded-md bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
          <div>
            <div className="py-1">
              {items.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-[#f2f4f7] rounded-md"
                  onClick={() => handleSelect(item.value)}
                >
                  <span className="text-foreground">{item.label}</span>
                  <span>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${
                        selected === item.value
                          ? 'bg-[#85143e]'
                          : 'border border-[#d0d5dd]'
                      }`}
                    >
                      {selected === item.value && (
                        <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                      )}
                    </div>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </div>
    </Popover>
  )
}

export default SelectDropdown
