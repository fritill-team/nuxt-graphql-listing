<script setup>
const props = defineProps({
  title: { type: String, required: false },
  filters: { type: Object, required: true },
  config: { type: Array, required: true },
  facets: { type: [Object, null], required: false }
});
const emit = defineEmits(["change"]);
function onRendererChange(next) {
  emit("change", next);
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
