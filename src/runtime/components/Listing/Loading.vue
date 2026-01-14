<script setup lang="ts">
const { t } = useListingI18n()
</script>

<template>
	<div class="py-8 text-center" role="status" aria-live="polite">
		<div
			class="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-gray-100"
		/>
		<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
			{{ t('listing.loading') }}
		</p>
	</div>
</template>
