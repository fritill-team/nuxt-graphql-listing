---
title: Nuxt GraphQL Listing
description: A comprehensive Nuxt module for building production-ready listing interfaces with GraphQL integration, advanced filtering, sorting, and pagination.
navTitle: Introduction
order: 1
---

# Nuxt GraphQL Listing

A powerful Nuxt module that provides a complete listing/catalog solution with GraphQL integration, featuring advanced filtering, sorting, pagination, and automatic URL state management.

## Features

- **GraphQL-Native**: Built for Apollo Client with flexible variable building and response mapping
- **Advanced Filtering**: 12 filter control types including ranges, switches, ratings, and category trees
- **URL State Management**: Automatic bi-directional sync between listing state and URL parameters
- **Responsive UI**: Desktop sidebar filters with mobile drawer support
- **SSR-Ready**: Full server-side rendering support via Nuxt's `useAsyncData`
- **Type-Safe**: Complete TypeScript support across all APIs
- **i18n Support**: Built-in localization for English and Arabic
- **Facet Support**: Dynamic filter bounds from GraphQL aggregations

## Quick Example

```ts
const listing = useListing({
  queryDocument: ProductsDocument,
  apolloClient: apolloClient,
  initialFilters: { category: null, priceMin: null, priceMax: null },
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

// Access reactive data
const { items, total, loading, error } = listing

// Update filters
listing.setFilter({ category: 'electronics' })

// Change page
listing.setOffset(20)
```

## Documentation

| Page | Description |
|------|-------------|
| [Installation](/docs/installation) | How to install and configure the module |
| [Usage](/docs/usage) | Core `useListing` composable API reference |
| [Filters](/docs/filters) | Complete filter system documentation |
| [Components](/docs/components) | UI components reference |
| [URL State](/docs/url-state) | URL state management and serialization |
| [i18n](/docs/i18n) | Internationalization guide |
| [Examples](/docs/examples) | Code examples and recipes |

## Requirements

- Nuxt 3.x / 4.x
- Vue 3.x
- Apollo Client 4.x
- @nuxtjs/i18n
- @nuxt/ui

## License

MIT License - see the [LICENSE](https://github.com/fritill-team/nuxt-graphql-listing) file for details.
