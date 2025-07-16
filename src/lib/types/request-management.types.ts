import type { BloodProductType, BloodType } from '@/lib/types/product.types'
import type { Pagination } from './system-types'

export type MainTab = 'sent' | 'received'
export type MainTabLabels = 'Sent' | 'Received'

export type SubTab = 'all' | 'pending' | 'dispatched' | 'completed'

export type SubTabLabels = 'All' | 'Pending' | 'Dispatched' | 'Completed'

// Automatically generate all combinations using template literal types
export type CombinedTabValue = `${MainTab}-${SubTab}`

// Type-safe tab configuration
export interface MainTabConfig {
  label: MainTabLabels
  value: MainTab
}

export interface SubTabConfig {
  label: SubTabLabels
  value: SubTab
}

// Constants with type safety
export const MAIN_TABS: ReadonlyArray<MainTabConfig> = [
  { label: 'Sent', value: 'sent' },
  { label: 'Received', value: 'received' },
] as const

export const SUB_TABS: ReadonlyArray<SubTabConfig> = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Dispatched', value: 'dispatched' },
  { label: 'Completed', value: 'completed' },
] as const

// Generate all possible combinations programmatically with type safety
export const ALL_TABS: ReadonlyArray<CombinedTabValue> = MAIN_TABS.flatMap(
  (mainTab) =>
    SUB_TABS.map(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      (subTab) => `${mainTab.value}-${subTab.value}` as CombinedTabValue,
    ),
)

// Helper functions with complete type safety
export const parseTabValue = (
  combined: CombinedTabValue,
): { main: MainTab; sub: SubTab } => {
  const parts = combined.split('-')
  const main = parts[0] as MainTab
  const sub = parts.slice(1).join('-') as SubTab
  return { main, sub }
}

export const combineTabValue = (
  main: MainTab,
  sub: SubTab,
): CombinedTabValue => {
  return `${main}-${sub}`
}

// Type guard to check if a string is a valid CombinedTabValue
export const isCombinedTabValue = (
  value: string,
): value is CombinedTabValue => {
  return ALL_TABS.includes(value as CombinedTabValue)
}

// Default tab value
export const DEFAULT_TAB: CombinedTabValue = 'sent-all'

// Enum array for zod schema - properly typed
export const COMBINED_TAB_VALUES: [
  CombinedTabValue,
  ...Array<CombinedTabValue>,
] = [DEFAULT_TAB, ...ALL_TABS.filter((tab) => tab !== DEFAULT_TAB)] as [
  CombinedTabValue,
  ...Array<CombinedTabValue>,
]

export type RequestStatus = 'pending' | 'dispatched' | 'completed'
export type RequestState = 'pending' | 'rejected' | 'accepted' | 'cancelled'

// use this to get the types
// "id": "6ba3eca5-6331-4f95-8916-272cb9e4ac03",
//           "requester_id": "9b089f6d-6113-451b-9aa7-e721582beb4a",
//           "facility_id": "caa9fdab-36e8-48b8-b869-be1ebfacd7ce",
//           "receiving_facility_name": "Tamale Teaching Hospital",
//           "request_group_id": "00cb4d79-5337-4319-909c-fa804aae2b53",
//           "is_master_request": true,
//           "blood_type": "A+",
//           "blood_product": "Whole Blood",
//           "quantity_requested": 4,
//           "request_status": "pending",
//           "processing_status": "pending",
//           "notes": "jjdjd",
//           "option": "sent",
//           "cancellation_reason": null,
//           "requester_facility_name": "Tamale West Hospital",
//           "created_at": "2025-07-14T00:52:33",
//           "updated_at": "2025-07-14T00:52:33"
export type RequestType = {
  id: string
  requester_id: string
  facility_id: string
  receiving_facility_name: string
  requester_name: string
  requester_facility_name: string
  request_group_id: string
  is_master_request: boolean
  blood_type: BloodType
  blood_product: BloodProductType
  quantity_requested: number
  status: RequestStatus
  request_status: RequestState
  processing_status: RequestStatus
  notes: string
  cancellation_reason: string
  created_at: string
  updated_at: string
}

export type PaginatedRequestType = Pagination & {
  items: Array<RequestType>
}
