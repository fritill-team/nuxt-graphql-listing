<script setup lang="ts">
import { computed } from "vue";
import type { SelectFilterFieldConfig, OptionFacet } from "../../../../types/listing";
const props = withDefaults(defineProps<{
  field: SelectFilterFieldConfig
  filters: Record<string, any>
  facetOptions?: OptionFacet[] | null
}>(), {
  facetOptions: undefined
});
const emit = defineEmits<{
  change: [patch: Record<string, any>]
}>();
const value = computed({
  get() {
    return props.filters[props.field.field];
  },
  set(val) {
    emit("change", { [props.field.field]: val });
  }
});
const options = computed(() => {
  if (props.facetOptions?.length) {
    return props.facetOptions.map((opt) => ({
      label: opt.label ?? String(opt.value),
      value: opt.value
    }));
  }
  const raw = props.field.options ?? [];
  return raw.map((opt) => {
    if (typeof opt === "string" || typeof opt === "number" || typeof opt === "boolean" || typeof opt === "bigint") {
      return { label: String(opt), value: opt };
    }
    return {
      ...opt,
      label: opt.label ?? String(opt.value ?? ""),
      value: opt.value ?? opt.label
    };
  });
});
const countsByValue = computed(() => {
  const facets = props.facetOptions ?? [];
  const map = {};
  for (const f of facets) {
    map[String(f.value)] = Number(f.count ?? 0);
  }
  return map;
});
</script>

<template>
  <UFormField :label="field.label" size="sm" class="space-y-1">
    <USelect v-model="value" :items="options" class="w-full">
      <template #item="{ item }">
        <span>{{ item?.label }}</span>

        <!-- show counts only when facets exist and count for this item exists -->
        <span
          v-if="facetOptions?.length && countsByValue[String(item?.value)] != null"
          class="text-neutral-400 ms-1"
        >
          ({{ countsByValue[String(item?.value)] }})
        </span>
      </template>
    </USelect>
  </UFormField>
</template>
