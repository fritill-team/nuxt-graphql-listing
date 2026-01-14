<script setup lang="ts">
const props = withDefaults(defineProps<{
	error?: unknown
	title?: string
	retryText?: string
}>(), {
	title: 'Error Loading',
	retryText: 'Try Again',
})

const emit = defineEmits<{
	(e: 'retry'): void
}>()

function messageOf(e: unknown) {
	if (!e) return ''
	if (typeof e === 'string') return e
	if (typeof e === 'object' && e && 'message' in e) {
		return String((e as { message?: unknown }).message ?? '')
	}
	return String(e)
}

const errorMessage = computed(() => messageOf(props.error))
</script>

<template>
	<div class="py-8 h-full text-center">
		<div
			class="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-6"
			role="alert"
			aria-live="assertive"
		>
			<h3 class="mb-2 text-base font-semibold text-red-800">
				{{ title }}
			</h3>

			<p v-if="errorMessage" class="mb-4 text-sm text-red-600">
				{{ errorMessage }}
			</p>

			<button
				type="button"
				@click="emit('retry')"
				class="inline-flex items-center justify-center rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
			>
				{{ retryText }}
			</button>
		</div>
	</div>
</template>
