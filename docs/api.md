## API Clients

Source: `src/lib/server/api.ts`, `src/lib/server/protected-api.ts`

### `api`

Axios instance for public endpoints.

- Base URL: production `https://hemolync.onrender.com/api`, otherwise `http://localhost:8000/api`
- Headers: `Content-Type: application/json`
- Credentials: `withCredentials: true`

Example:

```ts
import { api } from '@/lib/server/api'

async function ping() {
  const res = await api.get('/health')
  return res.data
}
```

### `protectedApi` (interceptor via TanStack Query context)

Defined in `src/lib/server/protected-api.ts`. Injects `Authorization: Bearer <token>` from the `session` query, and transparently refreshes on 401 with a request queue to avoid duplicate refresh calls.

Example:

```ts
import { protectedApi } from '@/lib/server/protected-api'

async function getMe() {
  const res = await protectedApi.get('/users/me')
  return res.data
}
```

Notes:

- Intercepts requests to attach the latest access token from the `session` query.
- On 401, it refreshes the `session` and retries pending requests.

### `protectedApi` (basic instance)

There is also a basic `protectedApi` created in `src/lib/server/api.ts` without interceptors. Prefer using the interceptor-enabled version from `protected-api.ts` for authenticated flows.

### Hook alternative: `useProtectedAxios(token)`

If you have a token in React state, `useProtectedAxios` returns an axios instance that adds the token and handles refresh using `useRefreshToken`.

```ts
import useProtectedAxios from '@/lib/hooks/useProtectedAxios'

function useExample(token: string) {
  const axios = useProtectedAxios(token)
  return async () => (await axios.get('/secure')).data
}
```
