<script setup lang="ts">
import { computed } from "vue";
import { useListingI18n } from "../../../../composables/useListingI18n";
import type { RatingFilterFieldConfig, RatingFacet } from "../../../../types/listing";
const props = withDefaults(defineProps<{
  field: RatingFilterFieldConfig
  filters: Record<string, any>
  facetOptions?: RatingFacet[] | null
}>(), {
  facetOptions: undefined
});
const { t } = useListingI18n();
const emit = defineEmits<{
  change: [patch: Record<string, any>]
}>();
const ratingSteps = computed(() => props.field.steps ?? [4, 3, 2, 1]);
const facetCounts = computed(() => {
  if (!props.facetOptions?.length) return {};
  const counts = {};
  for (const f of props.facetOptions) {
    counts[f.value] = f.count ?? 0;
  }
  return counts;
});
const currentValue = computed(() => {
  const raw = props.filters[props.field.field];
  if (raw && typeof raw === "object" && typeof raw.gte === "number") return raw.gte;
  if (typeof raw === "number") return raw;
  return null;
});
const radioModel = computed({
  get() {
    return currentValue.value;
  },
  set(val) {
    onSelect(val);
  }
});
const radioOptions = computed(() => [
  ...ratingSteps.value.map((n) => ({
    value: n,
    // label is overridden by slot, but keep something for a11y
    label: `${n}\u2605+`,
    count: facetCounts.value[n]
  })),
  {
    value: null,
    label: t("listing.rating.any"),
    count: void 0
  }
]);
function onSelect(value) {
  if (value == null) {
    emit("change", { [props.field.field]: null });
    return;
  }
  emit("change", { [props.field.field]: { gte: value } });
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
  radioModel === null ? 'font-semibold' : ''
]"
          >
            {{ t("listing.rating.any") }}
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
	              :name="i <= Number(item.value) ? 'material-symbols:star-rounded' : 'mdi:star-outline'"
	              class="w-5 h-5 text-yellow-500"
	              size="1.2rem"
              />
            </template>
            <span class="ml-1 text-sm text-neutral-600 dark:text-gray-100">
              {{ t("listing.rating.up") }}
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
