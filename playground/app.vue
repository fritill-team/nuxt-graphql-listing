<script setup lang="ts">
import type {DropdownMenuItem, NavigationMenuItem} from "@nuxt/ui";

const {isAuthenticated, logout} = usePlaygroundAuth()
const route = useRoute()
const localePath = useLocalePath()

const handleSignOut = () => {
  logout()
  navigateTo(localePath('/auth'))
}

const items = computed<NavigationMenuItem[][]>(() => {
  if (route.path.endsWith('/auth') ) return []

  return [
    [
      {label: 'Docs', to: localePath('/docs')},
      {label: 'Playground', to: localePath('/playground')},
      isAuthenticated.value
        ? {label: 'Sign out', icon: 'i-lucide-log-out', onSelect: handleSignOut}
        : {label: 'Login', icon: 'i-lucide-log-out', to: localePath('/auth')},
    ],
  ]
})

const mobileMenuItems = computed<DropdownMenuItem[]>(() => {
  const group = items.value[0]
  return group
    ? group.map((item) => ({
      label: item.label,
      icon: item.icon,
      to: 'to' in item ? item.to : undefined,
      onSelect: 'onSelect' in item ? item.onSelect : undefined,
    }))
    : []
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        Graphql Listing
      </template>

      <template #right>
        <UNavigationMenu v-if="items.length" :items="items" highlight class="flex-1 hidden md:flex"/>
        <UDropdownMenu v-if="mobileMenuItems.length" :items="mobileMenuItems" class="md:hidden">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-menu"
            label="Menu"
          />
        </UDropdownMenu>
        <UColorModeButton/>
      </template>
    </UHeader>

    <UMain>
      <div
        class="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-full py-7 sm:max-w-(--ui-container) sm:mx-auto">
        <NuxtPage/>
      </div>
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs"/>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with Fritill • © {{ new Date().getFullYear() }}
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
