## Hooks

### `useAuth()`

Source: `src/lib/data/mutations/mutate-auth.ts`

Returns `{ login, logout, updateUser }` mutation objects.

```tsx
import useAuth from '@/lib/data/mutations/mutate-auth'

function Login() {
  const { login } = useAuth()
  const onSubmit = (data: { email: string; password: string }) =>
    login.mutate(data)
  // ...
}
```

### `useMutateStaff()`

Source: `src/lib/data/mutations/mutate-staff.tsx`

Returns `{ addStaffMutation, editStaffMutation, deleteStaffMutation }`.

```ts
import { useMutateStaff } from '@/lib/data/mutations/mutate-staff'
const { addStaffMutation, editStaffMutation, deleteStaffMutation } =
  useMutateStaff()
addStaffMutation.mutate({
  first_name: 'Jane',
  last_name: 'Doe',
  email: 'jane@example.com',
  phone: '+15551234567',
  password: 'x',
  password_confirm: 'x',
  role: 'staff',
})
```

### `useMutateRequest()`

Source: `src/lib/data/mutations/mutate-requests.ts`

Returns `{ addRequestMutation, updateRequestMutation, deleteRequestMutation }`.

```ts
import useMutateRequest from '@/lib/data/mutations/mutate-requests'
const { addRequestMutation } = useMutateRequest()
addRequestMutation.mutate({
  blood_type: 'A+',
  blood_product: 'Whole Blood',
  quantity_requested: 1,
  notes: '',
})
```

### `useRefreshToken()`

Source: `src/lib/hooks/useRefreshToken.ts`

Returns an async function that refreshes tokens.

```ts
import useRefreshToken from '@/lib/hooks/useRefreshToken'
const refresh = useRefreshToken()
const token = await refresh()
```

### `useProtectedAxios(token)`

Source: `src/lib/hooks/useProtectedAxios.tsx`

Returns an axios instance that attaches `Authorization` and transparently refreshes on 401.

```ts
import useProtectedAxios from '@/lib/hooks/useProtectedAxios'
const axios = useProtectedAxios('access-token')
const data = (await axios.get('/secure')).data
```

### `useIsMobile()`

Source: `src/lib/hooks/use-mobile.ts`

Returns a boolean indicating if the viewport is under the mobile breakpoint.

```ts
import { useIsMobile } from '@/lib/hooks/use-mobile'
const isMobile = useIsMobile()
```
