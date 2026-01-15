<script setup lang="ts" generic="TFilters, TFacets">
import type {FilterFieldConfig} from "../../../types/listing"

import Select from "./Field/Select.vue"
import DateRangeGroup from "./Field/DateRangeGroup.vue"
import DateRange from "./Field/DateRange.vue"
import NumberRange from "./Field/NumberRange.vue"
import SwitchGroup from "./Field/SwitchGroup.vue"
import SwitchMulti from "./Field/SwitchMulti.vue"
import Rating from "./Field/Rating.vue"
import CategoryTree from "./Field/Category/Tree.vue"

const props = defineProps<{
  filters: TFilters
  config: FilterFieldConfig<string>[]
  facets?: TFacets | null
}>()

const emit = defineEmits<{
  (e: "change", patch: Record<string, any>): void
}>()

function resolveComponent(kind: FilterFieldConfig<string>["kind"]) {
  switch (kind) {
    case "select":
    case "boolean-select":
      return Select
    case "datetime-range-group":
      return DateRangeGroup
    case "datetime-range":
      return DateRange
    case "int-range":
    case "decimal-range":
      return NumberRange
    case "switch-group":
      return SwitchGroup
    case 'switch-multi':
      return SwitchMulti
    case 'rating':
      return Rating
    case 'category-tree':
      return CategoryTree
  }
}

function getFacetProps(field: FilterFieldConfig<string>): Record<string, any> {
  if (!props.facets) return {}

  if (field.kind === 'decimal-range' || field.kind === 'int-range') {
    const fieldName = 'field' in field ? field.field : ''

    if (fieldName === 'price') {
      return {
        facetMin: props.facets.priceMinCents != null
          ? props.facets.priceMinCents / 100
          : null,
        facetMax: props.facets.priceMaxCents != null
          ? props.facets.priceMaxCents / 100
          : null,
      }
    }

    return {
      facetMin: props.facets[`${fieldName}Min`] ?? props.facets[`${fieldName}MinCents`] ?? null,
      facetMax: props.facets[`${fieldName}Max`] ?? props.facets[`${fieldName}MaxCents`] ?? null,
    }
  }

  if (field.kind === 'category-tree') {
    if ((props.facets as any)?.categories) {
      return {facetOptions: (props.facets as any).categories}
    }
  }

  return {}
}

function onFieldChange(patch: Record<string, any>) {
  emit("change", patch)
}
</script>

<template>
  <div class="space-y-6">
    <template v-for="field in config" :key="field.key">
      <div
        v-if="field.kind === 'separator'"
        class="flex items-center gap-2 py-3"
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
        :is="resolveComponent(field.kind)"
        v-else
        :field="field as any"
        :filters="filters"
        v-bind="getFacetProps(field)"
        @change="onFieldChange"
      />
    </template>
  </div>
</template>
