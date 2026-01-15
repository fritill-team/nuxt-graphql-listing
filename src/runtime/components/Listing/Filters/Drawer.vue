<script setup lang="ts" generic="TFilters, TFacets">
import Renderer from "./Renderer.vue"
import type {FilterFieldConfig} from "../../../types/listing"
import {ref, toRaw, watch} from "vue"

const props = withDefaults(defineProps<{
  open?: boolean
  filters: TFilters
  config: FilterFieldConfig<string>[]
  facets?: TFacets | null
}>(), {
  open: false,
})

const emit = defineEmits<{
  (e: 'close', payload: { applied: boolean, filters: TFilters | null }): void
}>()

const close = () => emit('close', {applied: false, filters: null})

const submit = () => {
  const nextFilters = cloneFilters(localFilters.value)
  emit('close', {applied: true, filters: nextFilters})
}

const cloneFilters = (value: TFilters): TFilters => {
  const raw = toRaw(value)
  try {
    return structuredClone(raw) as TFilters
  } catch {
    return JSON.parse(JSON.stringify(raw)) as TFilters
  }
}

const localFilters = ref<TFilters>(cloneFilters(props.filters))

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      localFilters.value = cloneFilters(props.filters)
    }
  },
)

function onFieldChange(patch: Record<string, any>) {
  localFilters.value = {
    ...(localFilters.value as any),
    ...patch,
  }
}
</script>

<template>
  <USlideover
    :open="props.open"
    @update:open="(value) => { if (!value) close() }"
    :title="$t('listing.filters')"
  >
    <template #body>
      <Renderer
        :filters="localFilters"
        :config="props.config"
        :facets="props.facets"
        @change="onFieldChange"
      />
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton color="neutral" variant="ghost" :label="$t('listing.cancel')" @click="close"/>
        <UButton :label="$t('listing.apply')" color="primary" @click="submit"/>
      </div>
    </template>
  </USlideover>
</template>
