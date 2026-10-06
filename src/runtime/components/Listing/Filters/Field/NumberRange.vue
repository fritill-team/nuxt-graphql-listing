<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useListingI18n } from "../../../../composables/useListingI18n";
import { buildRangeValue, sliderEndToBound, toRangeBound } from "../../../../utils/range";
import type { RangeBound } from "../../../../utils/range";
import type { RangeFilterFieldConfig } from "../../../../types/listing";
const props = withDefaults(defineProps<{
  field: RangeFilterFieldConfig
  filters: Record<string, any>
  facetMin?: number | null
  facetMax?: number | null
}>(), {
  facetMin: undefined,
  facetMax: undefined
});
const emit = defineEmits<{
  change: [patch: Record<string, any>]
}>();
const { t } = useListingI18n();
const minBound = computed(() => props.facetMin ?? 0);
const maxBound = computed(() => props.facetMax ?? 1e3);
// null = the user left this end empty: no limit. The facet bounds are only
// placeholders and slider track ends, never a value that gets submitted.
const localGte = ref<RangeBound>(null);
const localLte = ref<RangeBound>(null);
watch(
  () => props.filters[props.field.field],
  (val) => {
    const v = val ?? {};
    localGte.value = toRangeBound(v.gte);
    localLte.value = toRangeBound(v.lte);
  },
  { immediate: true, deep: true }
);
const sliderModel = computed({
  get() {
    return [
      toRangeBound(localGte.value) ?? minBound.value,
      toRangeBound(localLte.value) ?? maxBound.value
    ];
  },
  set(values: number[]) {
    const [min, max] = values;
    const [shownMin, shownMax] = sliderModel.value;
    // Only the thumb that moved changes its end: the facet follows the applied
    // filter, so an applied bound can rest on the track end and must survive.
    if (min !== shownMin) localGte.value = sliderEndToBound(min, minBound.value);
    if (max !== shownMax) localLte.value = sliderEndToBound(max, maxBound.value);
  }
});
function onSubmit() {
  emit("change", {
    [props.field.field]: buildRangeValue(localGte.value, localLte.value)
  });
}
function onClear() {
  localGte.value = null;
  localLte.value = null;
  emit("change", {
    [props.field.field]: null
  });
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="field.label" class="flex items-center justify-between font-semibold"
         v-text="field.label"/>

    <div class="flex gap-3 w-full">
      <UFormField :label="t('listing.range.min')" class="w-full">
        <UInput
          v-model.number="localGte"
          type="number"
          size="sm"
          :placeholder="String(minBound)"
          :min="minBound"
          :max="maxBound"
          class="w-full"
        />
      </UFormField>
      <UFormField :label="t('listing.range.max')" class="w-full">
        <UInput
          v-model.number="localLte"
          type="number"
          size="sm"
          :placeholder="String(maxBound)"
          :min="minBound"
          :max="maxBound"
          class="w-full"
        />
      </UFormField>
    </div>

    <div class="w-full pt-2">
      <USlider
        v-model="sliderModel"
        :min="minBound"
        :max="maxBound"
      />
    </div>

    <div class="flex justify-end gap-2">
      <UButton variant="ghost" size="xs" @click="onClear">
        {{ t("listing.clear") }}
      </UButton>
      <UButton variant="soft" color="primary" size="xs" @click="onSubmit">
        {{ t("listing.apply") }}
      </UButton>
    </div>
  </div>
</template>
