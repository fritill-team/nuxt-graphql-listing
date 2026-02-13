<script setup lang="ts">
import { ref, computed } from "vue";
import CategoryTreeNode from "./TreeNode.vue";
import { useListingI18n } from "../../../../../composables/useListingI18n";
import type { CategoryTreeFilterFieldConfig, CategoryFacet } from "../../../../../types/listing";

interface TreeNode {
  id?: string
  categoryId: string
  pathText: string
  name: string
  slug: string
  children: TreeNode[]
}

const props = withDefaults(defineProps<{
  field: CategoryTreeFilterFieldConfig
  filters: Record<string, any>
  facetOptions?: CategoryFacet[]
}>(), {
  facetOptions: undefined
});
const emit = defineEmits<{
  change: [patch: Record<string, any>]
}>();
const { locale, t } = useListingI18n();
function buildTrees(cats: CategoryFacet[] | undefined): Record<string, TreeNode[]> {
  const out = {};
  if (!cats?.length) return out;
  const nodeMap = /* @__PURE__ */ new Map();
  for (const c of cats) {
    const treeKey = c.treeId || "default";
    if (!out[treeKey]) {
      out[treeKey] = [];
    }
    const path = (c.pathText || "").split(/\s*[>/]\s*/).filter(Boolean);
    if (!path.length) continue;
    const translation = c.translations.find((t2) => t2.language === locale.value) || c.translations[0];
    if (!translation) continue;
    let currentPath = treeKey;
    let parentNode = null;
    for (let i = 0; i < path.length; i++) {
      const segment = path[i];
      const fullPath = currentPath + "/" + segment;
      let node = nodeMap.get(fullPath);
      if (!node) {
        const isLeaf = i === path.length - 1;
        node = {
          categoryId: isLeaf ? c.categoryId : "",
          pathText: isLeaf ? c.pathText || "" : "",
          name: isLeaf ? translation.name : segment,
          slug: isLeaf ? translation.slug : segment,
          children: []
        };
        if (isLeaf) {
          node.id = translation.slug;
        }
        nodeMap.set(fullPath, node);
        if (parentNode) {
          parentNode.children.push(node);
        } else {
          out[treeKey].push(node);
        }
      } else {
        if (i === path.length - 1) {
          node.id = translation.slug;
          node.name = translation.name;
          node.slug = translation.slug;
          node.categoryId = c.categoryId;
          node.pathText = c.pathText || "";
        }
      }
      parentNode = node;
      currentPath = fullPath;
    }
  }
  return out;
}
const trees = computed(() => buildTrees(props.facetOptions));
const selected = computed({
  get: () => props.filters?.[props.field.field] ?? null,
  set: (val) => emit("change", { [props.field.field]: val })
});
function clearSelection() {
  selected.value = null;
}
const expanded = ref<Record<string, boolean>>({});
function onToggle(pathKey: string) {
  expanded.value[pathKey] = !expanded.value[pathKey];
}
function onSelect(slug: string) {
  selected.value = slug;
}
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-2">
			<span class="text-sm font-semibold">{{ field.label || t("listing.categories") }}</span>
			<UButton size="xs" color="neutral" variant="ghost" @click="clearSelection" :disabled="!selected">
				{{ t("listing.clear") }}
			</UButton>
		</div>
		<div v-if="!facetOptions || facetOptions.length === 0" class="text-sm text-neutral-500">
			{{ t("listing.noCategories") }}
		</div>
		<div v-else class="text-sm">
			<template v-for="(nodes, treeId) in trees" :key="treeId">
				<ul class="m-0 p-0">
					<CategoryTreeNode
						v-for="(node, idx) in nodes"
						:key="treeId + '/' + node.slug + '-' + idx"
						:node="node"
						:path-key="treeId + '/' + node.slug + '-' + idx"
						:selected="selected"
						:expanded="expanded"
						@toggle="onToggle"
						@select="onSelect"
					/>
				</ul>
			</template>
		</div>
	</div>
</template>
