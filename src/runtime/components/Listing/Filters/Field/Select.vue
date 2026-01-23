<script setup lang="ts">
import { computed } from 'vue'
import type {SelectFilterFieldConfig, OptionFacet} from "../../../../types/listing";

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
		return props.filters[props.field.field] ?? null
	},
	set(val: any) {
		emit('change', {[props.field.field]: val})
	},
})

/**
 * Use facetOptions if available, otherwise fall back to field.options
 * Facet options are merged with static options to add counts
 */
const options = computed(() => {
	if (!props.facetOptions?.length) {
		return props.field.options
	}

	// Map facet options to select options format
	return props.facetOptions.map(opt => ({
		label: opt.label ?? String(opt.value),
		value: opt.value,
		count: opt.count,
	}))
})
</script>

<template>
	<UFormGroup :label="field.label" size="sm" class="space-y-1">
		<USelect
			v-model="value"
			:options="options"
			option-attribute="label"
			value-attribute="value"
		>
			<template #option="{ option }">
				<span>{{ option.label }}</span>
				<span v-if="option.count != null" class="text-neutral-400 ms-1">({{ option.count }})</span>
			</template>
		</USelect>
	</UFormGroup>
</template>
