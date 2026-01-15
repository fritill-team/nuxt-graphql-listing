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

// Table of contents from page body
const toc = computed(() => page.value?.body?.toc?.links || [])

// Active heading tracking
const activeId = ref('')

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      })
    },
    {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0
    }
  )

  // Observe all headings
  document.querySelectorAll('article h2[id], article h3[id]').forEach((el) => {
    observer.observe(el)
  })

  onUnmounted(() => observer.disconnect())
})

function isActiveLink(id: string, children?: any[]): boolean {
  if (activeId.value === id) return true
  if (children) {
    return children.some(child => child.id === activeId.value)
  }
  return false
}
</script>

<template>
  <div class="w-full py-8">
    <div class="flex gap-8">
      <!-- Left Sidebar Navigation -->
      <aside class="w-56 shrink-0 hidden lg:block">
        <nav class="sticky top-24">
          <h2 class="font-semibold text-sm uppercase tracking-wide text-muted mb-4">Documentation</h2>
          <ul class="space-y-1">
            <li v-for="item in navigation" :key="item.path">
              <NuxtLink
                :to="getNavPath(item.path)"
                class="block px-3 py-1.5 rounded-md transition-colors text-sm"
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

      <!-- Right Sidebar - Table of Contents -->
      <aside v-if="toc.length > 0" class="w-56 shrink-0 hidden xl:block">
        <nav class="sticky top-24">
          <h2 class="font-semibold text-sm uppercase tracking-wide text-muted mb-4">On this page</h2>
          <ul class="space-y-1 text-sm">
            <li v-for="link in toc" :key="link.id">
              <a
                :href="`#${link.id}`"
                class="block py-1 transition-colors border-l-2 pl-3 -ml-px"
                :class="isActiveLink(link.id, link.children)
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-medium'
                  : 'border-transparent text-muted hover:text-foreground hover:border-gray-300 dark:hover:border-gray-600'"
              >
                {{ link.text }}
              </a>
              <!-- Nested links (h3) -->
              <ul v-if="link.children?.length" class="mt-1 space-y-1">
                <li v-for="child in link.children" :key="child.id">
                  <a
                    :href="`#${child.id}`"
                    class="block py-1 transition-colors border-l-2 pl-6 -ml-px text-[13px]"
                    :class="activeId === child.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-medium'
                      : 'border-transparent text-muted hover:text-foreground hover:border-gray-300 dark:hover:border-gray-600'"
                  >
                    {{ child.text }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  </div>
</template>
