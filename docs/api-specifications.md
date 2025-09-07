# Blood Products Chart API Specifications

## Overview

This document defines the API specifications for blood product inventory data that powers the Dashboard Chart component. These specifications ensure consistent data structure, optimal performance, and seamless integration with future API implementations.

## API Endpoints

### Base Configuration
```
Base URL: /api/v1
Authentication: Bearer Token (JWT)
Content-Type: application/json
Rate Limit: 1000 requests/hour per user
```

## Core Endpoints

### 1. Get Blood Product Inventory Data

#### Endpoint
```http
GET /api/v1/blood-products/inventory
```

#### Description
Retrieves blood product inventory levels over a specified time period with optional filtering capabilities.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `startDate` | `string` | No | 7 days ago | Start date (ISO 8601 format) |
| `endDate` | `string` | No | Current date | End date (ISO 8601 format) |
| `products` | `string[]` | No | All products | Comma-separated blood product types |
| `facilityId` | `string` | Yes | - | Facility identifier |
| `granularity` | `string` | No | `daily` | Data granularity: `hourly`, `daily`, `weekly` |
| `timezone` | `string` | No | `UTC` | Timezone for date calculations |

#### Example Request
```http
GET /api/v1/blood-products/inventory?startDate=2024-01-01&endDate=2024-01-31&products=whole_blood,red_blood_cells&facilityId=facility_123&granularity=daily
```

#### Response Schema
```typescript
interface BloodProductInventoryResponse {
  data: BloodProductDataPoint[]
  metadata: {
    totalRecords: number
    startDate: string
    endDate: string
    facilityId: string
    granularity: string
    generatedAt: string
  }
  pagination?: {
    page: number
    limit: number
    total: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

interface BloodProductDataPoint {
  timestamp: string           // ISO 8601 timestamp
  date: string               // YYYY-MM-DD format
  formattedDate: string      // Human-readable format (e.g., "Jan 15")
  facilityId: string         // Facility identifier
  whole_blood?: number       // Units in stock
  red_blood_cells?: number   // Units in stock
  platelets?: number         // Units in stock
  fresh_frozen_plasma?: number // Units in stock
  cryoprecipitate?: number   // Units in stock
  albumin?: number           // Units in stock
  metadata?: {
    lastUpdated: string      // When this data point was last updated
    source: string           // Data source identifier
    quality: 'excellent' | 'good' | 'fair' | 'poor' // Data quality indicator
  }
}
```

#### Example Response
```json
{
  "data": [
    {
      "timestamp": "2024-01-15T00:00:00Z",
      "date": "2024-01-15",
      "formattedDate": "Jan 15",
      "facilityId": "facility_123",
      "whole_blood": 150,
      "red_blood_cells": 200,
      "platelets": 85,
      "fresh_frozen_plasma": 120,
      "cryoprecipitate": 45,
      "albumin": 90,
      "metadata": {
        "lastUpdated": "2024-01-15T08:30:00Z",
        "source": "inventory_system",
        "quality": "excellent"
      }
    }
  ],
  "metadata": {
    "totalRecords": 31,
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-31T23:59:59Z",
    "facilityId": "facility_123",
    "granularity": "daily",
    "generatedAt": "2024-01-31T10:15:30Z"
  }
}
```

### 2. Get Blood Product Types

#### Endpoint
```http
GET /api/v1/blood-products/types
```

#### Description
Retrieves available blood product types and their configuration.

#### Response Schema
```typescript
interface BloodProductTypesResponse {
  data: BloodProductType[]
  metadata: {
    totalTypes: number
    generatedAt: string
  }
}

interface BloodProductType {
  key: string                // Machine-readable identifier
  label: string              // Human-readable name
  description: string        // Detailed description
  units: string              // Unit of measurement
  color: string              // Hex color code for charts
  category: string           // Product category
  isActive: boolean          // Whether currently tracked
  minimumStock: number       // Alert threshold
  maximumStock: number       // Capacity limit
  expirationDays: number     // Shelf life in days
}
```

#### Example Response
```json
{
  "data": [
    {
      "key": "whole_blood",
      "label": "Whole Blood",
      "description": "Complete blood with all components",
      "units": "units",
      "color": "#e11d48",
      "category": "primary",
      "isActive": true,
      "minimumStock": 50,
      "maximumStock": 300,
      "expirationDays": 35
    }
  ],
  "metadata": {
    "totalTypes": 6,
    "generatedAt": "2024-01-31T10:15:30Z"
  }
}
```

### 3. Get Facility Information

#### Endpoint
```http
GET /api/v1/facilities/{facilityId}
```

#### Description
Retrieves facility-specific information and configuration.

#### Response Schema
```typescript
interface FacilityResponse {
  data: Facility
  metadata: {
    lastUpdated: string
    version: string
  }
}

interface Facility {
  id: string
  name: string
  type: 'hospital' | 'blood_bank' | 'clinic' | 'research'
  timezone: string
  location: {
    country: string
    region: string
    city: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  configuration: {
    supportedProducts: string[]
    dataRetentionDays: number
    updateFrequency: 'real-time' | 'hourly' | 'daily'
  }
}
```

## Advanced Endpoints

### 4. Real-time Blood Product Updates

#### WebSocket Endpoint
```
wss://api.example.com/v1/blood-products/live
```

#### Connection Parameters
```typescript
interface WebSocketConnection {
  facilityId: string
  products?: string[]
  authentication: string // JWT token
}
```

#### Message Format
```typescript
interface LiveUpdateMessage {
  type: 'inventory_update' | 'system_status' | 'error'
  timestamp: string
  facilityId: string
  data: BloodProductDataPoint | SystemStatus | ErrorInfo
}
```

### 5. Historical Data Export

#### Endpoint
```http
POST /api/v1/blood-products/export
```

#### Request Body
```typescript
interface ExportRequest {
  startDate: string
  endDate: string
  facilityId: string
  products: string[]
  format: 'csv' | 'json' | 'excel'
  includeMetadata: boolean
  compression?: 'gzip' | 'zip'
}
```

#### Response
Returns a file download or a URL to download the exported data.

## Error Handling

### Standard Error Response
```typescript
interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: any
    timestamp: string
    requestId: string
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_DATE_RANGE` | 400 | Date range is invalid or too large |
| `FACILITY_NOT_FOUND` | 404 | Facility ID does not exist |
| `UNAUTHORIZED_FACILITY` | 403 | User doesn't have access to facility |
| `PRODUCT_TYPE_INVALID` | 400 | Unknown blood product type |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `DATA_UNAVAILABLE` | 503 | Data temporarily unavailable |

## Data Quality Standards

### Validation Rules
1. **Timestamps**: Must be valid ISO 8601 format
2. **Inventory Values**: Non-negative integers only
3. **Date Ranges**: Maximum 365 days per request
4. **Product Keys**: Must match registered product types
5. **Facility IDs**: Must be valid and accessible

### Data Freshness
- **Real-time Systems**: < 5 minutes delay
- **Hourly Updates**: Within 1 hour of measurement
- **Daily Updates**: By 6 AM local time
- **Historical Data**: Immutable after 24 hours

### Performance Requirements
- **Response Time**: < 500ms for typical requests
- **Availability**: 99.9% uptime SLA
- **Throughput**: Support 1000 concurrent requests
- **Data Consistency**: Eventually consistent within 30 seconds

## Caching Strategy

### Client-Side Caching
```typescript
interface CacheConfig {
  maxAge: number        // Cache duration in seconds
  staleWhileRevalidate: number // Serve stale data while fetching
  cacheKey: string      // Unique identifier for cache entry
}

// Recommended cache settings
const cacheSettings = {
  inventory: { maxAge: 300, staleWhileRevalidate: 60 },    // 5 min cache
  types: { maxAge: 86400, staleWhileRevalidate: 3600 },    // 24 hr cache
  facilities: { maxAge: 3600, staleWhileRevalidate: 300 }  // 1 hr cache
}
```

### Server-Side Caching
- **Redis**: For frequently accessed data
- **CDN**: For static resources and configurations
- **Database**: Query result caching for complex aggregations

## Security Considerations

### Authentication
```typescript
interface AuthToken {
  sub: string          // User ID
  facilitiesAccess: string[] // Accessible facility IDs
  permissions: string[] // Granted permissions
  exp: number          // Expiration timestamp
  iat: number          // Issued at timestamp
}
```

### Data Privacy
- **PII Protection**: No personally identifiable information in responses
- **Audit Logging**: All API access logged with user context
- **Data Encryption**: TLS 1.3 for all communications
- **Access Control**: Role-based permissions per facility

## Integration Examples

### React Query Integration
```typescript
import { useQuery } from '@tanstack/react-query'

const useBloodProductInventory = (params: InventoryParams) => {
  return useQuery({
    queryKey: ['blood-products', 'inventory', params],
    queryFn: () => fetchInventoryData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  })
}
```

### Axios Configuration
```typescript
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      redirectToLogin()
    }
    return Promise.reject(error)
  }
)
```

## Testing Guidelines

### API Testing
```typescript
describe('Blood Products API', () => {
  test('GET /inventory returns valid data structure', async () => {
    const response = await request(app)
      .get('/api/v1/blood-products/inventory')
      .query({ facilityId: 'test_facility' })
      .expect(200)
    
    expect(response.body).toMatchSchema(BloodProductInventoryResponse)
    expect(response.body.data).toBeInstanceOf(Array)
    expect(response.body.metadata.facilityId).toBe('test_facility')
  })
})
```

### Performance Testing
```typescript
// Load testing with Artillery
{
  "config": {
    "target": "https://api.example.com",
    "phases": [
      { "duration": 60, "arrivalRate": 10 },
      { "duration": 120, "arrivalRate": 50 },
      { "duration": 60, "arrivalRate": 10 }
    ]
  },
  "scenarios": [
    {
      "name": "Get inventory data",
      "flow": [
        {
          "get": {
            "url": "/api/v1/blood-products/inventory",
            "qs": {
              "facilityId": "{{ facilityId }}",
              "startDate": "2024-01-01",
              "endDate": "2024-01-31"
            }
          }
        }
      ]
    }
  ]
}
```

## Migration Guide

### From v1.0 to v2.0
1. **Breaking Changes**:
   - Date format changed from Unix timestamp to ISO 8601
   - Product keys now use snake_case instead of camelCase
   - Pagination added to large result sets

2. **Migration Steps**:
   ```typescript
   // Old format
   { timestamp: 1641340800, redBloodCells: 200 }
   
   // New format
   { timestamp: "2024-01-15T00:00:00Z", red_blood_cells: 200 }
   ```

3. **Compatibility Layer**:
   Add header `Accept-Version: v1` to continue using legacy format during transition period.

This API specification provides a comprehensive foundation for implementing robust blood product inventory systems that integrate seamlessly with the Dashboard Chart component.