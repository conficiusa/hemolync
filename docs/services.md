## Services

### Auth Service
Source: `src/lib/services/auth.service.ts`

- `getSession(): Promise<Session>`
```ts
import authService from '@/lib/services/auth.service'
const session = await authService.getSession()
```

- `loginRequest(data: LoginFormData)`
```ts
import authService from '@/lib/services/auth.service'
await authService.loginRequest({ email: 'a@b.com', password: 'secret' })
```

- `logoutRequest()`
```ts
await authService.logoutRequest()
```

- `updateUserRequest(data: UserProfileSchemaData & { id: string })`
```ts
await authService.updateUserRequest({ id: 'user-id', first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com', phone: '+15551234567', role: 'staff' })
```

### Request Services
Source: `src/lib/services/request.service.ts`

- `getRequestsByStatus(status?: RequestStatus | 'all', option?: MainTab, request_status?: RequestState)`
```ts
import requestService from '@/lib/services/request.service'
const data = await requestService.getRequestsByStatus('pending', 'sent', 'accepted')
```

- `getRequestById(id: string)`
```ts
const request = await requestService.getRequestById('request-id')
```

- `addRequest(data: newRequestSchemaData)`
```ts
await requestService.addRequest({ blood_type: 'A+', blood_product: 'Whole Blood', quantity_requested: 2, notes: 'urgent', /* ... */ })
```

- `updateRequest(data: any)`
```ts
await requestService.updateRequest({ id: 'request-id', notes: 'updated' })
```

- `deleteRequest(id: string)`
```ts
await requestService.deleteRequest('request-id')
```

### Products Service
Source: `src/lib/services/products.service.ts`

- `fetchProducts(args: FetchArgs)`
```ts
import productsService from '@/lib/services/products.service'
const res = await productsService.fetchProducts({ page: 1, page_size: 20, sort_by: 'created_at', sort_order: 'desc' })
```

- `addProduct(data: any)`
```ts
await productsService.addProduct({ blood_product: 'Whole Blood', blood_type: 'A+', quantity: 10 })
```

- `updateProduct(data: any)`
```ts
await productsService.updateProduct({ id: 'product-id', quantity: 15 })
```

- `deleteProduct(id: string)`
```ts
await productsService.deleteProduct('product-id')
```

### Facilities Service
Source: `src/lib/services/facilities.service.ts`

- `getFacilitiesWithRequirements(args: getFacilitiesWithRequirementsArgs)`
```ts
import facilitiesServices from '@/lib/services/facilities.service'
const res = await facilitiesServices.getFacilitiesWithRequirements({ blood_product: 'Whole Blood', blood_type: 'A+' })
```