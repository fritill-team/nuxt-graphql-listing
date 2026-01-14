<script setup lang="ts" generic="TFilters, TFacets">
import ViewModeSwitch from "./ViewModeSwitch.vue";
import {computed} from "vue";
import Drawer from "./Filters/Drawer.vue";
import Sort from "./Filters/Sort.vue";
import type {FilterFieldConfig} from "../../types/filterSchema";
import type {SortDirection, SortOption} from "../../types/sortSchema";
import {useOverlay} from "#imports";


type ViewMode = "list" | "grid"
type SortInput = { field: string; direction: SortDirection }

const props = withDefaults(defineProps<{
  hasGridSwitch?: boolean
  viewMode?: ViewMode
  sortConfig: SortOption<string>[]
  sort: Array<SortInput> | null
  sortLabel?: string
  filters: TFilters
  filtersConfig: FilterFieldConfig<string>[]
  facets?: TFacets | null
}>(), {
  viewMode: "grid",
  sort: null,
})

const emit = defineEmits<{
  (e: 'update:viewMode', value: ViewMode): void
  (e: 'update:sort', sort: Array<SortInput>): void
  (e: 'update:filters', filters: Partial<TFilters>): void
}>()
const viewMode = computed({
  get: () => props.viewMode,
  set: (v) => emit('update:viewMode', v)
})

const overlay = useOverlay()
const filtersDrawer = overlay.create(Drawer)

const openDrawer = async () => {
  const instance = filtersDrawer.open({
    filters: props.filters,
    config: props.filtersConfig,
    facets: props.facets,
  })

  const result = await instance.result
  if (result.applied) {
    emit('update:filters', result.filters as Partial<TFilters>)
  }
}

const onSort = (newSort: Array<SortInput>): void => emit('update:sort', newSort)
</script>

<template>
  <div class="flex items-center justify-between">
    <slot name="start"></slot>


    <!-- Toggle button (mobile only) -->
    <div class="flex items-center gap-2">
      <slot name="before-end"/>
      <ViewModeSwitch v-if="hasGridSwitch"
                      v-model="viewMode"
                      :label="$t('listing.toggleViewMode')"/>
      <UButton
        icon="i-lucide-filter"
        size="lg"
        color="primary"
        variant="outline"
        class="visible lg:hidden rounded-full"
        @click="openDrawer"
      />
      <Sort
        :options="sortConfig"
        :sort="sort"
        :label="sortLabel"
        @change="onSort"
      />
      <slot name="end"/>
    </div>
  </div>
</template>
