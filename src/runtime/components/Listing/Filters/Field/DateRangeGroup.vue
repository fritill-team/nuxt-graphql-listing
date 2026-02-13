<script setup lang="ts">
import { ref, computed, shallowRef, watch, useTemplateRef } from "vue";
import { CalendarDate, getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { useListingI18n } from "../../../../composables/useListingI18n";
import type { DateTimeRangeGroupFilterFieldConfig } from "../../../../types/listing";
const props = defineProps<{
  field: DateTimeRangeGroupFilterFieldConfig
  filters: Record<string, any>
}>();
const emit = defineEmits<{
  change: [patch: Record<string, any>]
}>();
const { t } = useListingI18n();
const activeField = ref("");
const fields = computed(() => props.field.dateFields.map((df) => ({
  label: df.label,
  value: df.field
})));
const showDateRange = ref(false);
const rangeModel = shallowRef<{ start: CalendarDate; end: CalendarDate } | null>(null);
function dateStrToCalendarDate(value: string): CalendarDate | null {
  if (!value) return null;
  const datePart = value.slice(0, 10);
  try {
    return parseDate(datePart);
  } catch {
    return null;
  }
}
function calendarDateToStr(date: CalendarDate): string {
  const y = date.year.toString().padStart(4, "0");
  const m = date.month.toString().padStart(2, "0");
  const d = date.day.toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function getDefaultRange() {
  return {
    start: new CalendarDate(2025, 1, 1),
    end: today(getLocalTimeZone())
  };
}
const resolvedActiveField = computed({
  get() {
    return activeField.value;
  },
  set(newField) {
    activeField.value = newField;
    if (!newField) {
      showDateRange.value = false;
      rangeModel.value = null;
      return;
    }
    const existing = props.filters[newField] ?? null;
    if (existing?.gte && existing?.lte) {
      const start = dateStrToCalendarDate(existing.gte);
      const end = dateStrToCalendarDate(existing.lte);
      if (start && end) {
        rangeModel.value = { start, end };
      } else {
        rangeModel.value = getDefaultRange();
      }
    } else {
      rangeModel.value = getDefaultRange();
    }
    showDateRange.value = true;
  }
});
function syncRangeFromFiltersForActive() {
  let key = resolvedActiveField.value;
  if (!key) {
    const fromFilters = props.field.dateFields.find(
      (df) => props.filters[df.field] != null
    );
    if (!fromFilters) {
      showDateRange.value = false;
      rangeModel.value = null;
      return;
    }
    key = fromFilters.field;
    activeField.value = key;
  }
  const r = props.filters[key] ?? null;
  if (!r || !r.gte || !r.lte) {
    showDateRange.value = false;
    rangeModel.value = null;
    return;
  }
  const start = dateStrToCalendarDate(r.gte);
  const end = dateStrToCalendarDate(r.lte);
  if (start && end) {
    rangeModel.value = { start, end };
    showDateRange.value = true;
  } else {
    showDateRange.value = false;
    rangeModel.value = null;
  }
}
watch(
  () => props.filters,
  () => {
    syncRangeFromFiltersForActive();
  },
  { deep: true, immediate: true }
);
function applyRange() {
  const r = rangeModel.value;
  const active = resolvedActiveField.value;
  const patch = {};
  if (!active || !r?.start || !r?.end) {
    for (const df of props.field.dateFields) {
      patch[df.field] = null;
    }
    emit("change", patch);
    return;
  }
  const gte = calendarDateToStr(r.start);
  const lte = calendarDateToStr(r.end);
  for (const df of props.field.dateFields) {
    if (df.field === active) {
      patch[df.field] = { gte, lte };
    } else {
      patch[df.field] = null;
    }
  }
  emit("change", patch);
}
function clearGroup() {
  const patch = {};
  for (const df of props.field.dateFields) {
    patch[df.field] = null;
  }
  emit("change", patch);
  rangeModel.value = null;
  activeField.value = "";
  showDateRange.value = false;
}
const inputDateRef = useTemplateRef("inputDateRef");
</script>

<template>
	<div class="space-y-3">
		<div v-if="field.label"
		     class="flex items-center justify-between">
      <span class="font-semibold">
        {{ field.label }}
      </span>
		</div>

		<!-- Radio group: which date field to filter on -->
		
		<URadioGroup
			v-model="resolvedActiveField"
			:items="fields"
		/>

		<!-- Date range appears only after selecting a field or when URL has a range -->

		<div v-if="showDateRange" class="space-y-2">
			<UInputDate
				ref="inputDateRef"
				v-model="rangeModel"
				range
			>
				<template #trailing>
					<div class="flex items-center gap-2">
						<UPopover>
							<UButton
								color="neutral"
								variant="link"
								size="sm"
								icon="i-lucide-calendar"
								aria-label="Select a date range"
								class="px-0"
							/>
							<template #content>
								<UCalendar
									v-model="rangeModel"
									class="p-2"
									:number-of-months="2"
									range
								/>
							</template>
						</UPopover>
					</div>
				</template>

			</UInputDate>
			<div class="flex justify-end gap-2">
				<UButton
					variant="ghost"
					@click="clearGroup"
				>
					{{ t("listing.clear") }}
				</UButton>
				<UButton
					size="xs"
					variant="soft"
					color="primary"
					@click="applyRange"
				>
					{{ t("listing.apply") }}
				</UButton>
			</div>
		</div>
	</div>
</template>
