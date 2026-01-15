---
title: Examples
description: Complete code examples and recipes for common use cases with the Nuxt GraphQL Listing module.
order: 8
---

# Examples & Recipes

This page provides complete, copy-paste ready examples for common listing implementations.

## Basic Product Listing

A minimal product listing with filters and sorting.

### GraphQL Query

```graphql
# graphql/products.graphql
query Products($input: ProductListInput!) {
  products(input: $input) {
    items {
      id
      name
      price
      image
      rating
    }
    total
    facets {
      priceMin
      priceMax
    }
  }
}
```

### Composable

```ts
// composables/useProductsListing.ts
import { useListing, parseListingQuery, buildListingQuery, SortDirection } from '#imports'
import { ProductsDocument } from '~/generated/graphql'

export function useProductsListing() {
  const { $apollo } = useNuxtApp()

  const filterConfig = [
    {
      key: 'price',
      field: 'price',
      kind: 'decimal-range' as const,
      label: 'Price'
    },
    {
      key: 'rating',
      field: 'rating',
      kind: 'rating' as const,
      label: 'Rating'
    }
  ]

  const sortConfig = [
    { label: 'Newest', field: 'createdAt', direction: SortDirection.DESC },
    { label: 'Price: Low to High', field: 'price', direction: SortDirection.ASC },
    { label: 'Price: High to Low', field: 'price', direction: SortDirection.DESC },
    { label: 'Top Rated', field: 'rating', direction: SortDirection.DESC }
  ]

  const listing = useListing({
    queryDocument: ProductsDocument,
    apolloClient: $apollo,
    initialFilters: {
      priceMin: null,
      priceMax: null,
      rating: null
    },
    initialSort: [{ field: 'createdAt', direction: SortDirection.DESC }],
    initialLimit: 24,
    parseQuery: (q) => parseListingQuery(q, filterConfig),
    buildQuery: (s) => buildListingQuery(s, filterConfig),
    buildVariables: (state) => ({
      input: {
        filter: {
          price: {
            gte: state.filters.priceMin,
            lte: state.filters.priceMax
          },
          rating: state.filters.rating ? { gte: state.filters.rating } : null
        },
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

  return { ...listing, filterConfig, sortConfig }
}
```

### Page Component

```vue
<!-- pages/products.vue -->
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
  >
    <template #content="{ items, viewMode }">
      <div :class="viewMode === 'grid' ? 'grid grid-cols-4 gap-4' : 'space-y-4'">
        <ProductCard v-for="item in items" :key="item.id" :product="item" />
      </div>
    </template>
  </ListingLayout>
</template>

<script setup lang="ts">
const {
  items, total, loading, error, filters, sort, offset, limit, facets,
  setFilter, setSort, setOffset, filterConfig, sortConfig
} = useProductsListing()
</script>
```

## E-commerce with Categories

Full e-commerce listing with category tree and multiple filters.

### Filter Configuration

```ts
// composables/useShopFilterConfig.ts
export function useShopFilterConfig() {
  return [
    // Quick filters at top
    {
      key: 'quick-filters',
      kind: 'switch-group' as const,
      label: '',
      switches: [
        { field: 'inStock', label: 'In Stock' },
        { field: 'onSale', label: 'On Sale' },
        { field: 'freeShipping', label: 'Free Shipping' }
      ]
    },
    { key: 'sep-1', kind: 'separator' as const, label: '' },

    // Category tree
    {
      key: 'category',
      field: 'categoryId',
      kind: 'category-tree' as const,
      label: 'Categories'
    },
    { key: 'sep-2', kind: 'separator' as const, label: '' },

    // Price range
    {
      key: 'price',
      field: 'price',
      kind: 'decimal-range' as const,
      label: 'Price'
    },

    // Brand select
    {
      key: 'brand',
      field: 'brandId',
      kind: 'select' as const,
      label: 'Brand',
      options: [] // Populated dynamically
    },

    // Rating
    {
      key: 'rating',
      field: 'rating',
      kind: 'rating' as const,
      label: 'Customer Rating'
    },

    // Tags
    {
      key: 'tags',
      field: 'tags',
      kind: 'switch-multi' as const,
      label: 'Product Tags',
      options: [
        { label: 'New Arrival', value: 'new' },
        { label: 'Best Seller', value: 'bestseller' },
        { label: 'Eco-Friendly', value: 'eco' }
      ]
    }
  ]
}
```

### GraphQL Query with Facets

```graphql
query ShopProducts($input: ShopProductsInput!) {
  shopProducts(input: $input) {
    items {
      id
      name
      slug
      price
      originalPrice
      images
      rating
      reviewCount
      inStock
      brand {
        id
        name
      }
    }
    total
    facets {
      priceMin
      priceMax
      categories {
        id
        name
        count
        children {
          id
          name
          count
        }
      }
      brands {
        id
        name
        count
      }
    }
  }
}
```

### Dynamic Brand Options

```ts
// composables/useShopListing.ts
export function useShopListing() {
  const filterConfig = useShopFilterConfig()

  // ... useListing setup

  // Update brand options from facets
  const dynamicFilterConfig = computed(() => {
    return filterConfig.map(f => {
      if (f.key === 'brand' && facets.value?.brands) {
        return {
          ...f,
          options: [
            { label: 'All Brands', value: null },
            ...facets.value.brands.map(b => ({
              label: `${b.name} (${b.count})`,
              value: b.id
            }))
          ]
        }
      }
      return f
    })
  })

  return { ...listing, filterConfig: dynamicFilterConfig }
}
```

## Course Listing (Playground Example)

The actual playground implementation for reference.

### Filter Config

```ts
// composables/useCourseFilterConfig.ts
export function useCourseFilterConfig(): FilterFieldConfig<string>[] {
  return [
    {
      key: 'meta-switches',
      kind: 'switch-group',
      label: '',
      switches: [
        { field: 'isLive', label: 'Live Courses' },
        { field: 'isFree', label: 'Free Courses' },
        { field: 'hasDiscount', label: 'Discounted' }
      ]
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
    }
  ]
}
```

### Sort Config

```ts
// composables/useCourseSortConfig.ts
export function useCourseSortConfig(): SortOption<string>[] {
  return [
    { label: 'Newest First', field: 'publishedAt', direction: SortDirection.DESC },
    { label: 'Oldest First', field: 'publishedAt', direction: SortDirection.ASC },
    { label: 'Price: High to Low', field: 'price', direction: SortDirection.DESC },
    { label: 'Price: Low to High', field: 'price', direction: SortDirection.ASC },
    { label: 'Top Rated', field: 'rating', direction: SortDirection.DESC },
    { label: 'Most Reviews', field: 'reviewCount', direction: SortDirection.DESC }
  ]
}
```

### Listing Composable

```ts
// composables/useCoursesListing.ts
export function useCoursesListing() {
  const { $courses } = useNuxtApp()
  const filterConfig = useCourseFilterConfig()
  const sortConfig = useCourseSortConfig()

  const defaultFilters = {
    isLive: null,
    isFree: null,
    hasDiscount: null,
    priceMin: null,
    priceMax: null,
    rating: null
  }

  return useListing({
    queryDocument: CoursesDocument,
    apolloClient: $courses,
    initialFilters: defaultFilters,
    initialSort: [{ field: 'publishedAt', direction: SortDirection.DESC }],
    initialOffset: 0,
    initialLimit: 20,
    urlBinding: true,
    parseQuery: (query) => parseListingQuery(query, filterConfig),
    buildQuery: (state) => buildListingQuery(state, filterConfig),
    buildVariables: (state) => ({
      input: {
        filter: {
          isLive: state.filters.isLive,
          isFree: state.filters.isFree,
          hasDiscount: state.filters.hasDiscount,
          price: {
            gte: state.filters.priceMin,
            lte: state.filters.priceMax
          },
          rating: state.filters.rating ? { gte: state.filters.rating } : null
        },
        sort: { fields: state.sort },
        limit: state.limit,
        offset: state.offset
      }
    }),
    mapResult: (data) => ({
      items: data.courses.items,
      total: data.courses.total,
      facets: data.courses.facets
    }),
    key: 'courses-listing'
  })
}
```

## Search with Text Input

Adding search functionality to a listing.

```ts
// composables/useSearchableListing.ts
export function useSearchableListing() {
  const searchQuery = ref('')
  const debouncedSearch = refDebounced(searchQuery, 300)

  const listing = useListing({
    // ... other options
    buildVariables: (state) => ({
      input: {
        filter: state.filters,
        search: debouncedSearch.value || undefined,
        sort: { fields: state.sort },
        limit: state.limit,
        offset: state.offset
      }
    })
  })

  // Reset to page 0 when search changes
  watch(debouncedSearch, () => {
    listing.setOffset(0)
  })

  return { ...listing, searchQuery }
}
```

```vue
<template>
  <div>
    <UInput
      v-model="searchQuery"
      placeholder="Search products..."
      icon="i-heroicons-magnifying-glass"
      class="mb-4"
    />
    <ListingLayout :items="items" ...>
      <!-- content -->
    </ListingLayout>
  </div>
</template>
```

## Server-Side Only (No URL Binding)

For embedded listings or widgets.

```ts
const listing = useListing({
  // ... other options
  urlBinding: false,  // Disable URL sync
  key: 'sidebar-products'  // Unique key for SSR
})
```

## Multiple Listings on One Page

Using unique keys for multiple listings.

```ts
// Featured products
const featured = useListing({
  // ... options
  key: 'featured-products',
  urlBinding: false,
  initialLimit: 4
})

// Main listing
const main = useListing({
  // ... options
  key: 'main-products',
  urlBinding: true
})
```

## Custom Loading State

```vue
<template>
  <ListingLayout :items="items" :loading="loading" ...>
    <template #loading>
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="i in 12"
          :key="i"
          class="animate-pulse"
        >
          <div class="bg-gray-200 aspect-square rounded-lg" />
          <div class="mt-2 h-4 bg-gray-200 rounded w-3/4" />
          <div class="mt-1 h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </template>
  </ListingLayout>
</template>
```

## Custom Pagination

```vue
<template>
  <ListingLayout :items="items" :total="total" :offset="offset" :limit="limit" ...>
    <template #content="{ items }">
      <!-- Items -->
      <div class="grid grid-cols-4 gap-4">
        <ProductCard v-for="item in items" :key="item.id" :product="item" />
      </div>

      <!-- Custom pagination -->
      <div class="mt-8 flex justify-center gap-2">
        <UButton
          :disabled="offset === 0"
          @click="setOffset(offset - limit)"
        >
          Previous
        </UButton>

        <span class="px-4 py-2">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <UButton
          :disabled="offset + limit >= total"
          @click="setOffset(offset + limit)"
        >
          Next
        </UButton>
      </div>
    </template>
  </ListingLayout>
</template>

<script setup lang="ts">
const currentPage = computed(() => Math.floor(offset.value / limit.value) + 1)
const totalPages = computed(() => Math.ceil(total.value / limit.value))
</script>
```

## Infinite Scroll

```ts
// composables/useInfiniteProducts.ts
export function useInfiniteProducts() {
  const allItems = ref<Product[]>([])

  const listing = useListing({
    // ... options
    urlBinding: false
  })

  // Append new items instead of replacing
  watch(() => listing.items.value, (newItems) => {
    if (listing.offset.value === 0) {
      allItems.value = newItems
    } else {
      allItems.value = [...allItems.value, ...newItems]
    }
  })

  function loadMore() {
    listing.setOffset(listing.offset.value + listing.limit.value)
  }

  const hasMore = computed(() =>
    allItems.value.length < listing.total.value
  )

  return {
    items: allItems,
    loading: listing.loading,
    hasMore,
    loadMore
  }
}
```

```vue
<template>
  <div>
    <div class="grid grid-cols-4 gap-4">
      <ProductCard v-for="item in items" :key="item.id" :product="item" />
    </div>

    <div v-if="hasMore" class="mt-8 text-center">
      <UButton :loading="loading" @click="loadMore">
        Load More
      </UButton>
    </div>
  </div>
</template>
```

## TypeScript Types Reference

```ts
// types/listing.ts
import type { SortDirection } from '#imports'

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  category: {
    id: string
    name: string
  }
  brand: {
    id: string
    name: string
  }
}

export interface ProductFilters {
  categoryId: string | null
  brandId: string | null
  priceMin: number | null
  priceMax: number | null
  rating: number | null
  inStock: boolean | null
  onSale: boolean | null
  tags: string[]
}

export type ProductSort = Array<{
  field: string
  direction: SortDirection
}>

export interface ProductFacets {
  priceMin: number
  priceMax: number
  categories: CategoryFacet[]
  brands: BrandFacet[]
}

export interface CategoryFacet {
  id: string
  name: string
  count: number
  children?: CategoryFacet[]
}

export interface BrandFacet {
  id: string
  name: string
  count: number
}
```

## Next Steps

- Return to [Introduction](/docs) for overview
- See [Usage](/docs/usage) for API details
- Check [Components](/docs/components) for UI reference
