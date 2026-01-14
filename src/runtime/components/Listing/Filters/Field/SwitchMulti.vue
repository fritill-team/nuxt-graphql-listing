<script setup lang="ts">
import type { SwitchMultiFilterFieldConfig } from '../../../../types/filterSchema'

const props = defineProps<{
	field: SwitchMultiFilterFieldConfig<string>
	filters: Record<string, any>
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
				v-for="opt in field.options"
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
			</label>
		</div>
	</div>
</template>
