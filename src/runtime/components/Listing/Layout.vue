<script setup>
import { computed, ref, useSlots } from "vue";
import Topbar from "./Topbar.vue";
import { useListingI18n } from "../../composables/useListingI18n";
const props = defineProps({
  filters: { type: null, required: true },
  filtersConfig: { type: Array, required: true },
  facets: { type: null, required: false },
  sortConfig: { type: Array, required: true },
  sort: { type: [Array, null], required: true },
  total: { type: Number, required: true },
  limit: { type: Number, required: true },
  offset: { type: Number, required: true },
  items: { type: Array, required: true },
  loading: { type: Boolean, required: true },
  error: { type: [Error, null], required: true },
  filtersTitle: { type: String, required: false },
  sortLabel: { type: String, required: false },
  hasGridSwitch: { type: Boolean, required: false },
  viewMode: { type: String, required: false },
  condensed: { type: Boolean, required: false },
  emptyTitle: { type: String, required: false },
  emptyDescription: { type: String, required: false },
  emptyIcon: { type: String, required: false },
  emptyAvatar: { type: Object, required: false },
  emptyActions: { type: Array, required: false },
  errorRedirect: { type: String, required: false },
  errorClear: { type: [Boolean, Object], required: false }
});
const slots = useSlots();
const emit = defineEmits(["update:sort", "update:filters", "update:offset"]);
const { t } = useListingI18n();
const viewMode = ref(props.viewMode || "grid");
const showSidebar = computed(() => !props.condensed && props.filtersConfig.length > 0);
const page = computed({
  get() {
    return Math.floor(props.offset / props.limit) + 1;
  },
  set(newPage) {
    const safePage = newPage < 1 ? 1 : newPage;
    emit("update:offset", (safePage - 1) * props.limit);
  }
});
const pageCount = computed(() => {
  if (!props.limit || props.limit <= 0) return 1;
  if (!props.total || props.total <= 0) return 1;
  return Math.ceil(props.total / props.limit);
});
const from = computed(() => {
  if (!props.total || props.total === 0) return 0;
  return props.offset + 1;
});
const to = computed(() => {
  if (!props.total || props.total === 0) return 0;
  return Math.min(props.offset + props.items.length, props.total);
});
function onFilterChange(patch) {
  emit("update:filters", patch);
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-12 w-full">
    <!-- Desktop Filters (md+) -->
    <LazyListingFiltersAsidePanel
      v-if="showSidebar"
      :filters="filters"
      :config="filtersConfig"
      :facets="facets"
      @change="onFilterChange"
    />

    <!-- Content -->
    <div :class="['space-y-4', showSidebar ? 'md:col-span-9' : 'md:col-span-12']">
      <!-- Title / Toolbar -->
      <slot name="header"/>

      <Topbar
        :sort-config="sortConfig"
        :sort="sort"
        :sort-label="sortLabel"
        :has-grid-switch="hasGridSwitch"
        :condensed="condensed"
        v-model:view-mode="viewMode"
        :filters="filters"
        :filters-config="filtersConfig"
        :facets="facets"
        @update:sort="emit('update:sort', $event)"
        @update:filters="emit('update:filters', $event)"
      >
        <template #start>
          <slot name="top-bar-start">
            <div class="font-semibold">Toolbar</div>
          </slot>
        </template>
      </Topbar>

      <!-- Content placeholder -->
      <div class="my-6">
        <!-- Error state -->
        <template v-if="error">
          <slot name="error" :error="error">
            <UError
              :error="{ message: error?.message || t('listing.errorTitle') }"
              :redirect="errorRedirect"
              :clear="errorClear ?? { label: t('listing.retry'), onClick: () => $emit('update:offset', 0) }"
            >
              <!-- Forward UError slots -->
              <template v-if="slots['error-default']" #default>
                <slot name="error-default" :error="error" />
              </template>
              <template v-if="slots['error-status-code']" #statusCode>
                <slot name="error-status-code" :error="error" />
              </template>
              <template v-if="slots['error-status-message']" #statusMessage>
                <slot name="error-status-message" :error="error" />
              </template>
              <template v-if="slots['error-message']" #message>
                <slot name="error-message" :error="error" />
              </template>
              <template v-if="slots['error-links']" #links>
                <slot name="error-links" :error="error" />
              </template>
            </UError>
          </slot>
        </template>

        <!-- Loading state -->
        <template v-else-if="loading">
          <slot name="loading">
            <ListingLoading/>
          </slot>
        </template>

        <!-- Empty state -->
        <template v-else-if="items.length === 0">
          <slot name="empty">
            <UEmpty
              :title="emptyTitle ?? t('listing.empty.title')"
              :description="emptyDescription ?? t('listing.empty.description')"
              :icon="emptyIcon ?? 'i-heroicons-exclamation-triangle'"
              :avatar="emptyAvatar"
              :actions="emptyActions ?? [
  {
    icon: 'i-lucide-refresh-cw',
    label: t('listing.empty.resetFilters'),
    color: 'neutral',
    variant: 'subtle',
    onClick: () => {
      $emit('update:filters', {});
      $emit('update:offset', 0);
    }
  }
]"
            >
              <!-- Forward UEmpty slots -->
              <template v-if="slots['empty-header']" #header>
                <slot name="empty-header" />
              </template>
              <template v-if="slots['empty-leading']" #leading>
                <slot name="empty-leading" />
              </template>
              <template v-if="slots['empty-title']" #title>
                <slot name="empty-title" />
              </template>
              <template v-if="slots['empty-description']" #description>
                <slot name="empty-description" />
              </template>
              <template v-if="slots['empty-body']" #body>
                <slot name="empty-body" />
              </template>
              <template v-if="slots['empty-actions']" #actions>
                <slot name="empty-actions" />
              </template>
              <template v-if="slots['empty-footer']" #footer>
                <slot name="empty-footer" />
              </template>
            </UEmpty>
          </slot>
        </template>

        <!-- Normal content -->
        <template v-else>
          <slot
            name="content"
            :items="items"
            :total="total"
            :view-mode="viewMode"
          />
        </template>

        <div class="flex items-center justify-between gap-2 mt-6" v-if="!loading && items.length > 0">
          <div class="flex flex-wrap gap-2 text-sm text-neutral dark:text-gray-300 font-medium">
            <span v-text="t('listing.pagination', { page, pageCount })"/>
            <span class="">•</span>
            <span v-if="!loading" v-text="t('listing.results', { from, to, total })"/>
          </div>
          <div class="flex gap-2">
            <UPagination
              v-model:page="page"
              :total="total"
              :items-per-page="limit"
              size="lg"
            />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
