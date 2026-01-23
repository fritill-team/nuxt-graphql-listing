---
title: Installation
description: How to install and configure the Nuxt GraphQL Listing module in your application.
order: 2
---

# Installation

This guide covers how to install and configure the Nuxt GraphQL Listing module in your Nuxt application.

## Prerequisites

Before installing, ensure you have the following dependencies in your project:

```json
{
  "@apollo/client": "^4.0.9",
  "@nuxt/ui": "^4.2.0",
  "@nuxtjs/i18n": "^9.3.3",
  "graphql": "^16.12.0"
}
```

## Install the Package

::code-group
```bash [npm]
npm install @fritill-team/nuxt-graphql-listing
```

```bash [yarn]
yarn add @fritill-team/nuxt-graphql-listing
```

```bash [pnpm]
pnpm add @fritill-team/nuxt-graphql-listing
```
::

## Configure Nuxt

Add the module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: [
    '@fritill-team/nuxt-graphql-listing',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],

  // Module options (optional)
  graphqlListing: {
    components: true,  // Auto-register components (default: true)
    autoImports: true  // Auto-import composables (default: true)
  },

  // Required i18n configuration
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English' },
      { code: 'ar', name: 'Arabic', dir: 'rtl' }
    ]
  }
})
```

## Module Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `components` | `boolean` | `true` | Auto-register all listing components globally |
| `autoImports` | `boolean` | `true` | Auto-import composables (`useListing`, `useListingI18n`) |

## CSS / Tailwind Setup

The module's components use Tailwind CSS utility classes. To ensure all styles are included in your build, import the module's CSS file in your main stylesheet:

```css
/* assets/css/main.css */
@import "tailwindcss";
@import "@nuxt/ui";

/* Import the listing module's component styles */
@import "@fritill-team/nuxt-graphql-listing/style.css";
```

This `@source` directive tells Tailwind to scan the module's component files for utility classes, ensuring they're included in your CSS bundle.

## Apollo Client Setup

The module requires an Apollo Client instance. You can set this up in a Nuxt plugin:

```ts
// plugins/apollo.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { provideApolloClient } from '@vue/apollo-composable'

export default defineNuxtPlugin((nuxtApp) => {
  const httpLink = createHttpLink({
    uri: 'https://your-graphql-api.com/graphql'
  })

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network'
      }
    }
  })

  // Provide to Vue
  nuxtApp.vueApp.provide('apollo-client', apolloClient)

  // Also expose via useNuxtApp()
  return {
    provide: {
      apollo: apolloClient
    }
  }
})
```

## GraphQL Code Generation (Recommended)

For type-safe GraphQL operations, we recommend using GraphQL Code Generator:

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations
```

Create `codegen.ts`:

```ts
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://your-graphql-api.com/graphql',
  documents: ['./graphql/**/*.graphql'],
  generates: {
    './generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations'
      ]
    }
  }
}

export default config
```

Run code generation:

```bash
npx graphql-codegen
```

## Verify Installation

Create a simple test page to verify the installation:

```vue
<!-- pages/test-listing.vue -->
<template>
  <div>
    <p>Loading: {{ loading }}</p>
    <p>Total items: {{ total }}</p>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { $apollo } = useNuxtApp()

const { items, total, loading } = useListing({
  queryDocument: YourQueryDocument,
  apolloClient: $apollo,
  initialFilters: {},
  initialSort: [],
  buildVariables: (state) => ({ /* your variables */ }),
  mapResult: (data) => ({
    items: data.yourQuery.items,
    total: data.yourQuery.total
  })
})
</script>
```

## Next Steps

- Learn about the [useListing composable](/docs/usage)
- Configure [filters](/docs/filters) for your listing
- Explore [UI components](/docs/components)
