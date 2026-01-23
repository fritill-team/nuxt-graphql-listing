<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'

const route = useRoute()
const localePath = useLocalePath()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: localePath('/'),
    active: route.path === '/'
  }
  ,
  {
    label: 'Docs',
    to: localePath('/docs'),
    active: route.path === '/docs'
  },
  {
    label: 'Playground',
    active: route.path.startsWith('/playground'),
    children: [
      {label: 'Default Listing', to: localePath('/playground')},
      {label: 'Condensed Listing', to: localePath('/playground-condensed')},
    ]
  },
])
</script>

<template>
  <UHeader>
    <template #title>
      GraphQL Listing Module
    </template>

    <UNavigationMenu :items="items"/>

    <template #right>
      <UColorModeButton/>
    </template>
  </UHeader>
</template>
