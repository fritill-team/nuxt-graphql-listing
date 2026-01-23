<script setup lang="ts">
import { computed } from 'vue'
import type { SwitchMultiFilterFieldConfig, OptionFacet } from '../../../../types/listing'
import { useListingI18n } from '../../../../composables/useListingI18n'

const props = defineProps<{
	field: SwitchMultiFilterFieldConfig<string>
	filters: Record<string, any>
	/** Dynamic options from facets (adds counts to options) */
	facetOptions?: OptionFacet[] | null
}>()

const emit = defineEmits<{
	(e: 'change', patch: Record<string, any>): void
}>()

const { t } = useListingI18n()

// current selected values for this single field (array from filters / URL)
const selectedValues = computed<(string | number | boolean)[]>(() => {
	const raw = props.filters[props.field.field]
	if (!raw) return []
	if (Array.isArray(raw)) return raw as (string | number | boolean)[]
	return [raw as string | number | boolean]
})

// Map facet data to counts by value
const facetCounts = computed<Record<string | number, number>>(() => {
	if (!props.facetOptions?.length) return {}
	const counts: Record<string | number, number> = {}
	for (const f of props.facetOptions) {
		counts[String(f.value)] = f.count ?? 0
	}
	return counts
})

// Options with counts from facets
const optionsWithCounts = computed(() => {
	return props.field.options.map(opt => ({
		...opt,
		count: facetCounts.value[String(opt.value)],
	}))
})

function onToggle(optionValue: string | number | boolean, checked: boolean) {
	const current = selectedValues.value
	let next: (string | number | boolean)[]

	if (checked) {
		// add if not present
		if (current.includes(optionValue)) {
			next = current
		} else {
			next = [...current, optionValue]
		}
	} else {
		// remove from array
		next = current.filter((v) => v !== optionValue)
	}

	emit('change', {
		[props.field.field]: next.length ? next : null, // null → removed from URL
	})
}

function clearAll() {
	emit('change', {
		[props.field.field]: null,
	})
}
</script>

<template>
	<div class="space-y-3 pt-3">
		<div
			v-if="field.label"
			class="flex items-center justify-between"
		>
      <span class="font-semibold">
        {{ field.label }}
      </span>

			<UButton
				variant="ghost"
				size="xs"
				@click="clearAll"
			>
				{{ t('listing.clear') }}
			</UButton>
		</div>

		<div class="space-y-2">
			<label
				v-for="opt in optionsWithCounts"
				:key="String(opt.value)"
				class="flex items-center gap-2"
			>
				<USwitch
					:model-value="selectedValues.includes(opt.value)"
					@update:model-value="onToggle(opt.value, $event)"
				/>
				<span class="truncate">
          {{ opt.label }}
        </span>
				<span v-if="opt.count != null" class="text-xs text-neutral-400">
					({{ opt.count }})
				</span>
			</label>
		</div>
	</div>
</template>
