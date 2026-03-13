# Directus API Development Guide

## 📋 Overview

This guide explains how to build and integrate Directus APIs within the Nexpo Platform. The application uses Directus as a headless CMS with a structured API layer built on Next.js App Router.

## 🏗️ Architecture

### Directory Structure

```
src/
├── app/api/                    # Next.js API Routes
│   ├── collections/route.ts    # Collections endpoint
│   ├── search/route.ts         # Search functionality
│   ├── fields/route.ts         # Form fields
│   ├── relations/route.ts      # Navigation data
│   └── feedback/route.ts       # User feedback
├── services/
│   └── directus.ts            # Service layer functions
├── directus/
│   ├── client.ts              # Directus SDK client
│   ├── queries/               # Query builders
│   │   ├── pages.ts
│   │   ├── navigation.ts
│   │   ├── sites.ts
│   │   └── globals.ts
│   ├── types.ts               # TypeScript types
│   └── utils.ts               # Utility functions
└── types/
    └── directus.d.ts          # Global type definitions
```

## 🔧 Setup & Configuration

### 1. Environment Variables

Create `.env.local` with required Directus configuration:

```env
NEXT_PUBLIC_DIRECTUS_URL=https://app.nexpo.vn
NEXT_PUBLIC_DIRECTUS_TOKEN=xDGh7_ZnoHmHmqC-RRR-CtJI6QoDcRRj
NEXT_PUBLIC_ENABLE_FALLBACK_DATA=false
```

### 2. Directus Client Setup

The client is configured in `/src/directus/client.ts`:

```typescript
import { createDirectus, rest, staticToken } from '@directus/sdk'
import type { Schema } from './types'

const directus = createDirectus<Schema>(
  process.env.NEXT_PUBLIC_DIRECTUS_URL!
)
  .with(rest())
  .with(staticToken(process.env.NEXT_PUBLIC_DIRECTUS_TOKEN!))

export default directus
```

## 📝 Building API Endpoints

### 1. Basic API Route Structure

Create new API endpoints in `/src/app/api/[endpoint]/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { yourServiceFunction } from '@/services/directus'

export async function GET() {
  try {
    const data = await yourServiceFunction()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await yourServiceFunction(body)
    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
```

### 2. Service Layer Functions

Implement business logic in `/src/services/directus.ts`:

```typescript
import directus from '@/directus/client'
import { readItems, createItem, updateItem } from '@directus/sdk'

// Read operations
export async function getYourCollection() {
  return directus.request(
    readItems('your_collection', {
      fields: ['*', 'related_field.*'],
      filter: {
        status: {
          _eq: 'published'
        }
      },
      sort: ['-date_created']
    })
  )
}

// Create operations
export async function createYourItem(data: any) {
  return directus.request(
    createItem('your_collection', data)
  )
}

// Update operations
export async function updateYourItem(id: string, data: any) {
  return directus.request(
    updateItem('your_collection', id, data)
  )
}

// Delete operations
export async function deleteYourItem(id: string) {
  return directus.request(
    deleteItem('your_collection', id)
  )
}
```

### 3. Query Builders

Create specialized query functions in `/src/directus/queries/`:

```typescript
// src/directus/queries/your-collection.ts
import directus from '../client'
import { readItems } from '@directus/sdk'

export async function getYourCollectionWithRelations() {
  return directus.request(
    readItems('your_collection', {
      fields: [
        '*',
        'translations.*',
        'related_collection.*',
        'related_collection.translations.*'
      ],
      filter: {
        status: {
          _eq: 'published'
        }
      }
    })
  )
}

export async function getYourCollectionBySlug(slug: string) {
  return directus.request(
    readItems('your_collection', {
      fields: ['*', 'translations.*'],
      filter: {
        slug: {
          _eq: slug
        },
        status: {
          _eq: 'published'
        }
      },
      limit: 1
    })
  )
}
```

## 🔍 Common Patterns

### 1. Multi-Language Support

Handle translations with proper language filtering:

```typescript
export async function getContentWithTranslations(lang: string = 'en-US') {
  return directus.request(
    readItems('your_collection', {
      fields: [
        '*',
        'translations.*',
        'translations.languages_code'
      ],
      filter: {
        translations: {
          languages_code: {
            _eq: lang
          }
        }
      }
    })
  )
}
```

### 2. Multi-Tenant Support

Filter content by site/tenant:

```typescript
export async function getSiteContent(siteId: string) {
  return directus.request(
    readItems('your_collection', {
      fields: ['*'],
      filter: {
        site_id: {
          _eq: siteId
        },
        status: {
          _eq: 'published'
        }
      }
    })
  )
}
```

### 3. Search Functionality

Implement search with multiple collections:

```typescript
export async function searchContent(searchTerm: string, collections: string[]) {
  const results = await Promise.all(
    collections.map(async (collection) => {
      return directus.request(
        readItems(collection, {
          fields: ['*', 'translations.*'],
          search: searchTerm,
          filter: {
            status: {
              _eq: 'published'
            }
          }
        })
      )
    })
  )
  
  return results.flat()
}
```

### 4. Pagination

Implement pagination for large datasets:

```typescript
export async function getPaginatedContent(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit
  
  return directus.request(
    readItems('your_collection', {
      fields: ['*'],
      limit,
      offset,
      sort: ['-date_created'],
      filter: {
        status: {
          _eq: 'published'
        }
      }
    })
  )
}
```

## 🛡️ Error Handling & Validation

### 1. Comprehensive Error Handling

```typescript
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  fallbackValue?: T
): Promise<T | undefined> {
  try {
    return await apiCall()
  } catch (error) {
    console.error('Directus API Error:', error)
    
    // Log specific error details
    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }
    
    // Return fallback value if provided
    return fallbackValue
  }
}
```

### 2. Input Validation

```typescript
import { z } from 'zod'

const createItemSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft')
})

export async function createValidatedItem(data: unknown) {
  // Validate input
  const validatedData = createItemSchema.parse(data)
  
  return directus.request(
    createItem('your_collection', validatedData)
  )
}
```

## 🔐 Authentication & Security

### 1. Token-Based Authentication

```typescript
// For server-side operations
const directus = createDirectus<Schema>(process.env.NEXT_PUBLIC_DIRECTUS_URL!)
  .with(rest())
  .with(staticToken(process.env.NEXT_PUBLIC_DIRECTUS_TOKEN!))

// For user-specific operations (if implementing user auth)
export async function getAuthenticatedUser(token: string) {
  const userDirectus = createDirectus<Schema>(process.env.NEXT_PUBLIC_DIRECTUS_URL!)
    .with(rest())
    .with(staticToken(token))
  
  return userDirectus.request(readMe())
}
```

### 2. Role-Based Access Control

```typescript
export async function getContentByRole(userRole: string) {
  const filter: any = {
    status: {
      _eq: 'published'
    }
  }
  
  // Add role-specific filtering
  if (userRole !== 'admin') {
    filter.public = {
      _eq: true
    }
  }
  
  return directus.request(
    readItems('your_collection', {
      fields: ['*'],
      filter
    })
  )
}
```

## 📊 Performance Optimization

### 1. Field Selection

Always specify only needed fields:

```typescript
// Good: Specific fields
export async function getOptimizedContent() {
  return directus.request(
    readItems('your_collection', {
      fields: ['id', 'title', 'slug', 'date_created']
    })
  )
}

// Avoid: Selecting all fields
export async function getUnoptimizedContent() {
  return directus.request(
    readItems('your_collection', {
      fields: ['*'] // This loads all fields
    })
  )
}
```

### 2. Caching Strategy

```typescript
import { unstable_cache } from 'next/cache'

export const getCachedContent = unstable_cache(
  async () => {
    return directus.request(
      readItems('your_collection', {
        fields: ['*'],
        filter: {
          status: {
            _eq: 'published'
          }
        }
      })
    )
  },
  ['content-cache'], // Cache key
  {
    revalidate: 3600, // Revalidate every hour
    tags: ['content'] // Cache tags
  }
)
```

### 3. Batch Operations

```typescript
export async function getMultipleCollections(ids: string[]) {
  // Use Promise.all for parallel requests
  const results = await Promise.all(
    ids.map(id => 
      directus.request(
        readItems('your_collection', {
          fields: ['*'],
          filter: {
            id: {
              _eq: id
            }
          }
        })
      )
    )
  )
  
  return results.flat()
}
```

## 🧪 Testing

### 1. Mock Directus Client for Testing

```typescript
// __mocks__/directus.ts
export const mockDirectus = {
  request: jest.fn()
}

export default mockDirectus
```

### 2. API Route Testing

```typescript
// __tests__/api/your-endpoint.test.ts
import { GET } from '@/app/api/your-endpoint/route'
import { NextRequest } from 'next/server'

describe('/api/your-endpoint', () => {
  it('should return data successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/your-endpoint')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toBeDefined()
  })
})
```

## 📚 Best Practices

### 1. Type Safety

Always use TypeScript types:

```typescript
// Define your collection schema
interface YourCollection {
  id: string
  title: string
  content: string
  status: 'draft' | 'published'
  translations?: YourCollectionTranslation[]
}

// Use in API calls
export async function getTypedContent(): Promise<YourCollection[]> {
  return directus.request(
    readItems<YourCollection>('your_collection', {
      fields: ['*']
    })
  )
}
```

### 2. Consistent Error Responses

```typescript
export function createErrorResponse(message: string, status: number = 500) {
  return NextResponse.json(
    {
      error: message,
      timestamp: new Date().toISOString(),
      status
    },
    { status }
  )
}
```

### 3. API Documentation

Document your APIs with JSDoc:

```typescript
/**
 * Retrieves content by slug with translations
 * @param slug - The content slug
 * @param lang - Language code (default: 'en-US')
 * @returns Promise<ContentWithTranslations>
 */
export async function getContentBySlug(
  slug: string, 
  lang: string = 'en-US'
): Promise<ContentWithTranslations> {
  // Implementation
}
```

## 🚀 Deployment Considerations

### 1. Environment-Specific Configuration

```typescript
const getDirectusConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  return {
    url: process.env.NEXT_PUBLIC_DIRECTUS_URL!,
    token: process.env.NEXT_PUBLIC_DIRECTUS_TOKEN!,
    timeout: isDevelopment ? 30000 : 10000,
    retries: isDevelopment ? 3 : 1
  }
}
```

### 2. Health Checks

```typescript
// src/app/api/health/route.ts
export async function GET() {
  try {
    await directus.request(readMe())
    return NextResponse.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: 'Directus connection failed',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
}
```

## 📖 Resources

### Directus SDK Documentation
- [Directus SDK Docs](https://docs.directus.io/sdk/typescript/)
- [Query Examples](https://docs.directus.io/reference/query/)
- [Authentication](https://docs.directus.io/sdk/authentication/)

### Next.js API Routes
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Request/Response](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#request)

### TypeScript
- [Directus TypeScript Types](https://docs.directus.io/sdk/typescript/#typescript-types)
- [Custom Schema Types](https://docs.directus.io/sdk/typescript/#custom-schema)

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Author**: Development Team
