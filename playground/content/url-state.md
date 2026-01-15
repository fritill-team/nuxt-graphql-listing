---
title: URL State
description: How URL state management works with automatic bi-directional sync between listing state and query parameters.
order: 6
---

# URL State Management

The module provides automatic bi-directional synchronization between listing state and URL query parameters. This enables shareable URLs, browser back/forward navigation, and bookmarkable search results.

## How It Works

When `urlBinding: true` (the default), the module:

1. **On Mount**: Reads URL query parameters and hydrates the listing state
2. **On State Change**: Updates URL query parameters to reflect current state
3. **On URL Change**: Listens for popstate events and updates state accordingly

```ts
const listing = useListing({
  // ... other options
  urlBinding: true,  // Enable URL sync (default)
})
```

## Default URL Format

Without custom parse/build functions, state is serialized as:

```
/products?offset=20&limit=10&sort=price:ASC,createdAt:DESC&categoryId=electronics&priceMin=10&priceMax=100
```

| Parameter | Format | Example |
|-----------|--------|---------|
| `offset` | Number | `offset=20` |
| `limit` | Number | `limit=10` |
| `sort` | `field:direction` (comma-separated) | `sort=price:ASC,name:DESC` |
| Filters | Varies by type | `categoryId=electronics` |

## URL State Helpers

The module provides two helper functions for custom URL serialization:

### parseListingQuery

Parses URL query parameters into listing state based on filter configuration.

```ts
import { parseListingQuery } from '#imports'

const state = parseListingQuery(route.query, filterConfig)
// Returns: { offset, limit, sort, filters, search }
```

### buildListingQuery

Builds URL query parameters from listing state.

```ts
import { buildListingQuery } from '#imports'

const query = buildListingQuery(state, filterConfig)
// Returns: { offset: '20', categoryId: 'electronics', priceMin: '10', ... }
```

## Custom Parse and Build Functions

For complex filter schemas, provide custom functions:

```ts
const filterConfig = [
  { key: 'category', field: 'categoryId', kind: 'select', label: 'Category' },
  { key: 'price', field: 'price', kind: 'decimal-range', label: 'Price' },
  { key: 'flags', kind: 'switch-group', switches: [
    { field: 'inStock', label: 'In Stock' },
    { field: 'onSale', label: 'On Sale' }
  ]}
]

const listing = useListing({
  // ... other options
  urlBinding: true,
  parseQuery: (query) => parseListingQuery(query, filterConfig),
  buildQuery: (state) => buildListingQuery(state, filterConfig)
})
```

## URL Serialization by Filter Type

### Select / Boolean Select

```ts
// State
{ categoryId: 'electronics' }
{ inStock: true }

// URL
?categoryId=electronics
?inStock=true
```

### Integer / Decimal Range

```ts
// State
{ priceMin: 10, priceMax: 100 }

// URL
?priceMin=10&priceMax=100
```

### DateTime Range

```ts
// State
{ createdAtFrom: '2024-01-01T00:00:00Z', createdAtTo: '2024-12-31T23:59:59Z' }

// URL
?createdAtFrom=2024-01-01&createdAtTo=2024-12-31
```

### Switch Group

Each switch becomes a separate parameter:

```ts
// State
{ isLive: true, isFree: null, hasDiscount: true }

// URL (null values omitted)
?isLive=true&hasDiscount=true
```

### Switch Multi (Array)

```ts
// State
{ tags: ['new', 'sale', 'featured'] }

// URL
?tags=new,sale,featured
```

### Rating

```ts
// State
{ rating: 4 }

// URL
?rating=4
```

### Category Tree

```ts
// State
{ categoryId: 'electronics-phones' }

// URL
?categoryId=electronics-phones
```

## Sort Serialization

Sort is serialized as comma-separated `field:direction` pairs:

```ts
// State
[
  { field: 'price', direction: 'ASC' },
  { field: 'createdAt', direction: 'DESC' }
]

// URL
?sort=price:ASC,createdAt:DESC
```

## Pagination State

```ts
// State
{ offset: 20, limit: 10 }

// URL
?offset=20&limit=10
```

## Disabling URL Binding

For embedded listings or when URL sync is not desired:

```ts
const listing = useListing({
  // ... other options
  urlBinding: false
})
```

## Manual URL Manipulation

You can manually read/write URL state:

```ts
const route = useRoute()
const router = useRouter()

// Read current state from URL
const currentState = parseListingQuery(route.query, filterConfig)

// Update URL without triggering listing refresh
router.replace({
  query: buildListingQuery(newState, filterConfig)
})
```

## Query Normalization

The module normalizes query parameters to prevent unnecessary updates:

- `undefined` values are removed
- Single-element arrays are flattened to strings
- Empty strings are treated as `null`

```ts
import { normalizeQuery } from '#imports'

// Before: { a: undefined, b: ['single'], c: '' }
// After:  { b: 'single' }
const normalized = normalizeQuery(query)
```

## Deep Comparison

State changes use deep comparison to prevent unnecessary URL updates:

```ts
import { deepEqual } from '#imports'

// Returns true if objects are deeply equal
deepEqual(oldState, newState)
```

## SSR Considerations

URL state is hydrated during server-side rendering:

1. Server reads query params from request URL
2. State is initialized with parsed values
3. Initial GraphQL query includes URL-derived state
4. Client hydrates with matching state (no flash)

## Example: Custom URL Format

For a completely custom URL format:

```ts
const listing = useListing({
  urlBinding: true,
  parseQuery: (query) => {
    // Custom parsing logic
    return {
      offset: parseInt(query.page || '1', 10) * 20 - 20,
      limit: 20,
      filters: {
        category: query.cat || null,
        minPrice: query.min ? parseFloat(query.min) : null,
        maxPrice: query.max ? parseFloat(query.max) : null
      },
      sort: query.order
        ? [{ field: query.order, direction: query.dir || 'ASC' }]
        : []
    }
  },
  buildQuery: (state) => {
    // Custom building logic
    const query: Record<string, string> = {}

    const page = Math.floor(state.offset / state.limit) + 1
    if (page > 1) query.page = String(page)

    if (state.filters.category) query.cat = state.filters.category
    if (state.filters.minPrice) query.min = String(state.filters.minPrice)
    if (state.filters.maxPrice) query.max = String(state.filters.maxPrice)

    if (state.sort?.[0]) {
      query.order = state.sort[0].field
      if (state.sort[0].direction !== 'ASC') {
        query.dir = state.sort[0].direction
      }
    }

    return query
  }
})

// Results in URLs like:
// /products?page=2&cat=electronics&min=10&max=100&order=price
```

## Best Practices

1. **Use meaningful parameter names**: `categoryId` is clearer than `c`
2. **Omit default values**: Don't include `page=1` or `limit=20` if they're defaults
3. **Keep URLs short**: Consider abbreviations for frequently-used parameters
4. **Handle invalid values**: Parse functions should gracefully handle malformed input
5. **Test with bookmarks**: Ensure bookmarked URLs restore state correctly

## Next Steps

- Configure [internationalization](/docs/i18n)
- See [Examples](/docs/examples) for complete implementations
