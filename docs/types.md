## Types

### System Types

Source: `src/lib/types/system-types.tsx`

- `Role`
- `User`
- `Session`
- `Pagination`
- `Result<T, TError>`

### Product Types

Source: `src/lib/types/product.types.ts`

- `BloodType`
- `BloodProductType`
- `BloodProduct`
- `ProductSortBy`, `ProductSortOrder`
- `FetchArgs`
- `BloodProductResponse`

### Facilities Types

Source: `src/lib/types/facilities.types.ts`

- `getFacilitiesWithRequirementsArgs`
- `PlacingRequestFacility`, `PlacingRequestFacilityResponse`

### Request Management Types

Source: `src/lib/types/request-management.types.ts`

- `MainTab`, `SubTab`, `CombinedTabValue`
- `MAIN_TABS`, `SUB_TABS`, `ALL_TABS`, `DEFAULT_TAB`
- `parseTabValue(combined)`, `combineTabValue(main, sub)`, `isCombinedTabValue(value)`
- `RequestStatus`, `RequestState`, `RequestType`, `PaginatedRequestType`

### User Types

Source: `src/lib/types/user-types.tsx`

- `User`, `Staff`

Usage example:

```ts
import type { FetchArgs } from '@/lib/types/product.types'
function list(args: FetchArgs) {
  /* ... */
}
```
