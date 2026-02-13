<script setup lang="ts">
import type { FilterFieldConfig, FieldKeyedFacets } from "../../../types/listing";
const props = withDefaults(defineProps<{
  title?: string
  filters: Record<string, any>
  config: FilterFieldConfig[]
  facets?: FieldKeyedFacets | null
}>(), {
  title: undefined,
  facets: undefined
});
const emit = defineEmits<{
  change: [patch: Record<string, any>]
}>();
function onRendererChange(patch: Record<string, any>): void {
  emit("change", patch);
}
</script>

<template>
  <aside role="complementary" aria-label="Filters" class="hidden md:block md:col-span-3">
    <div class="sticky top-4 h-[calc(100vh-2rem)]">
      <ListingFiltersRenderer
        :filters="filters"
        :config="config"
        :facets="facets"
        @change="onRendererChange"
      />
    </div>
  </aside>
</template>
