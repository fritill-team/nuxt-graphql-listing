<script setup lang="ts">
type ViewMode = 'grid' | 'list'

const props = defineProps<{
	modelValue: ViewMode
	label?: string
}>()

const emit = defineEmits<{
	'update:modelValue': [value: ViewMode]
}>()

const isGrid = computed(() => props.modelValue === 'grid')

const setGrid = () => {
	if (!isGrid.value) emit('update:modelValue', 'grid')
}

const setList = () => {
	if (isGrid.value) emit('update:modelValue', 'list')
}
</script>

<template>
	<div
		class="inline-flex items-center"
		role="group"
		:aria-label="label || 'Toggle view mode'"
	>
    <span class="sr-only">
      {{ label || 'Toggle view mode' }}
    </span>

		<!-- Track: bordered, no background -->
		<div
			class="view-switch-track rounded-full relative border border-primary-600/40"
		>
			<!-- Circular sliding pill -->
			<div
				class="view-switch-pill bg-primary-600 rounded-full shadow-lg"
				:class="isGrid ? 'view-switch-pill--left' : 'view-switch-pill--right'"
			/>

			<!-- Grid button (left, ACTIVE when isOn === true) -->
			<button
				type="button"
				class="view-switch-icon view-switch-icon--left cursor-pointer focus:outline-none"
				:aria-pressed="isGrid"
				@click="setGrid"
			>
				<Icon
					name="i-lucide-layout-grid"
					size="1.25rem"
					:class="isGrid ? 'text-white' : 'text-primary-600'"
				/>
			</button>

			<!-- List button (right, ACTIVE when isOn === false) -->
			<button
				type="button"
				class="view-switch-icon view-switch-icon--right cursor-pointer focus:outline-none"
				:aria-pressed="!isGrid"
				@click="setList"
			>
				<Icon
					name="i-lucide-menu"
					size="1.25rem"
					:class="isGrid ? 'text-primary-600' : 'text-white'"
				/>
			</button>
		</div>
	</div>
</template>

<style scoped>
/* ========== MOBILE (default) ========== */
/* Smaller track */
.view-switch-track {
	width: 3.5rem;   /* ~56px */
	height: 2rem;    /* ~32px */
}

/* Pill:
   track 32px high, pill 24px → (32-24)/2 = 4px padding top+bottom
*/
.view-switch-pill {
	position: absolute;
	width: 1.5rem;   /* ~24px */
	height: 1.5rem;
	top: 50%;
	transform: translate(-50%, -50%);
	transition: left 0.2s ease;
}

/* Left/right: centers at 25% and 75% */
.view-switch-pill--left {
	left: 25%;
}

.view-switch-pill--right {
	left: 75%;
}

/* Icons share same centers as pill */
.view-switch-icon {
	position: absolute;
	width: 1.5rem;
	height: 1.5rem;
	top: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	align-items: center;
	justify-content: center;
	background: transparent;
	border: none;
	padding: 0;
}

.view-switch-icon--left {
	left: 25%;
}

.view-switch-icon--right {
	left: 75%;
}

/* ========== DESKTOP (md and up) ========== */
@media (min-width: 768px) {
	.view-switch-track {
		width: 4.5rem;    /* ~72px */
		height: 2.25rem;  /* ~36px */
	}

	/* track 36px high, pill 28px → 4px padding */
	.view-switch-pill {
		width: 1.75rem;   /* ~28px */
		height: 1.75rem;
	}

	.view-switch-icon {
		width: 1.75rem;
		height: 1.75rem;
	}
}
</style>
