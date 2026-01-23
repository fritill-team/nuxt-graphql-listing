---
title: Usage
description: Complete API reference for the useListing composable - the core of the Nuxt GraphQL Listing module.
order: 3
---

# useListing Composable

The `useListing` composable is the heart of the module. It manages the complete listing lifecycle: GraphQL querying, filtering, sorting, pagination, and URL state synchronization.

## Basic Usage

```ts
import { useListing } from '#imports'
import { ProductsDocument } from '~/generated/graphql'

const listing = useListing({
  // Required options
  queryDocument: ProductsDocument,
  apolloClient: apolloClient,
  initialFilters: { category: null },
  initialSort: [{ field: 'createdAt', direction: SortDirection.DESC }],
  buildVariables: (state) => ({
    input: {
      filter: state.filters,
      sort: { fields: state.sort },
      limit: state.limit,
      offset: state.offset
    }
  }),
  mapResult: (data) => ({
    items: data.products.items,
    total: data.products.total,
    facets: data.products.facets
  })
})
```

## Type Parameters

The composable accepts six generic type parameters for full type safety:

```ts
useListing<Item, RawData, Variables, Filters, Sort, Facets>(options)
```

| Parameter | Description |
|-----------|-------------|
| `Item` | Type of each item in the listing |
| `RawData` | Raw GraphQL response type |
| `Variables` | GraphQL query variables type |
| `Filters` | Filter state shape |
| `Sort` | Sort state shape |
| `Facets` | Facets/aggregations type |

### Example with Types

```ts
interface Product {
  id: string
  name: string
  price: number
}

interface ProductFilters {
  category: string | null
  priceMin: number | null
  priceMax: number | null
}

type ProductSort = Array<{ field: string; direction: SortDirection }>

interface ProductFacets {
  priceMin: number
  priceMax: number
  categories: Array<{ id: string; name: string; count: number }>
}

const listing = useListing<
  Product,
  ProductsQueryResponse,
  ProductsQueryVariables,
  ProductFilters,
  ProductSort,
  ProductFacets
>({
  // ... options
})
```

## Configuration Options

### Required Options

| Option | Type | Description |
|--------|------|-------------|
| `queryDocument` | `DocumentNode` | GraphQL query document |
| `apolloClient` | `ApolloClient` | Apollo Client instance |
| `initialFilters` | `Partial<Filters>` | Initial filter values |
| `initialSort` | `Sort` | Initial sort configuration |
| `buildVariables` | `(state: ListingState) => Variables` | Function to convert state to GraphQL variables |
| `mapResult` | `(data: RawData) => ListingResult<Item, Facets>` | Function to map GraphQL response |

### Optional Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialOffset` | `number` | `0` | Starting page offset |
| `initialLimit` | `number` | `20` | Items per page |
| `urlBinding` | `boolean` | `true` | Enable URL state synchronization |
| `parseQuery` | `(query: Record<string, any>) => Partial<ListingState>` | - | Custom URL query parser |
| `buildQuery` | `(state: ListingState) => Record<string, any>` | - | Custom URL query builder |
| `key` | `string` | `'listing'` | Unique key for `useAsyncData` |
| `sortMode` | `'array' \| 'keyed'` | `'array'` | Sort serialization format |

## Return Value

The composable returns an object with reactive refs and action methods:

### Data Refs

```ts
const {
  items,    // Ref<Item[]> - Current page items
  total,    // Ref<number> - Total matching items
  facets    // Ref<Facets | null | undefined> - Aggregation data
} = listing
```

### State Refs

```ts
const {
  offset,   // Ref<number> - Current page offset
  limit,    // Ref<number> - Items per page
  filters,  // Ref<Filters> - Active filters
  sort      // Ref<Sort> - Sort configuration
} = listing
```

### Status Refs

```ts
const {
  loading,  // Ref<boolean> - Fetch in progress
  error     // Ref<Error | null> - Any error
} = listing
```

### Action Methods

```ts
// Update filters (resets to page 0)
listing.setFilter({ category: 'electronics', priceMin: 100 })

// Change sort order (resets to page 0)
listing.setSort([{ field: 'price', direction: SortDirection.ASC }])

// Navigate to a specific offset
listing.setOffset(20)

// Change page size
listing.setLimit(50)

// Re-fetch current data
await listing.refetch()
```

## URL State Binding

When `urlBinding: true`, the listing state automatically syncs with URL query parameters.

### Default Behavior

```
/products?offset=20&limit=10&sort=price:ASC&category=electronics
```

### Custom Parsing and Building

For complex filter schemas, provide custom `parseQuery` and `buildQuery` functions:

```ts
import { parseListingQuery, buildListingQuery } from '#imports'

const filterConfig = [
  { key: 'category', field: 'category', kind: 'select', label: 'Category' },
  { key: 'price', field: 'price', kind: 'decimal-range', label: 'Price' }
]

const listing = useListing({
  // ... other options
  urlBinding: true,
  parseQuery: (query) => parseListingQuery(query, filterConfig),
  buildQuery: (state) => buildListingQuery(state, filterConfig)
})
```

## Request Optimization

The composable automatically optimizes GraphQL requests by omitting empty values:

- **Empty filters**: If all filter values are `null`, `undefined`, empty strings, or empty arrays/objects, the `filters` key is omitted from the request
- **Empty sort**: If no sort is specified (empty array), the `sort` key is omitted from the request

This keeps your GraphQL requests clean and avoids sending unnecessary data:

```ts
// When filters and sort are empty
variables = { input: { offset: 0, limit: 20 } }

// When filters have values
variables = {
  input: {
    offset: 0,
    limit: 20,
    filters: { category: 'electronics' },
    sort: { price: 'ASC' }
  }
}
```

## Sort Modes

The module supports two sort serialization formats:

### Array Mode (Default)

```ts
// Internal state
sort: [
  { field: 'price', direction: 'ASC' },
  { field: 'createdAt', direction: 'DESC' }
]

// URL: ?sort=price:ASC,createdAt:DESC
```

### Keyed Mode

```ts
// When sortMode: 'keyed'
// Internal state converted for GraphQL
{
  price: 'ASC',
  createdAt: 'DESC'
}
```

## Complete Example

```ts
// composables/useProductsListing.ts
import { useListing, parseListingQuery, buildListingQuery } from '#imports'
import { ProductsDocument } from '~/generated/graphql'
import type { Product, ProductFilters, ProductSort, ProductFacets } from '~/types'

export function useProductsListing() {
  const { $apollo } = useNuxtApp()

  const filterConfig = [
    {
      key: 'category',
      field: 'categoryId',
      kind: 'select',
      label: 'Category',
      options: []
    },
    {
      key: 'price',
      field: 'price',
      kind: 'decimal-range',
      label: 'Price'
    },
    {
      key: 'rating',
      field: 'rating',
      kind: 'rating',
      label: 'Rating'
    },
    {
      key: 'flags',
      kind: 'switch-group',
      label: '',
      switches: [
        { field: 'inStock', label: 'In Stock' },
        { field: 'onSale', label: 'On Sale' }
      ]
    }
  ]

  const defaultFilters: ProductFilters = {
    categoryId: null,
    priceMin: null,
    priceMax: null,
    rating: null,
    inStock: null,
    onSale: null
  }

  const defaultSort: ProductSort = [
    { field: 'createdAt', direction: SortDirection.DESC }
  ]

  return useListing<
    Product,
    ProductsQueryResponse,
    ProductsQueryVariables,
    ProductFilters,
    ProductSort,
    ProductFacets
  >({
    queryDocument: ProductsDocument,
    apolloClient: $apollo,
    initialFilters: defaultFilters,
    initialSort: defaultSort,
    initialOffset: 0,
    initialLimit: 24,
    urlBinding: true,
    parseQuery: (query) => parseListingQuery(query, filterConfig),
    buildQuery: (state) => buildListingQuery(state, filterConfig),
    buildVariables: (state) => ({
      input: {
        filter: {
          categoryId: state.filters.categoryId,
          price: {
            gte: state.filters.priceMin,
            lte: state.filters.priceMax
          },
          rating: state.filters.rating ? { gte: state.filters.rating } : null,
          inStock: state.filters.inStock,
          onSale: state.filters.onSale
        },
        sort: { fields: state.sort },
        limit: state.limit,
        offset: state.offset,
        search: state.search
      }
    }),
    mapResult: (data) => ({
      items: data.products.items,
      total: data.products.total,
      facets: data.products.facets
    }),
    key: 'products-listing'
  })
}
```

## Usage in Components

```vue
<template>
  <ListingLayout
    :items="items"
    :total="total"
    :loading="loading"
    :error="error"
    :filters="filters"
    :filters-config="filterConfig"
    :sort="sort"
    :sort-config="sortConfig"
    :offset="offset"
    :limit="limit"
    :facets="facets"
    @filter-change="setFilter"
    @sort-change="setSort"
    @offset-change="setOffset"
    @limit-change="setLimit"
  >
    <template #content="{ items, viewMode }">
      <ProductGrid v-if="viewMode === 'grid'" :products="items" />
      <ProductList v-else :products="items" />
    </template>
  </ListingLayout>
</template>

<script setup lang="ts">
const {
  items,
  total,
  loading,
  error,
  filters,
  sort,
  offset,
  limit,
  facets,
  setFilter,
  setSort,
  setOffset,
  setLimit
} = useProductsListing()

const filterConfig = useProductFilterConfig()
const sortConfig = useProductSortConfig()
</script>
```

## Next Steps

- Learn about [filter configurations](/docs/filters)
- Explore [UI components](/docs/components)
- Understand [URL state management](/docs/url-state)
