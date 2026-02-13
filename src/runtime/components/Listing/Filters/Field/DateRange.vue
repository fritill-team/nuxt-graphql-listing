<script setup lang="ts">
import { computed } from "vue";
import type { RangeFilterFieldConfig, RangeValue } from "../../../../types/listing";
const props = defineProps<{
  field: RangeFilterFieldConfig
  filters: Record<string, any>
}>();
const emit = defineEmits<{
  change: [patch: Record<string, any>]
}>();
const current = computed<RangeValue<string>>(() => props.filters[props.field.field] ?? {});
function update(part: string, raw: string | null) {
  const val = raw === "" || raw == null ? null : raw;
  const next = {
    eq: current.value.eq ?? null,
    gt: current.value.gt ?? null,
    gte: part === "gte" ? val : current.value.gte ?? null,
    lt: current.value.lt ?? null,
    lte: part === "lte" ? val : current.value.lte ?? null
  };
  emit("change", { [props.field.field]: next });
}
</script>

<template>
	<UFormField :label="field.label" size="sm" class="space-y-1">
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
	</UFormField>
</template>
