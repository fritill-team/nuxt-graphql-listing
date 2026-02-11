<script setup>
import { computed, ref, watch } from "vue";
import { useListingI18n } from "../../../../composables/useListingI18n";
const props = defineProps({
  field: { type: Object, required: true },
  filters: { type: Object, required: true },
  facetMin: { type: [Number, null], required: false },
  facetMax: { type: [Number, null], required: false }
});
const emit = defineEmits(["change"]);
const { t } = useListingI18n();
const minBound = computed(() => props.facetMin ?? 0);
const maxBound = computed(() => props.facetMax ?? 1e3);
const localGte = ref(0);
const localLte = ref(0);
watch(
  () => props.filters[props.field.field],
  (val) => {
    const v = val ?? {};
    localGte.value = v.gte ?? minBound.value;
    localLte.value = v.lte ?? maxBound.value;
  },
  { immediate: true, deep: true }
);
watch(
  [() => props.facetMin, () => props.facetMax],
  () => {
    const current = props.filters[props.field.field];
    if (!current?.gte) localGte.value = minBound.value;
    if (!current?.lte) localLte.value = maxBound.value;
  }
);
const sliderModel = computed({
  get() {
    return [localGte.value ?? minBound.value, localLte.value ?? maxBound.value];
  },
  set(values) {
    const [min, max] = values;
    localGte.value = min !== void 0 && Number.isFinite(min) ? min : minBound.value;
    localLte.value = max !== void 0 && Number.isFinite(max) ? max : maxBound.value;
  }
});
function onSubmit() {
  const patch = {};
  if (localGte.value == null && localLte.value == null) {
    patch[props.field.field] = null;
  } else {
    patch[props.field.field] = {
      gte: localGte.value,
      lte: localLte.value
    };
  }
  emit("change", patch);
}
function onClear() {
  localGte.value = minBound.value;
  localLte.value = maxBound.value;
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
