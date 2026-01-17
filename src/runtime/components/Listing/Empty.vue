<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
	title?: string
	description?: string
	/** Optional: override both light & dark with a single image */
	imageSrc?: string
	/** Optional: specific light-mode image */
	imageLightSrc?: string
	/** Optional: specific dark-mode image */
	imageDarkSrc?: string
	imageAlt?: string
	actionText?: string
}>(), {
	title: 'No results found',
	description: 'Try adjusting your filters or search criteria.',
	imageSrc: '',
	imageLightSrc: 'https://picsum.photos/id/29/800',
	imageDarkSrc: 'https://picsum.photos/id/46/800',
	imageAlt: 'Empty state illustration',
	actionText: '',
})

const emit = defineEmits<{
	(e: 'action'): void
}>()

const lightImage = computed(() => props.imageSrc || props.imageLightSrc)
const darkImage = computed(() => props.imageSrc || props.imageDarkSrc)
</script>

<template>
	<div class="py-10 text-center">
		<div class="mx-auto flex max-w-xl flex-col items-center">
			<!-- Illustration (larger) -->
			<UColorModeImage
				:light="lightImage"
				:dark="darkImage"
				:alt="imageAlt"
				class="mb-6 h-48 w-full max-w-sm object-contain opacity-90 md:h-64 md:max-w-md"
				loading="lazy"
			/>

			<h3 class="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">
				{{ title }}
			</h3>

			<p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
				{{ description }}
			</p>

			<button
				v-if="actionText"
				type="button"
				@click="emit('action')"
				class="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
			>
				{{ actionText }}
			</button>
		</div>
	</div>
</template>
