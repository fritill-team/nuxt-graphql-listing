<script setup lang="ts">
import { computed } from "vue";
const props = withDefaults(defineProps<{
  modelValue: string
  label?: string
}>(), {
  label: undefined
});
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>();
const isGrid = computed(() => props.modelValue === "grid");
const setGrid = () => {
  if (!isGrid.value) emit("update:modelValue", "grid");
};
const setList = () => {
  if (isGrid.value) emit("update:modelValue", "list");
};
</script>

<template>
	<div
		class="inline-flex items-center"
		role="group"
		:aria-label="label || 'Toggle view mode'"
	>
    <span class="sr-only">
      {{ label || "Toggle view mode" }}
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
.view-switch-track{height:2rem;width:3.5rem}.view-switch-pill{height:1.5rem;position:absolute;top:50%;transform:translate(-50%,-50%);transition:left .2s ease;width:1.5rem}.view-switch-pill--left{left:25%}.view-switch-pill--right{left:75%}.view-switch-icon{align-items:center;background:transparent;border:none;display:flex;height:1.5rem;justify-content:center;padding:0;position:absolute;top:50%;transform:translate(-50%,-50%);width:1.5rem}.view-switch-icon--left{left:25%}.view-switch-icon--right{left:75%}@media (min-width:768px){.view-switch-track{height:2.25rem;width:4.5rem}.view-switch-icon,.view-switch-pill{height:1.75rem;width:1.75rem}}
</style>
