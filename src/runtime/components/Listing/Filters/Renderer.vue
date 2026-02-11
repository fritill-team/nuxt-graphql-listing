<script setup>
import Select from "./Field/Select.vue";
import DateRangeGroup from "./Field/DateRangeGroup.vue";
import DateRange from "./Field/DateRange.vue";
import NumberRange from "./Field/NumberRange.vue";
import SwitchGroup from "./Field/SwitchGroup.vue";
import SwitchMulti from "./Field/SwitchMulti.vue";
import Rating from "./Field/Rating.vue";
import CategoryTree from "./Field/Category/Tree.vue";
const props = defineProps({
  filters: { type: null, required: true },
  config: { type: Array, required: true },
  facets: { type: null, required: false }
});
const emit = defineEmits(["change"]);
function resolveComponent(field) {
  if (field.kind === "custom" && "component" in field) {
    return field.component;
  }
  switch (field.kind) {
    case "select":
    case "boolean-select":
      return Select;
    case "datetime-range-group":
      return DateRangeGroup;
    case "datetime-range":
      return DateRange;
    case "int-range":
    case "decimal-range":
      return NumberRange;
    case "switch-group":
      return SwitchGroup;
    case "switch-multi":
      return SwitchMulti;
    case "rating":
      return Rating;
    case "category-tree":
      return CategoryTree;
  }
}
function getCustomProps(field) {
  if (field.kind === "custom" && "props" in field) {
    return field.props ?? {};
  }
  return {};
}
function getFacetProps(field) {
  if (!props.facets) return {};
  const fieldName = "field" in field ? field.field : null;
  if (!fieldName) return {};
  const facetData = props.facets[fieldName];
  if (facetData === void 0 || facetData === null) return {};
  if (field.kind === "decimal-range" || field.kind === "int-range") {
    return {
      facetMin: facetData.min ?? null,
      facetMax: facetData.max ?? null
    };
  }
  if (field.kind === "datetime-range") {
    return {
      facetMin: facetData.min ?? null,
      facetMax: facetData.max ?? null
    };
  }
  if (field.kind === "category-tree") {
    return { facetOptions: Array.isArray(facetData) ? facetData : null };
  }
  if (field.kind === "rating") {
    return { facetOptions: Array.isArray(facetData) ? facetData : null };
  }
  if (field.kind === "select" || field.kind === "boolean-select" || field.kind === "switch-multi") {
    return { facetOptions: Array.isArray(facetData) ? facetData : null };
  }
  if (field.kind === "custom") {
    return { facet: facetData };
  }
  return {};
}
function onFieldChange(patch) {
  emit("change", patch);
}
</script>

<template>
  <div class="space-y-4">
    <template v-for="field in config" :key="field.key">
      <div
        v-if="field.kind === 'separator'"
        class="flex items-center gap-2 "
        role="separator"
      >
        <span
          v-if="field.label"
          class="font-semibold uppercase text-muted-foreground whitespace-nowrap"
        >
          {{ field.label }}
        </span>
        <div class="flex-1 border-t-3 border-t-neutral-100 dark:border-neutral-800"/>
      </div>

      <component
        :is="resolveComponent(field)"
        v-else
        :field="field"
        :filters="filters"
        v-bind="{ ...getFacetProps(field), ...getCustomProps(field) }"
        @change="onFieldChange"
      />
    </template>
  </div>
</template>
