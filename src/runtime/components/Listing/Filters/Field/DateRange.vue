<script setup lang="ts">
import type {RangeFilterFieldConfig} from "../../../../types/filterSchema";

const props = defineProps<{
	field: RangeFilterFieldConfig<string>   // kind: 'datetime-range'
	filters: Record<string, any>
}>()

const emit = defineEmits<{
	(e: 'change', patch: Record<string, any>): void
}>()

const current = computed(() => (props.filters[props.field.field] ?? {}) as any)

function update(part: 'gte' | 'lte', raw: string | null) {
	const val = raw === '' || raw == null ? null : raw

	const next = {
		eq: current.value.eq ?? null,
		gt: current.value.gt ?? null,
		gte: part === 'gte' ? val : current.value.gte ?? null,
		lt: current.value.lt ?? null,
		lte: part === 'lte' ? val : current.value.lte ?? null,
	}

	emit('change', {[props.field.field]: next})
}
</script>

<template>
	<UFormGroup :label="field.label" size="sm" class="space-y-1">
		<div class="flex gap-2">
			<UInput
				type="date"
				size="sm"
				:model-value="current.gte ?? ''"
				@update:model-value="(val) => update('gte', String(val ?? ''))"
			/>
			<UInput
				type="date"
				size="sm"
				:model-value="current.lte ?? ''"
				@update:model-value="(val) => update('lte', String(val ?? ''))"
			/>
		</div>
	</UFormGroup>
</template>
