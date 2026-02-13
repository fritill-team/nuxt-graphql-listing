<script setup lang="ts">
import type {CoursesQuery} from '~/generated/graphql' // adjust path

const {locale} = useI18n()

const {
  items,
  total,
  offset,
  limit,
  filters,
  sort,
  facets,
  loading,
  error,
  setFilter,
  setSort,
  setOffset,
} = useCoursesListing()

const filterConfig = useCourseFilterConfig()
const sortConfig = useCourseSortConfig()

type CourseItem = CoursesQuery['courses']['items'][number]

const pickTranslation = (course: CourseItem, lang: string) => {
  const t = course.translations || []
  return t.find(x => x?.language === lang) ?? t[0] ?? null
}

const pickAsset = (course: CourseItem) => {
  const assets = course.assets || []
  return (
    assets.find(a => a?.assetType === 'COVER') ??
    assets.find(a => a?.assetType === 'THUMBNAIL') ??
    assets[0] ??
    null
  )
}

const pickPrice = (course: CourseItem) => {
  const prices = course.prices || []
  return prices[0] ?? null
}

const formatDuration = (seconds: number) => {
  const s = Math.max(0, seconds || 0)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

// If your backend returns assetId only, you probably already have a helper for urls.
// Replace this with YOUR media url builder.
const assetUrl = (assetId: string) => `/api/assets/${assetId}` // <- adjust
</script>

<template>
  <ListingLayout
    :items="items"
    :total="total"
    :offset="offset"
    :limit="limit"
    :filters="filters"
    :filters-config="filterConfig"
    :facets="facets"
    :sort="sort"
    :sort-config="sortConfig"
    :loading="loading"
    :error="error"
    sort-label="Sort By"
    @update:filters="setFilter"
    @update:sort="setSort"
    @update:offset="setOffset"
    has-grid-switch
    condensed
  >
    <template #top-bar-start>
      <h1 class="text-2xl font-bold">Courses</h1>
    </template>

    <template #content="{ items: courses, viewMode }">
      <!-- LOADING SKELETONS -->
      <div v-if="loading" class="grid gap-4"
           :class="viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'">
        <UCard v-for="i in 6" :key="i" class="overflow-hidden">
          <div class="h-36 w-full bg-gray-100 dark:bg-gray-800 animate-pulse"/>
          <div class="p-4 space-y-3">
            <div class="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"/>
            <div class="h-4 w-1/2 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"/>
            <div class="h-8 w-28 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"/>
          </div>
        </UCard>
      </div>

      <!-- EMPTY STATE -->
      <div v-else-if="!courses?.length" class="py-12 text-center text-gray-500">
        No courses found.
      </div>

      <!-- GRID VIEW -->
      <div
        v-else-if="viewMode === 'grid'"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <UCard
          v-for="course in courses"
          :key="course.id"
          class="overflow-hidden"
        >
          <template #header>
            <div class="relative">
              <img
                src="https://random.imagecdn.app/v1/image?width=500&height=150"
                class="h-36 w-full object-cover"
                alt=""
              />

              <div class="absolute top-3 left-3 flex gap-2">
                <UBadge v-if="course.isLive" color="red" variant="solid">Live</UBadge>
                <UBadge v-if="pickPrice(course)?.isFree" color="green" variant="solid">Free</UBadge>
                <UBadge
                  v-else-if="pickPrice(course)?.hasDiscount"
                  color="orange"
                  variant="solid"
                >
                  -{{ pickPrice(course)?.discountPercentage ?? 0 }}%
                </UBadge>
              </div>
            </div>
          </template>

          <div class="space-y-3">
            <div class="space-y-1">
              <p class="text-sm text-gray-500">
                {{
                  course.category?.translations?.find(t => t?.language === locale)?.name
                  ?? course.category?.translations?.[0]?.name
                  ?? 'Uncategorized'
                }}
              </p>

              <h3 class="font-semibold leading-snug line-clamp-2">
                {{ pickTranslation(course, locale)?.title ?? 'Untitled course' }}
              </h3>
            </div>

            <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <div class="flex items-center gap-2">
                  <span v-if="course.rating != null" class="flex items-center gap-1">
                    <UIcon name="i-heroicons-star-solid" class="w-4 h-4"/>
                    {{ course.rating }}
                    <span class="text-gray-400">({{ course.reviewsCount ?? 0 }})</span>
                  </span>
                <span v-else class="text-gray-400">No ratings</span>
              </div>

              <span class="text-gray-500">
                  {{ formatDuration(course.durationSeconds) }}
                </span>
            </div>

            <div class="flex items-center justify-between">
              <div class="text-sm">
                <template v-if="pickPrice(course)?.isFree">
                  <span class="font-semibold">Free</span>
                </template>

                <template v-else>
                    <span class="font-semibold">
                      {{ pickPrice(course)?.displayPrice }}
                      {{ pickPrice(course)?.currency }}
                    </span>

                  <span
                    v-if="pickPrice(course)?.hasDiscount && pickPrice(course)?.compareAtPrice"
                    class="ml-2 text-gray-400 line-through"
                  >
                      {{ pickPrice(course)?.compareAtPrice }}
                      {{ pickPrice(course)?.currency }}
                    </span>
                </template>
              </div>



            </div>
          </div>
        </UCard>
      </div>

      <!-- LIST VIEW -->
      <div v-else class="space-y-3">
        <UCard v-for="course in courses" :key="course.id">
          <div class="flex gap-4">
            <div class="w-28 shrink-0">
              <img
                src="https://random.imagecdn.app/v1/image?width=500&height=150"
                class="h-20 w-28 object-cover rounded-lg"
                alt=""
              />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <h3 class="font-semibold line-clamp-1">
                    {{ pickTranslation(course, locale)?.title ?? 'Untitled course' }}
                  </h3>
                  <p class="text-sm text-gray-500 line-clamp-1">
                    {{
                      course.category?.translations?.find(t => t?.language === locale)?.name
                      ?? course.category?.translations?.[0]?.name
                      ?? 'Uncategorized'
                    }}
                    • {{ course.numberOfLessons }} lessons
                    • {{ formatDuration(course.durationSeconds) }}
                  </p>
                </div>

                <div class="text-right">
                  <p class="text-sm font-semibold">
                    <span v-if="pickPrice(course)?.isFree">Free</span>
                    <span v-else>
                        {{ pickPrice(course)?.displayPrice }} {{ pickPrice(course)?.currency }}
                      </span>
                  </p>
                  <p v-if="pickPrice(course)?.hasDiscount && pickPrice(course)?.compareAtPrice"
                     class="text-xs text-gray-400 line-through">
                    {{ pickPrice(course)?.compareAtPrice }} {{ pickPrice(course)?.currency }}
                  </p>
                </div>
              </div>

              <div class="mt-3 flex items-center justify-between">
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <UBadge v-if="course.isLive" color="red" variant="soft">Live</UBadge>
                  <UBadge v-if="pickPrice(course)?.isFree" color="green" variant="soft">Free</UBadge>
                  <span v-if="course.rating != null" class="flex items-center gap-1">
                      <UIcon name="i-heroicons-star-solid" class="w-4 h-4"/>
                      {{ course.rating }}
                      <span class="text-gray-400">({{ course.reviewsCount ?? 0 }})</span>
                    </span>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </ListingLayout>
</template>
