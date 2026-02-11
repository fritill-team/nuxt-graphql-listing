<script setup>
import ViewModeSwitch from "./ViewModeSwitch.vue";
import { computed } from "vue";
import Drawer from "./Filters/Drawer.vue";
import Sort from "./Filters/Sort.vue";
import { useOverlay } from "#imports";
import { useListingI18n } from "../../composables";
const props = defineProps({
  hasGridSwitch: { type: Boolean, required: false },
  viewMode: { type: String, required: false, default: "grid" },
  sortConfig: { type: Array, required: true },
  sort: { type: [Array, null], required: false, default: null },
  sortLabel: { type: String, required: false },
  filters: { type: null, required: true },
  filtersConfig: { type: Array, required: true },
  facets: { type: null, required: false },
  condensed: { type: Boolean, required: false, default: false }
});
const emit = defineEmits(["update:viewMode", "update:sort", "update:filters"]);
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
  if (result.applied) {
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
