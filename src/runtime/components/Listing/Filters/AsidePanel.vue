<script setup lang="ts">
import type {FilterFieldConfig} from "../../../types/listing"

const props = withDefaults(defineProps<{
  title?: string
  filters: Record<string, any>
  config: FilterFieldConfig<string>[]
  // Optional facets from API
  facets?: Record<string, any> | null
}>(), {});

const emit = defineEmits<{
  (e: "change", patch: Record<string, any>): void
}>()

function onRendererChange(next: Record<string, any>) {
  emit("change", next)
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
