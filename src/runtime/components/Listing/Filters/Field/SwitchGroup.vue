<script setup lang="ts">
import type { SwitchGroupFilterFieldConfig } from "../../../../types/listing";
import { useListingI18n } from '../../../../composables/useListingI18n'

const props = defineProps<{
	field: SwitchGroupFilterFieldConfig<string>
	filters: Record<string, any>
}>()

const emit = defineEmits<{
	(e: "change", patch: Record<string, any>): void
}>()

const { t } = useListingI18n()

// Toggle handler for a single switch
function onToggle(fieldKey: string, checked: boolean) {
	// When OFF → send null to remove from URL filters
	emit("change", {
		[fieldKey]: checked ? true : null,
	})
}

function clearAll() {
	const patch: Record<string, any> = {}
	for (const sw of props.field.switches) {
		patch[sw.field] = null
	}
	emit("change", patch)
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
				{{ t("listing.clear") }}
			</UButton>
		</div>

		<div class="space-y-2">
			<label
				v-for="sw in field.switches"
				:key="sw.field"
				class="flex items-center gap-2 "
			>
				<USwitch
					:model-value="!!filters[sw.field]"
					@update:model-value="onToggle(sw.field, $event)"
				/>
				<span class="truncate">
          {{ sw.label }}
        </span>
			</label>
		</div>
	</div>
</template>
