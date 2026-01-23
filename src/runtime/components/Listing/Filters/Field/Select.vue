<script setup lang="ts">
import { computed } from 'vue'
import type { SelectItem } from '@nuxt/ui'
import type { SelectFilterFieldConfig, OptionFacet } from '../../../../types/listing'

const props = defineProps<{
  field: SelectFilterFieldConfig<string>
  filters: Record<string, any>
  /** Dynamic options from facets (overrides field.options if provided) */
  facetOptions?: OptionFacet[] | null
}>()

const emit = defineEmits<{
  (e: 'change', patch: Record<string, any>): void
}>()

const value = computed({
  get() {
    return props.filters[props.field.field]
  },
  set(val: any) {
    emit('change', { [props.field.field]: val })
  }
})

/**
 * Normalize anything to Nuxt UI SelectItem
 * - no primitives returned
 * - label/value always present
 */
const options = computed<SelectItem[]>(() => {
  // facet-driven options
  if (props.facetOptions?.length) {
    return props.facetOptions.map((opt) => ({
      label: opt.label ?? String(opt.value),
      value: opt.value
    }))
  }

  // fallback: normalize field.options
  const raw = props.field.options ?? []

  return raw.map((opt: any): SelectItem => {
    // primitive -> object
    if (
      typeof opt === 'string' ||
      typeof opt === 'number' ||
      typeof opt === 'boolean' ||
      typeof opt === 'bigint'
    ) {
      return { label: String(opt), value: opt }
    }

    // object -> ensure label/value
    return {
      ...opt,
      label: opt.label ?? String(opt.value ?? ''),
      value: opt.value ?? opt.label
    }
  })
})

/**
 * Count lookup separate from SelectItem typing
 */
const countsByValue = computed<Record<string, number>>(() => {
  const facets = props.facetOptions ?? []
  const map: Record<string, number> = {}
  for (const f of facets) {
    // key must be string to use as object key
    map[String(f.value)] = Number(f.count ?? 0)
  }
  return map
})
</script>

<template>
  <UFormField :label="field.label" size="sm" class="space-y-1">
    <USelect v-model="value" :items="options" class="w-full">
      <template #item="{ item }">
        <span>{{ (item as any)?.label }}</span>

        <!-- show counts only when facets exist and count for this item exists -->
        <span
          v-if="facetOptions?.length && countsByValue[String((item as any)?.value)] != null"
          class="text-neutral-400 ms-1"
        >
          ({{ countsByValue[String((item as any)?.value)] }})
        </span>
      </template>
    </USelect>
  </UFormField>
</template>
