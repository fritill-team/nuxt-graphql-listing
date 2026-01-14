<script setup lang="ts">
import type {DateTimeRangeGroupFilterFieldConfig} from "../../../../types/filterSchema";
import {CalendarDate, getLocalTimeZone, parseDate, today} from "@internationalized/date";

const props = defineProps<{
	field: DateTimeRangeGroupFilterFieldConfig<string>
	filters: Record<string, any>
}>()

const emit = defineEmits<{
	(e: 'change', patch: Record<string, any>): void
}>()

// ------------ ACTIVE FIELD (radio) ------------
const activeField = ref<string>('') // ← starts empty

const fields = computed(() => props.field.dateFields.map((df) => ({
	label: df.label,
	value: df.field,
})))

// show / hide date range input
const showDateRange = ref(false)

// ------------ range model for UInputDate / UCalendar ------------
// Use `any` here to avoid fighting TS with the DateRange type
const rangeModel = shallowRef<any>(null)

// ------------ CalendarDate <-> string helpers ------------
function dateStrToCalendarDate(value: string | null | undefined): CalendarDate | null {
	if (!value) return null
	const datePart = value.slice(0, 10) // 'YYYY-MM-DD'
	try {
		return parseDate(datePart)
	} catch {
		return null
	}
}

function calendarDateToStr(date: CalendarDate): string {
	const y = date.year.toString().padStart(4, '0')
	const m = date.month.toString().padStart(2, '0')
	const d = date.day.toString().padStart(2, '0')
	return `${y}-${m}-${d}`
}

function getDefaultRange() {
	return {
		start: new CalendarDate(2025, 1, 1),
		end: today(getLocalTimeZone()),
	}
}

// ------------ resolvedActiveField (radio v-model) ------------
const resolvedActiveField = computed({
	get() {
		// ❗ No more fallback to first field.
		// It's empty unless:
		//  - user selected a radio
		//  - or we infer it from URL filters in syncRangeFromFiltersForActive()
		return activeField.value
	},
	set(newField: string) {
		activeField.value = newField

		// If user cleared the selection somehow
		if (!newField) {
			showDateRange.value = false
			rangeModel.value = null
			return
		}

		// If there is already a filter for this field, use it
		const existing = props.filters[newField] ?? null
		if (existing?.gte && existing?.lte) {
			const start = dateStrToCalendarDate(existing.gte as string)
			const end = dateStrToCalendarDate(existing.lte as string)
			if (start && end) {
				rangeModel.value = {start, end}
			} else {
				// fallback default
				rangeModel.value = getDefaultRange()

			}
		} else {
			// No existing value → set your default range
			rangeModel.value = getDefaultRange()
		}

		showDateRange.value = true
	}
})

// ------------ Sync range from URL / external filters ------------
function syncRangeFromFiltersForActive() {
	let key = resolvedActiveField.value

	// If no active field yet, try to infer it purely from props.filters (URL)
	if (!key) {
		const fromFilters = props.field.dateFields.find(
			(df) => props.filters[df.field] != null,
		)

		if (!fromFilters) {
			// No URL-provided filter → keep everything empty & hidden
			showDateRange.value = false
			rangeModel.value = null
			return
		}

		key = fromFilters.field
		activeField.value = key // now we have an active field from URL
	}

	const r = props.filters[key as keyof typeof props.filters] ?? null

	if (!r || !r.gte || !r.lte) {
		// There is an active field but no concrete range → don't force a range
		showDateRange.value = false
		rangeModel.value = null
		return
	}

	const start = dateStrToCalendarDate(r.gte as string)
	const end = dateStrToCalendarDate(r.lte as string)

	if (start && end) {
		rangeModel.value = {start, end}
		showDateRange.value = true
	} else {
		showDateRange.value = false
		rangeModel.value = null
	}
}

watch(
	() => props.filters,
	() => {
		syncRangeFromFiltersForActive()
	},
	{deep: true, immediate: true}
)

// ------------ Apply & clear ------------
function applyRange() {
	const r = rangeModel.value
	const active = resolvedActiveField.value
	const patch: Record<string, any> = {}

	// If no active field or incomplete range → clear all fields
	if (!active || !r?.start || !r?.end) {
		for (const df of props.field.dateFields) {
			patch[df.field] = null
		}
		emit('change', patch)
		return
	}

	const gte = calendarDateToStr(r.start as CalendarDate)
	const lte = calendarDateToStr(r.end as CalendarDate)

	for (const df of props.field.dateFields) {
		if (df.field === active) {
			patch[df.field] = {gte, lte}
		} else {
			patch[df.field] = null
		}
	}

	emit('change', patch)
}

function clearGroup() {
	const patch: Record<string, any> = {}
	for (const df of props.field.dateFields) {
		patch[df.field] = null
	}
	emit('change', patch)

	// reset local UI state
	rangeModel.value = null
	activeField.value = ''
	showDateRange.value = false
}

// ------------ UInputDate / UPopover reference ------------
const inputDateRef = useTemplateRef('inputDateRef')
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
					{{ $t("listing.clear") }}
				</UButton>
				<UButton
					size="xs"
					variant="soft"
					color="primary"
					@click="applyRange"
				>
					{{ $t("listing.apply") }}
				</UButton>
			</div>
		</div>
	</div>
</template>
