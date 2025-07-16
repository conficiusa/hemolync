import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Check, SearchIcon } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { newRequestSchemaData } from '@/components/request-form'
import type { BloodProductType, BloodType } from '@/lib/types/product.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetchBloodBanksQuery } from '@/lib/data/queries/facilities/fetch-facilities'

// Custom Checkbox Component

export const FacilitySelectionSection = ({
  blood_product,
  blood_type,
  form,
}: {
  blood_product: BloodProductType
  blood_type: BloodType
  form: UseFormReturn<newRequestSchemaData>
}) => {
  const { setValue, watch } = form
  const selectedFacilities = watch('facility_ids')
  const [initiateSearch, setInitiateSearch] = useState(false)
  const [_search, setSearch] = useState('')
  // Define facilities data for mapping
  const {
    data: { items: bloodbanks },
  } = useSuspenseQuery(
    fetchBloodBanksQuery({
      blood_product: blood_product,
      blood_type: blood_type,
    }),
  )

  const toggleSelect = (itemId: string) => {
    setValue(
      'facility_ids',
      selectedFacilities.includes(itemId)
        ? selectedFacilities.filter((id) => id !== itemId)
        : [...selectedFacilities, itemId],
    )
  }

  if (bloodbanks.length === 0) {
    return (
      <div className="flex flex-col items-center relative self-stretch w-full bg-secondary rounded-sm p-4">
        <div className="flex flex-col items-center justify-center gap-4 p-6 relative self-stretch w-full">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <SearchIcon className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-center space-y-1">
            <div className="font-medium text-gray-800 text-base leading-6">
              No facilities available
            </div>
            <div className="font-normal text-gray-600 text-sm leading-5">
              No facilities can fulfill your request for {blood_product} (
              {blood_type}) at the moment.
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center  relative self-stretch w-full">
      {/* Facility Selection */}
      <div className="flex flex-col items-start gap-3 p-4 relative self-stretch w-full bg-gray-100 rounded-sm">
        <div className="flex flex-col items-start relative self-stretch w-full">
          <div className="flex items-center gap-2.5 px-0 py-[5px] relative self-stretch w-full">
            <div className="font-text-sm-medium text-gray-800 text-sm leading-5 tracking-[0px] whitespace-nowrap">
              Facility(s) Available
            </div>
          </div>

          <div className="font-text-xs-regular text-gray-600 text-xs leading-[18px] tracking-[0px] whitespace-nowrap">
            Select at least one facility to send the request
          </div>
        </div>

        <CustomRadioButton
          checked={initiateSearch}
          onChange={() => setInitiateSearch(!initiateSearch)}
          label="Search a facility"
          id="search-facility"
        />

        <div className="relative w-full">
          {initiateSearch && (
            <div className="flex items-center w-2/3 gap-2 px-3.5 py-2.5 bg-white rounded-sm border border-solid border-[#cfd4dc] shadow-shadow-xs">
              <Input
                className="border-0 shadow-none p-0 h-auto text-gray-500 text-md placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Select facility name"
                onChange={(e) => {
                  setSearch(e.target.value)
                }}
              />
              <SearchIcon className="w-5 h-5 text-gray-500" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-start gap-3 relative self-stretch w-full">
          {bloodbanks.map((facility, index) => (
            <div
              onClick={() => toggleSelect(facility.facility_id)}
              role="checkbox"
              aria-checked={selectedFacilities.includes(facility.facility_id)}
              key={index}
              className={`w-full rounded-sm overflow-hidden bg-card ${
                selectedFacilities.includes(facility.facility_id)
                  ? 'outline-2 outline-primary'
                  : 'border border-[#cfd4dc]'
              }`}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex flex-col items-start justify-center gap-1">
                  <div className="font-bold text-sm whitespace-nowrap">
                    {facility.facility_name}
                  </div>
                  <div className="text-xs text-muted-foreground">2Km away</div>
                </div>
                <div className="flex items-center justify-center">
                  <CustomCheckbox
                    checked={selectedFacilities.includes(facility.facility_id)}
                    onChange={() => toggleSelect(facility.facility_id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          className="text-primary text-sm px-2 -mt-2 hover:text-primary/70 cursor-pointer"
        >
          See More
        </Button>
      </div>
    </div>
  )
}

const CustomRadioButton = ({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean
  onChange: () => void
  label: string
  id: string
}) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={onChange}>
      <div
        className={`
        relative w-4 h-4 rounded-full border-2 transition-all duration-200 ease-in-out
        ${
          checked
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 hover:border-gray-400'
        }
      `}
      >
        {checked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary animate-in zoom-in-50 duration-200" />
          </div>
        )}
      </div>
      <Label
        htmlFor={id}
        className="font-text-xs-regular text-gray-800 text-xs leading-[18px] tracking-[0px] cursor-pointer"
      >
        {label}
      </Label>
    </div>
  )
}

const CustomCheckbox = ({
  checked,
  onChange,
  className = '',
}: {
  checked: boolean
  onChange?: () => void
  className?: string
}) => {
  return (
    <div
      className={`
        relative w-4 h-4 rounded-[3px] border-1 transition-all duration-200 ease-in-out cursor-pointer
        ${
          checked
            ? 'border-primary bg-primary-accent text-primary-accent-foreground'
            : 'border-gray-300 bg-white hover:border-gray-400'
        }
        ${className}
      `}
      onClick={(e) => {
        e.stopPropagation()
        onChange?.()
      }}
    >
      {checked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Check className="w-3 h-3  animate-in zoom-in-50 duration-200" />
        </div>
      )}
    </div>
  )
}
