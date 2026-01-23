<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import type {RangeFilterFieldConfig} from "../../../../types/listing";
import {useListingI18n} from '../../../../composables/useListingI18n'

const props = defineProps<{
  field: RangeFilterFieldConfig<string>
  filters: Record<string, any>
  // Facets: optional min/max bounds from API
  facetMin?: number | null
  facetMax?: number | null
}>()

const emit = defineEmits<{
  (e: 'change', patch: Record<string, any>): void
}>()

const {t} = useListingI18n()

// Computed bounds from facets (with fallbacks)
const minBound = computed(() => props.facetMin ?? 0)
const maxBound = computed(() => props.facetMax ?? 1000)

// Local buffered state
const localGte = ref<number>(0)
const localLte = ref<number>(0)

// Sync local state from filters (URL) when parent changes
watch(
  () => props.filters[props.field.field],
  (val) => {
    const v = (val ?? {}) as { gte?: number; lte?: number }
    localGte.value = v.gte ?? minBound.value
    localLte.value = v.lte ?? maxBound.value
  },
  {immediate: true, deep: true}
)

// Also react to facet changes
watch(
  [() => props.facetMin, () => props.facetMax],
  () => {
    const current = props.filters[props.field.field] as { gte?: number; lte?: number } | null
    if (!current?.gte) localGte.value = minBound.value
    if (!current?.lte) localLte.value = maxBound.value
  }
)

// Slider model
const sliderModel = computed<number[]>({
  get() {
    return [localGte.value ?? minBound.value, localLte.value ?? maxBound.value]
  },
  set(values) {
    const [min, max] = values
    localGte.value = min !== undefined && Number.isFinite(min) ? min : minBound.value
    localLte.value = max !== undefined && Number.isFinite(max) ? max : maxBound.value
  },
})

function onSubmit() {
  const patch: Record<string, any> = {}

  if (localGte.value == null && localLte.value == null) {
    patch[props.field.field] = null
  } else {
    patch[props.field.field] = {
      gte: localGte.value,
      lte: localLte.value,
    }
  }

  emit("change", patch)
}

function onClear() {
  localGte.value = minBound.value
  localLte.value = maxBound.value

  emit("change", {
    [props.field.field]: null,
  })
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
