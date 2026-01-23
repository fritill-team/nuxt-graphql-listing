<script setup lang="ts" generic="TItem, TFilters, TSort, TFacets">
import type {FilterFieldConfig, SortDirection, SortOption} from "../../types/listing";
import {computed, ref} from "vue"
import Topbar from "./Topbar.vue";
import {useListingI18n} from "../../composables/useListingI18n";

const props = defineProps<{
  // Filter
  filters: TFilters
  filtersConfig: FilterFieldConfig<string>[]
  facets?: TFacets | null

  // Sort
  sortConfig: SortOption<string>[]
  sort: Array<{ field: string; direction: SortDirection }> | null

  // Pagination
  total: number
  limit: number
  offset: number

  // Data
  items: TItem[]
  loading: boolean
  error: Error | null

  // Optional
  filtersTitle?: string
  sortLabel?: string

  hasGridSwitch?: boolean
  viewMode?: 'grid' | 'list'
  condensed?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:sort', sort: Array<{ field: string; direction: SortDirection }>): void
  (e: 'update:filters', filters: Partial<TFilters>): void
  (e: 'update:offset', offset: number): void
}>()

const {t} = useListingI18n()



const viewMode = ref(props.viewMode || 'grid')

const showSidebar = computed(() => !props.condensed && props.filtersConfig.length > 0)


// Pagination
const page = computed({
  get() {
    return Math.floor(props.offset / props.limit) + 1
  },
  set(newPage: number) {
    const safePage = newPage < 1 ? 1 : newPage
    emit('update:offset', (safePage - 1) * props.limit)
  },
})
const pageCount = computed(() => {
  if (!props.limit || props.limit <= 0) return 1
  if (!props.total || props.total <= 0) return 1
  return Math.ceil(props.total / props.limit)
})

const from = computed(() => {
  if (!props.total || props.total === 0) return 0
  return props.offset + 1
})

const to = computed(() => {
  if (!props.total || props.total === 0) return 0
  return Math.min(props.offset + props.items.length, props.total)
})


function onFilterChange(patch: Record<string, any>) {
  emit('update:filters', patch as Partial<TFilters>)
}


</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-12 w-full">
    <!-- Desktop Filters (md+) -->
    <LazyListingFiltersAsidePanel
      v-if="showSidebar"
      :filters="filters as any"
      :config="filtersConfig"
      :facets="facets as any"
      @change="onFilterChange"
    />

    <!-- Content -->
    <div :class="['space-y-4', showSidebar ? 'md:col-span-9' : 'md:col-span-12']">
      <!-- Title / Toolbar -->
      <slot name="header"/>

      <Topbar
        :sort-config="sortConfig"
        :sort="sort"
        :sort-label="sortLabel"
        :has-grid-switch="hasGridSwitch"
        :condensed="condensed"
        v-model:view-mode="viewMode"
        :filters="filters as any"
        :filters-config="filtersConfig"
        :facets="facets as any"
        @update:sort="emit('update:sort', $event)"
        @update:filters="emit('update:filters', $event)"
      >
        <template #start>
          <slot name="top-bar-start">
            <div class="font-semibold">Toolbar</div>
          </slot>
        </template>
      </Topbar>

      <!-- Content placeholder -->
      <div class="my-6">
        <!-- Error state -->
        <template v-if="error">
          <slot name="error" :error="error">
            <ListingErrorState
              :error="error"
              :title="t('listing.errorTitle')"
              :retry-text="t('listing.retry')"
              @retry="$emit('update:offset', 0)"
            />
          </slot>
        </template>

        <!-- Loading state -->
        <template v-else-if="loading">
          <slot name="loading">
            <ListingLoading/>
          </slot>
        </template>

        <!-- Empty state -->
        <template v-else-if="items.length === 0">
          <slot name="empty">
            <ListingEmpty
              :title="t('listing.empty.title')"
              :description="t('listing.empty.description')"
              :action-text="t('listing.empty.resetFilters')"
              @action="() => {
                    $emit('update:filters', {} as any)
                    $emit('update:offset', 0)
                  }"
            />
          </slot>
        </template>

        <!-- Normal content -->
        <template v-else>
          <slot
            name="content"
            :items="items"
            :total="total"
            :view-mode="viewMode"
          />
        </template>


        <div class="flex items-center justify-between gap-2 mt-6" v-if="!loading && items.length > 0">
          <div class="flex flex-wrap gap-2 text-sm text-neutral dark:text-gray-300 font-medium">
            <span v-text="t('listing.pagination', {page: page, pageCount: pageCount})"/>
            <span class="">•</span>
            <span v-if="!loading" v-text="t('listing.results', {from, to, total})"/>
          </div>
          <div class="flex gap-2">
            <UPagination
              v-model:page="page"
              :total="total"
              :items-per-page="limit"
              size="lg"
            />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
