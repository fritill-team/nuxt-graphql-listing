<script setup lang="ts">
import type {SelectFilterFieldConfig} from "../../../../types/filterSchema";

const props = defineProps<{
	field: SelectFilterFieldConfig<string>
	filters: Record<string, any>
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
</script>

<template>
	<UFormGroup :label="field.label" size="sm" class="space-y-1">
		<USelect
			v-model="value"
			:options="field.options"
			option-attribute="label"
			value-attribute="value"
		/>
	</UFormGroup>
</template>
