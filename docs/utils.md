## Utilities

Source: `src/lib/utils.ts`

### `cn(...classNames)`
Merge class names with Tailwind merge and clsx.
```ts
import { cn } from '@/lib/utils'
<div className={cn('p-2', isActive && 'bg-primary')} />
```

### `getStatusBadgeClass(status)`
Map inventory status to Tailwind classes.
```ts
const klass = getStatusBadgeClass('In Stock')
```

### `getRequestStatusBadgeClass(status)` and `getRequestStatusBadgeClassComplementary(status)`
Map request status to Tailwind classes.

### `checkAuth(auth, location, preload)`
Validate session and redirect to `/auth/login` if missing.
```ts
import { checkAuth } from '@/lib/utils'
checkAuth(session, location, false)
```

### `handleRedirectNavigation(location, navigate, to)`
Navigate to redirect path from search params or fallback.

### `getReadableRole(role)`
Convert backend role keys to readable labels.

### `tryCatch(promise)`
Wrap a promise and return `{ data, error }`.
```ts
const { data, error } = await tryCatch(fetchUsers())
```

### `generatePages(current, total)`
Return an array of page numbers and `'ellipsis'` for pagination UIs.

### `formatDate(date)` and `formatDateDescription(date)`
Formatting helpers for dates like "today", "tomorrow", "N days ago".