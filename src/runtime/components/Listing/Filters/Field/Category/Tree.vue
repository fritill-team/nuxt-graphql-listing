<script setup lang="ts">
import type {CategoryTreeFilterFieldConfig} from '../../../../../types/listing'
import CategoryTreeNode from './TreeNode.vue'

interface FacetCategory {
	categoryId: string;
	pathText?: string | null;
	treeId?: string
	translations: {
		name: string;
		slug: string;
		language: string;
	}[]
}

interface Node {
	id?: string;
	name: string;
	slug: string;
	categoryId: string;
	pathText: string;
	children: Node[]
}

const props = defineProps<{
	field: CategoryTreeFilterFieldConfig<string>
	filters: Record<string, any>
	facetOptions?: FacetCategory[]
}>()

const emit = defineEmits<{ (e: 'change', patch: Record<string, any>): void }>()

const { locale, t } = useListingI18n()

function buildTrees(cats: FacetCategory[] | undefined): Record<string, Node[]> {
	const out: Record<string, Node[]> = {}
	if (!cats?.length) return out

	// Create a map to store all categories by their full path
	const nodeMap = new Map<string, Node>()

	for (const c of cats) {
		const treeKey = c.treeId || 'default'

		if (!out[treeKey]) {
			out[treeKey] = []
		}

		const path = (c.pathText || '').split(/\s*[>/]\s*/).filter(Boolean)
		if (!path.length) continue

		// Get translation for current locale
		const translation = c.translations.find(t => t.language === locale.value)
			|| c.translations[0]

		if (!translation) continue

		let currentPath = treeKey
		let parentNode: Node | null = null

		// Build the path from root to leaf
		for (let i = 0; i < path.length; i++) {
			const segment = path[i]
			const fullPath = currentPath + '/' + segment

			// Check if this node already exists
			let node = nodeMap.get(fullPath)

			if (!node) {
				// Create new node
				const isLeaf = i === path.length - 1

				node = {
					categoryId: isLeaf ? c.categoryId : '',
					pathText: isLeaf ? (c.pathText || '') : '',
					name: isLeaf ? translation.name : segment,
					slug: isLeaf ? translation.slug : segment,
					children: []
				}

				// Only leaf nodes get an ID (the slug)
				if (isLeaf) {
					node.id = translation.slug
				}

				nodeMap.set(fullPath, node)

				// Add to parent's children or root
				if (parentNode) {
					parentNode.children.push(node)
				} else {
					out[treeKey].push(node)
				}
			} else {
				// Node exists, but if this is the leaf, update its properties
				if (i === path.length - 1) {
					node.id = translation.slug
					node.name = translation.name
					node.slug = translation.slug
					node.categoryId = c.categoryId
					node.pathText = c.pathText || ''
				}
			}

			parentNode = node
			currentPath = fullPath
		}
	}

	return out
}

const trees = computed(() => buildTrees(props.facetOptions))

const selected = computed<string | null>({
	get: () => props.filters?.[props.field.field] ?? null,
	set: (val: string | null) => emit('change', {[props.field.field]: val}),
})

function clearSelection() {
	selected.value = null
}

const expanded = ref<Record<string, boolean>>({})

function onToggle(pathKey: string) {
	expanded.value[pathKey] = !expanded.value[pathKey]
}

function onSelect(slug: string) {
	selected.value = slug
}
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-2">
			<span class="text-sm font-semibold">{{ field.label || t('listing.categories') }}</span>
			<UButton size="xs" color="neutral" variant="ghost" @click="clearSelection" :disabled="!selected">
				{{ t('listing.clear') }}
			</UButton>
		</div>
		<div v-if="!facetOptions || facetOptions.length === 0" class="text-sm text-neutral-500">
			{{ t('listing.noCategories') }}
		</div>
		<div v-else class="text-sm">
			<template v-for="(nodes, treeId) in trees" :key="treeId as string">
				<ul class="m-0 p-0">
					<CategoryTreeNode
						v-for="(node, idx) in nodes"
						:key="(treeId as string) + '/' + node.slug + '-' + idx"
						:node="node"
						:path-key="(treeId as string) + '/' + node.slug + '-' + idx"
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
