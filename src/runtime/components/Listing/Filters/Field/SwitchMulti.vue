<script setup lang="ts">
import { computed } from "vue";
import { useListingI18n } from "../../../../composables/useListingI18n";
import type { SwitchMultiFilterFieldConfig, OptionFacet } from "../../../../types/listing";
const props = withDefaults(defineProps<{
  field: SwitchMultiFilterFieldConfig
  filters: Record<string, any>
  facetOptions?: OptionFacet[] | null
}>(), {
  facetOptions: undefined
});
const emit = defineEmits<{
  change: [patch: Record<string, any>]
}>();
const { t } = useListingI18n();
const selectedValues = computed(() => {
  const raw = props.filters[props.field.field];
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return [raw];
});
const facetCounts = computed(() => {
  if (!props.facetOptions?.length) return {};
  const counts = {};
  for (const f of props.facetOptions) {
    counts[String(f.value)] = f.count ?? 0;
  }
  return counts;
});
const optionsWithCounts = computed(() => {
  return props.field.options.map((opt) => ({
    ...opt,
    count: facetCounts.value[String(opt.value)]
  }));
});
function onToggle(optionValue: string | number | boolean, checked: boolean) {
  const current = selectedValues.value;
  let next;
  if (checked) {
    if (current.includes(optionValue)) {
      next = current;
    } else {
      next = [...current, optionValue];
    }
  } else {
    next = current.filter((v) => v !== optionValue);
  }
  emit("change", {
    [props.field.field]: next.length ? next : null
    // null → removed from URL
  });
}
function clearAll() {
  emit("change", {
    [props.field.field]: null
  });
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
