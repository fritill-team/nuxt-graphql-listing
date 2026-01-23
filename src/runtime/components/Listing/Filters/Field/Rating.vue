<script setup lang="ts">
import { computed } from 'vue'
import type {RatingFilterFieldConfig, RatingFacet} from "../../../../types/listing"
import { useListingI18n } from '../../../../composables/useListingI18n'

const props = defineProps<{
	field: RatingFilterFieldConfig<string>
	filters: Record<string, any>
	/** Rating facet data with counts per rating value */
	facetOptions?: RatingFacet[] | null
}>()

const { t } = useListingI18n()

const emit = defineEmits<{
	(e: "change", patch: Record<string, any>): void
}>()

// rating options (4★+, 3★+, 2★+, 1★+) - can be overridden by field.steps
const ratingSteps = computed(() => props.field.steps ?? [4, 3, 2, 1])

// Map facet data to counts by rating value
const facetCounts = computed<Record<number, number>>(() => {
	if (!props.facetOptions?.length) return {}
	const counts: Record<number, number> = {}
	for (const f of props.facetOptions) {
		counts[f.value] = f.count ?? 0
	}
	return counts
})

// current value comes from URL-backed filters object: expect { gte: number }
const currentValue = computed<number | null>(() => {
  const raw = props.filters[props.field.field]
  if (raw && typeof raw === 'object' && typeof raw.gte === 'number') return raw.gte
  if (typeof raw === 'number') return raw
  return null
})

// v-model bridge for URadioGroup
const radioModel = computed<number | null>({
	get() {
		return currentValue.value
	},
	set(val) {
		onSelect(val)
	},
})

// URadioGroup options: last one is "any" → null
const radioOptions = computed(() => [
	...ratingSteps.value.map((n) => ({
		value: n,
		// label is overridden by slot, but keep something for a11y
		label: `${n}★+`,
		count: facetCounts.value[n],
	})),
	{
		value: null,
		label: t("listing.rating.any"),
		count: undefined,
	},
])

// emit patch in the unified shape used by ListingFiltersPanel / useListing
function onSelect(value: number | null) {
  if (value == null) {
    emit('change', { [props.field.field]: null })
    return
  }
  emit('change', { [props.field.field]: { gte: value } })
}
</script>

<template>
	<div class="flex flex-col gap-2">
		<h3
			class="text-neutral-500 dark:text-gray-100 text-lg font-semibold mb-1"
			v-text="field.label"
		/>

		<URadioGroup
			v-model="radioModel"
			:items="radioOptions"
			:name="field.key || 'rate-filter'"
			class="space-y-2 ms-3"
		>
			<!-- Custom label to render stars -->
			<template #label="{ item }">
				<!-- "Any" option -->
				<template v-if="item.value === null">
          <span
	          :class="[
              'text-neutral-600 dark:text-gray-100 text-sm',
              radioModel === null ? 'font-semibold' : '',
            ]"
          >
            {{ t('listing.rating.any') }}
          </span>
				</template>

				<!-- 4★+, 3★+, 2★+, 1★+ -->
				<template v-else>
          <span
	          class="flex items-center gap-1"
	          :class="radioModel === item.value ? 'font-bold text-yellow-700' : 'text-neutral-600'"
          >
            <template v-for="i in 5" :key="i">
              <Icon
	              :name="i <= item.value ? 'material-symbols:star-rounded' : 'mdi:star-outline'"
	              class="w-5 h-5 text-yellow-500"
	              size="1.2rem"
              />
            </template>
            <span class="ml-1 text-sm text-neutral-600 dark:text-gray-100">
              {{ t('listing.rating.up') }}
            </span>
            <span v-if="item.count != null" class="ml-1 text-xs text-neutral-400">
              ({{ item.count }})
            </span>
          </span>
				</template>
			</template>
		</URadioGroup>
	</div>
</template>
