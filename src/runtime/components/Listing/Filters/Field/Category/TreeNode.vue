<script setup>
import { computed } from "vue";
import { useListingI18n } from "../../../../../composables/useListingI18n";
const props = defineProps({
  node: { type: Object, required: true },
  pathKey: { type: String, required: true },
  selected: { type: [String, null], required: true },
  expanded: { type: Object, required: true }
});
const emit = defineEmits(["toggle", "select"]);
const { t } = useListingI18n();
const hasChildren = computed(() => props.node.children && props.node.children.length > 0);
const isExpanded = computed(() => props.expanded[props.pathKey] ?? true);
const isSelectable = computed(() => !!props.node.id);
const isSelected = computed(() => props.selected === props.node.id);
function toggle() {
  emit("toggle", props.pathKey);
}
function select() {
  if (props.node.id) {
    emit("select", props.node.id);
  }
}
</script>

<template>
	<li class="my-0.5" role="treeitem" :aria-expanded="hasChildren ? isExpanded : void 0">
		<div class="flex items-center gap-2">
			<button
				v-if="hasChildren"
				type="button"
				class="inline-flex text-xs px-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
				:aria-label="isExpanded ? t('listing.collapse') : t('listing.expand')"
				@click="toggle"
			>
				<UIcon
					:name="isExpanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
					class="w-4 h-4 transition-transform rtl:rotate-180"
				/>
			</button>
			<span v-else class="w-6 inline-block" aria-hidden="true"/>

			<button
				type="button"
				class="text-start flex-1 py-0.5 px-1 rounded transition-colors"
				:class="[
  isSelectable ? 'hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer' : 'cursor-default opacity-60',
  isSelected && 'bg-neutral-100 dark:bg-neutral-800'
]"
				:disabled="!isSelectable"
				:aria-selected="isSelected"
				@click="select"
			>
        <span
	        :class="[
  isSelected && 'font-semibold text-primary-600 dark:text-primary-400',
  !isSelectable && 'text-neutral-500'
]"
        >
          {{ node.name }}
        </span>
			</button>
		</div>

		<ul
			v-if="hasChildren && isExpanded"
			class="ms-6 border-s border-neutral-200 dark:border-neutral-800 ps-2 mt-0.5"
			role="group"
		>
			<CategoryTreeNode
				v-for="(child, idx) in node.children"
				:key="pathKey + '/' + child.slug + '-' + idx"
				:node="child"
				:path-key="pathKey + '/' + child.slug + '-' + idx"
				:selected="selected"
				:expanded="expanded"
				@toggle="emit('toggle', $event)"
				@select="emit('select', $event)"
			/>
		</ul>
	</li>
</template>
