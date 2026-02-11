<script setup>
import { useListingI18n } from "../../../../composables/useListingI18n";
const props = defineProps({
  field: { type: Object, required: true },
  filters: { type: Object, required: true }
});
const emit = defineEmits(["change"]);
const { t } = useListingI18n();
function onToggle(fieldKey, checked) {
  emit("change", {
    [fieldKey]: checked ? true : null
  });
}
function clearAll() {
  const patch = {};
  for (const sw of props.field.switches) {
    patch[sw.field] = null;
  }
  emit("change", patch);
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
