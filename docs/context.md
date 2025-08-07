## Context

### Request Draft Context
Source: `src/lib/contexts/request.context.tsx`

Exports:
- `RequestDraftProvider`
- `useRequestDraft()`

The provider persists a short-lived request draft in `localStorage` with a TTL.

Example:
```tsx
import { RequestDraftProvider, useRequestDraft } from '@/lib/contexts/request.context'

function NewRequest() {
  const { draft, setDraft } = useRequestDraft()
  // ...
}

export default function Page() {
  return (
    <RequestDraftProvider>
      <NewRequest />
    </RequestDraftProvider>
  )
}
```