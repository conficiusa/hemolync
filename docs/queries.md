## Queries

### Requests

Source: `src/lib/data/queries/requests/fetch-requests.ts`

- `fetchRequests(status, option?, request_status?)`

```ts
import { useQuery } from '@tanstack/react-query'
import { fetchRequests } from '@/lib/data/queries/requests/fetch-requests'
const { data } = useQuery(fetchRequests('pending', 'sent', 'accepted'))
```

- `fetchRequestById(id)`

```ts
import { useQuery } from '@tanstack/react-query'
import { fetchRequestById } from '@/lib/data/queries/requests/fetch-requests'
const { data } = useQuery(fetchRequestById('request-id'))
```

### Products

Source: `src/lib/data/queries/inventory/fetch-products.ts`

- `fetchProductsQuery(page?, sort_by?, sort_order?, page_size?)`

```ts
import { useQuery } from '@tanstack/react-query'
import { fetchProductsQuery } from '@/lib/data/queries/inventory/fetch-products'
const { data } = useQuery(fetchProductsQuery(1, 'created_at', 'desc', 20))
```

### Facilities

Source: `src/lib/data/queries/facilities/fetch-facilities.ts`

- `fetchBloodBanksQuery(args)`

```ts
import { useQuery } from '@tanstack/react-query'
import { fetchBloodBanksQuery } from '@/lib/data/queries/facilities/fetch-facilities'
const { data, isFetching } = useQuery(
  fetchBloodBanksQuery({ blood_product: 'Whole Blood', blood_type: 'A+' }),
)
```

### Staff

Source: `src/lib/data/queries/users/fetch-staff.tsx`

- `fetchStaffQuery()`

```ts
import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchStaffQuery } from '@/lib/data/queries/users/fetch-staff'
const { data } = useSuspenseQuery(fetchStaffQuery())
```

### Session

Source: `src/lib/data/queries/auth/refresh.ts`

- `session`

```ts
import { useQuery } from '@tanstack/react-query'
import { session } from '@/lib/data/queries/auth/refresh'
const { data } = useQuery(session)
```
