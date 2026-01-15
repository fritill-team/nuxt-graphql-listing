<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()

const slug = computed(() => {
  const s = route.params.slug
  if (Array.isArray(s) && s.length > 0) {
    return '/' + s.join('/')
  }
  return '/'
})

const { data: page } = await useAsyncData(`docs-${slug.value}`, () =>
  queryCollection('content').path(slug.value).first()
)

const { data: navigation } = await useAsyncData('docs-navigation', () =>
  queryCollection('content').order('order', 'ASC').all()
)

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description
})

function getNavPath(itemPath: string) {
  return localePath(itemPath === '/' ? '/docs' : '/docs' + itemPath)
}

function getNavTitle(item: any) {
  return item.navTitle || item.title
}
</script>

<template>
  <div class="w-full py-8">
    <div class="flex gap-8">
      <!-- Sidebar Navigation -->
      <aside class="w-64 shrink-0 hidden lg:block">
        <nav class="sticky top-8">
          <h2 class="font-semibold text-lg mb-4">Documentation</h2>
          <ul class="space-y-1">
            <li v-for="item in navigation" :key="item.path">
              <NuxtLink
                :to="getNavPath(item.path)"
                class="block px-3 py-2 rounded-md transition-colors text-sm"
                :class="slug === item.path
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 font-medium'
                  : 'text-muted hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-foreground'"
              >
                {{ getNavTitle(item) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Mobile Navigation -->
      <div class="lg:hidden mb-6 w-full">
        <USelect
          :model-value="slug"
          :items="navigation?.map(item => ({
            label: getNavTitle(item),
            value: item.path
          })) || []"
          placeholder="Select page"
          class="w-full"
          @update:model-value="(val) => navigateTo(getNavPath(val as string))"
        />
      </div>

      <!-- Main Content -->
      <main class="flex-1 min-w-0">
        <article v-if="page" class="prose dark:prose-invert max-w-none">
          <ContentRenderer :value="page" />
        </article>
        <div v-else class="text-center py-16">
          <h1 class="text-2xl font-bold">Page not found</h1>
          <p class="mt-2 text-muted">The requested documentation page does not exist.</p>
          <NuxtLink :to="localePath('/docs')" class="mt-4 inline-block text-primary-500 hover:underline">
            Go to documentation home
          </NuxtLink>
        </div>
      </main>
    </div>
  </div>
</template>
