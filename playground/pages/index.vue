<script setup lang="ts">
const localePath = useLocalePath()

useSeoMeta({
  title: 'Nuxt GraphQL Listing',
  description: 'A comprehensive Nuxt module for building production-ready listing interfaces with GraphQL integration.'
})
</script>

<template>
  <div class="w-full max-w-4xl mx-auto py-16">
    <div class="text-center">
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
        Nuxt GraphQL Listing
      </h1>
      <p class="mt-6 text-lg text-muted leading-8">
        A powerful Nuxt module for building production-ready listing interfaces with GraphQL integration,
        featuring advanced filtering, sorting, pagination, and automatic URL state management.
      </p>
      <div class="mt-10 flex items-center justify-center gap-4">
        <UButton :to="localePath('/docs')" size="lg">
          Read the Docs
        </UButton>
        <UButton :to="localePath('/playground')" variant="outline" size="lg">
          View Playground
        </UButton>
      </div>
    </div>

    <div class="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="p-6 rounded-lg border border-default">
        <div class="text-primary-500 mb-3">
          <UIcon name="i-lucide-database" class="w-8 h-8" />
        </div>
        <h3 class="font-semibold text-lg">GraphQL-Native</h3>
        <p class="mt-2 text-sm text-muted">
          Built for Apollo Client with flexible variable building and response mapping.
        </p>
      </div>

      <div class="p-6 rounded-lg border border-default">
        <div class="text-primary-500 mb-3">
          <UIcon name="i-lucide-filter" class="w-8 h-8" />
        </div>
        <h3 class="font-semibold text-lg">Advanced Filtering</h3>
        <p class="mt-2 text-sm text-muted">
          12 filter control types including ranges, switches, ratings, and category trees.
        </p>
      </div>

      <div class="p-6 rounded-lg border border-default">
        <div class="text-primary-500 mb-3">
          <UIcon name="i-lucide-link" class="w-8 h-8" />
        </div>
        <h3 class="font-semibold text-lg">URL State Management</h3>
        <p class="mt-2 text-sm text-muted">
          Automatic bi-directional sync between listing state and URL parameters.
        </p>
      </div>

      <div class="p-6 rounded-lg border border-default">
        <div class="text-primary-500 mb-3">
          <UIcon name="i-lucide-smartphone" class="w-8 h-8" />
        </div>
        <h3 class="font-semibold text-lg">Responsive UI</h3>
        <p class="mt-2 text-sm text-muted">
          Desktop sidebar filters with mobile drawer support out of the box.
        </p>
      </div>

      <div class="p-6 rounded-lg border border-default">
        <div class="text-primary-500 mb-3">
          <UIcon name="i-lucide-server" class="w-8 h-8" />
        </div>
        <h3 class="font-semibold text-lg">SSR-Ready</h3>
        <p class="mt-2 text-sm text-muted">
          Full server-side rendering support via Nuxt's useAsyncData.
        </p>
      </div>

      <div class="p-6 rounded-lg border border-default">
        <div class="text-primary-500 mb-3">
          <UIcon name="i-lucide-globe" class="w-8 h-8" />
        </div>
        <h3 class="font-semibold text-lg">i18n Support</h3>
        <p class="mt-2 text-sm text-muted">
          Built-in localization for English and Arabic with RTL support.
        </p>
      </div>
    </div>
  </div>
</template>
