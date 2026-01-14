<script setup lang="ts">
import type { SortDirection, SortOption } from '../../../types/sortSchema'
import type { SortFieldInput } from '#layers/courses/types/generated'

const props = defineProps<{
	options: SortOption<string>[]
	sort: Array<{ field: string; direction: SortDirection }> | null | undefined
	/** Label shown before the dropdown */
	label?: string
}>()

const emit = defineEmits<{
	(e: 'change', sort: Array<{ field: string; direction: SortDirection }>): void
}>()

const { t } = useI18n()

// Create a unique key for each sort option (field:direction)
function optionKey(opt: SortOption<string>): string {
	return `${opt.field}:${opt.direction}`
}

// Parse the key back to field/direction
function parseKey(key: string): { field: string; direction: SortDirection } | null {
	const [field, dir] = key.split(':')
	if (field && (dir === 'ASC' || dir === 'DESC')) {
		return { field, direction: dir as SortDirection }
	}
	return null
}

// Current selection as "field:direction" string
const selectedKey = computed({
	get() {
		if (!props.sort || props.sort.length === 0) return ''
		const first = props.sort[0] as SortFieldInput
		return `${first.field}:${first.direction}`
	},
	set(key: string) {
		if (!key) {
			emit('change', [])
			return
		}
		const parsed = parseKey(key)
		if (parsed) {
			emit('change', [parsed])
		}
	},
})

// Transform options for UDropdownMenu
const selectOptions = computed(() => {
	return props.options.map((opt) => ({
		label: opt.label,
		value: optionKey(opt),
		onSelect: () => emit('change', [opt]),
	}))
})

// ✅ Label that includes the selected item's label
const buttonLabel = computed(() => {
	const key = selectedKey.value
	const selected = props.options.find((opt) => optionKey(opt) === key)
	const selectedText = selected?.label ?? '' // empty if nothing selected

	// Assuming translation like: "Sort by {{label}}"
	return t('listing.sortBy', { label: selectedText })
})
</script>

<template>
	<UDropdownMenu :items="selectOptions">
		<UButton
			size="lg"
			color="primary-600"
			class="rounded-full"
			variant="outline"
			:aria-label="buttonLabel"
		>
			<!-- Text: hidden on mobile, visible from sm+ -->
			<span class="hidden sm:inline">
        {{ buttonLabel }}
      </span>

			<!-- Icon: always visible -->
			<UIcon
				name="i-lucide-arrow-down-wide-narrow"
				class="h-4 w-4"
				:class="{ 'sm:ms-2': true }"
			/>
		</UButton>
	</UDropdownMenu>
</template>
