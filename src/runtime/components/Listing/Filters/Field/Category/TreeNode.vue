<script setup lang="ts">
import { computed } from "vue";
import { useListingI18n } from "../../../../../composables/useListingI18n";

interface TreeNodeData {
  id?: string
  categoryId: string
  pathText: string
  name: string
  slug: string
  count?: number
  children: TreeNodeData[]
}

const props = defineProps<{
  node: TreeNodeData
  pathKey: string
  selected: string | null
  expanded: Record<string, boolean>
}>();
const emit = defineEmits<{
  toggle: [pathKey: string]
  select: [slug: string]
}>();
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
    <div class="flex items-center gap-1">
      <!-- Expand/collapse toggle -->
      <button
        v-if="hasChildren"
        type="button"
        class="inline-flex items-center justify-center size-6 rounded-md
               hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
        :aria-label="isExpanded ? t('listing.collapse') : t('listing.expand')"
        @click="toggle"
      >
        <UIcon
          :name="isExpanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          class="size-3.5 transition-transform rtl:rotate-180"
        />
      </button>
      <span v-else class="size-6 inline-block shrink-0" aria-hidden="true"/>

      <!-- Category button -->
      <button
        type="button"
        class="flex-1 flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg transition-colors text-start min-w-0"
        :class="[
          isSelectable
            ? 'cursor-pointer'
            : 'cursor-default opacity-60',
          isSelected
            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
        ]"
        :disabled="!isSelectable"
        :aria-selected="isSelected"
        @click="select"
      >
        <span
          class="truncate"
          :class="[
            isSelected ? 'font-semibold' : 'text-gray-700 dark:text-gray-300',
            !isSelectable && 'text-gray-500 dark:text-gray-500',
          ]"
        >
          {{ node.name }}
        </span>
        <span
          v-if="node.count != null"
          class="text-[10px] tabular-nums shrink-0 px-1.5 py-0.5 rounded-full"
          :class="isSelected
            ? 'bg-primary-100 dark:bg-primary-800/50 text-primary-600 dark:text-primary-400'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'"
        >
          {{ node.count }}
        </span>
      </button>
    </div>

    <!-- Children -->
    <ul
      v-if="hasChildren && isExpanded"
      class="ms-3 border-s-2 border-gray-100 dark:border-gray-800 ps-1 mt-0.5"
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