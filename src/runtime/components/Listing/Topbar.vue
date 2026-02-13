<script setup lang="ts">
import ViewModeSwitch from "./ViewModeSwitch.vue";
import { computed } from "vue";
import Drawer from "./Filters/Drawer.vue";
import Sort from "./Filters/Sort.vue";
import { useOverlay } from "#imports";
import { useListingI18n } from "../../composables";
import type { SortOption, SortInput, FilterFieldConfig, FieldKeyedFacets } from "../../types/listing";
const props = withDefaults(defineProps<{
  hasGridSwitch?: boolean
  viewMode?: string
  sortConfig: SortOption[]
  sort?: SortInput[] | null
  sortLabel?: string
  filters: Record<string, any>
  filtersConfig: FilterFieldConfig[]
  facets?: FieldKeyedFacets | null
  condensed?: boolean
}>(), {
  hasGridSwitch: false,
  viewMode: "grid",
  sort: null,
  sortLabel: undefined,
  facets: undefined,
  condensed: false
});
const emit = defineEmits<{
  'update:viewMode': [value: string]
  'update:sort': [value: SortInput[]]
  'update:filters': [value: Record<string, any>]
}>();
const { t } = useListingI18n();
const viewMode = computed({
  get: () => props.viewMode,
  set: (v) => emit("update:viewMode", v)
});
const overlay = useOverlay();
const filtersDrawer = overlay.create(Drawer);
const openDrawer = async () => {
  const instance = filtersDrawer.open({
    filters: props.filters,
    config: props.filtersConfig,
    facets: props.facets
  });
  const result = await instance.result;
  if (result.applied && result.filters) {
    emit("update:filters", result.filters);
  }
};
const onSort = (newSort) => emit("update:sort", newSort);
</script>

<template>
  <div class="flex items-center justify-between">
    <slot name="start"></slot>

    <!-- Toggle button (mobile only) -->
    <div class="flex items-center gap-2">
      <slot name="before-end"/>
      <ViewModeSwitch v-if="hasGridSwitch"
                      v-model="viewMode"
                      :label="t('listing.toggleViewMode')"/>
      <UButton
        v-if="filtersConfig.length > 0"
        icon="i-lucide-filter"
        size="lg"
        color="primary"
        variant="outline"
        :class="['rounded-full', condensed ? '' : 'lg:hidden']"
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
