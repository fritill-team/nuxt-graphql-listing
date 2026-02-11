<script setup>
import Renderer from "./Renderer.vue";
import { ref, toRaw, watch } from "vue";
const props = defineProps({
  open: { type: Boolean, required: false, default: false },
  filters: { type: null, required: true },
  config: { type: Array, required: true },
  facets: { type: null, required: false }
});
const emit = defineEmits(["close"]);
const close = () => emit("close", { applied: false, filters: null });
const submit = () => {
  const nextFilters = cloneFilters(localFilters.value);
  emit("close", { applied: true, filters: nextFilters });
};
const cloneFilters = (value) => {
  const raw = toRaw(value);
  try {
    return structuredClone(raw);
  } catch {
    return JSON.parse(JSON.stringify(raw));
  }
};
const localFilters = ref(cloneFilters(props.filters));
const { t } = useListingI18n();
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      localFilters.value = cloneFilters(props.filters);
    }
  }
);
function onFieldChange(patch) {
  localFilters.value = {
    ...localFilters.value,
    ...patch
  };
}
</script>

<template>
  <USlideover
    :open="props.open"
    @update:open="(value) => {
  if (!value) close();
}"
    :title="t('listing.filters')"
  >
    <template #body>
      <Renderer
        :filters="localFilters"
        :config="props.config"
        :facets="props.facets"
        @change="onFieldChange"
      />
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton color="neutral" variant="ghost" :label="t('listing.cancel')" @click="close"/>
        <UButton :label="t('listing.apply')" color="primary" @click="submit"/>
      </div>
    </template>
  </USlideover>
</template>
