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

function resolveComponent(field: FilterFieldConfig<string>) {
  if (field.kind === 'custom' && 'component' in field) {
    return field.component
  }

  switch (field.kind) {
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

function getCustomProps(field: FilterFieldConfig<string>): Record<string, any> {
  if (field.kind === 'custom' && 'props' in field) {
    return field.props ?? {}
  }
  return {}
}

/**
 * Get facet props for a filter field.
 * Facets are keyed by field name in the API response.
 *
 * Expected backend response structure:
 * {
 *   facets: {
 *     price: { min: 0, max: 1000 },           // for int-range, decimal-range
 *     categoryId: [{ id, name, count, children }],  // for category-tree
 *     rating: [{ value: 5, count: 10 }],      // for rating
 *     tags: [{ value: 'new', count: 5 }],     // for select, switch-multi
 *   }
 * }
 */
function getFacetProps(field: FilterFieldConfig<string>): Record<string, any> {
  if (!props.facets) return {}

  const fieldName = 'field' in field ? field.field : null
  if (!fieldName) return {}

  const facetData = (props.facets as Record<string, any>)[fieldName]
  if (facetData === undefined || facetData === null) return {}

  // Range filters expect { min, max }
  if (field.kind === 'decimal-range' || field.kind === 'int-range') {
    return {
      facetMin: facetData.min ?? null,
      facetMax: facetData.max ?? null,
    }
  }

  // Datetime range filters expect { min, max } as ISO strings
  if (field.kind === 'datetime-range') {
    return {
      facetMin: facetData.min ?? null,
      facetMax: facetData.max ?? null,
    }
  }

  // Category tree expects array of CategoryFacet
  if (field.kind === 'category-tree') {
    return { facetOptions: Array.isArray(facetData) ? facetData : null }
  }

  // Rating expects array of RatingFacet
  if (field.kind === 'rating') {
    return { facetOptions: Array.isArray(facetData) ? facetData : null }
  }

  // Select and switch-multi expect array of OptionFacet
  if (field.kind === 'select' || field.kind === 'boolean-select' || field.kind === 'switch-multi') {
    return { facetOptions: Array.isArray(facetData) ? facetData : null }
  }

  // Custom filters receive raw facet data - developer handles it
  if (field.kind === 'custom') {
    return { facet: facetData }
  }

  return {}
}

function onFieldChange(patch: Record<string, any>) {
  emit("change", patch)
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
        :field="field as any"
        :filters="filters"
        v-bind="{ ...getFacetProps(field), ...getCustomProps(field) }"
        @change="onFieldChange"
      />
    </template>
  </div>
</template>
