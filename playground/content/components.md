---
title: Components
description: Reference documentation for all UI components provided by the Nuxt GraphQL Listing module.
order: 5
---

# Components Reference

The module provides a set of Vue components for building listing interfaces. All components are auto-registered when the module is installed.

## Layout Components

### ListingLayout

The main layout wrapper that combines all listing elements: filters, sorting, pagination, and content display.

```vue
<template>
  <ListingLayout
    :items="items"
    :total="total"
    :loading="loading"
    :error="error"
    :filters="filters"
    :filters-config="filterConfig"
    :sort="sort"
    :sort-config="sortConfig"
    :offset="offset"
    :limit="limit"
    :facets="facets"
    filters-title="Filters"
    sort-label="Sort by"
    :has-grid-switch="true"
    @filter-change="setFilter"
    @sort-change="setSort"
    @offset-change="setOffset"
    @limit-change="setLimit"
  >
    <template #content="{ items, viewMode }">
      <ProductGrid v-if="viewMode === 'grid'" :products="items" />
      <ProductList v-else :products="items" />
    </template>
  </ListingLayout>
</template>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `T[]` | Yes | Array of items to display |
| `total` | `number` | Yes | Total number of matching items |
| `loading` | `boolean` | Yes | Loading state |
| `error` | `Error \| null` | Yes | Error object if any |
| `filters` | `object` | Yes | Current filter state |
| `filtersConfig` | `FilterFieldConfig[]` | Yes | Filter configuration array |
| `sort` | `SortInput[]` | Yes | Current sort state |
| `sortConfig` | `SortOption[]` | Yes | Available sort options |
| `offset` | `number` | Yes | Current pagination offset |
| `limit` | `number` | Yes | Items per page |
| `facets` | `object \| null` | No | Facet data for dynamic filter bounds |
| `filtersTitle` | `string` | No | Title for filters panel |
| `sortLabel` | `string` | No | Label for sort dropdown |
| `hasGridSwitch` | `boolean` | No | Show grid/list toggle (default: `true`) |
| `condensed` | `boolean` | No | When `true`, hides the sidebar filters and shows them in a dropdown from the toolbar instead (default: `false`) |
| `emptyTitle` | `string` | No | Title for empty state (uses UEmpty) |
| `emptyDescription` | `string` | No | Description for empty state |
| `emptyIcon` | `string` | No | Icon for empty state (default: `i-heroicons-exclamation-triangle`) |
| `emptyAvatar` | `AvatarProps` | No | Avatar props for empty state |
| `emptyActions` | `ButtonProps[]` | No | Action buttons for empty state |
| `errorRedirect` | `string` | No | Redirect URL for error state (uses UError) |
| `errorClear` | `boolean \| ButtonProps` | No | Clear/retry button config for error state |

**Condensed Mode Example:**

When you want a more compact layout without the sidebar, use condensed mode:

```vue
<template>
  <ListingLayout
    :condensed="true"
    :items="items"
    :filters="filters"
    :filters-config="filterConfig"
    ...
  >
    <!-- Content spans full width, filters accessible via toolbar button -->
  </ListingLayout>
</template>
```

In condensed mode:
- The filters sidebar is hidden
- Content area spans full width (12 columns instead of 9)
- A filter button appears in the toolbar that opens a drawer with filters
- Useful for pages where screen real estate is limited or filters are secondary

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `filter-change` | `Partial<Filters>` | Emitted when filters change |
| `sort-change` | `SortInput[]` | Emitted when sort changes |
| `offset-change` | `number` | Emitted when page changes |
| `limit-change` | `number` | Emitted when page size changes |

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| `content` | `{ items, viewMode }` | Main content area |
| `header` | - | Content header (above toolbar) |
| `top-bar-start` | - | Start of toolbar (before sort) |
| `top-bar-end` | - | End of toolbar (after view switch) |
| `loading` | - | Custom loading state |
| `empty` | - | Custom empty state (replaces UEmpty entirely) |
| `error` | `{ error }` | Custom error state (replaces UError entirely) |

**UEmpty Forwarded Slots (for customizing default empty state):**

| Slot | Props | Description |
|------|-------|-------------|
| `empty-header` | - | UEmpty header slot |
| `empty-leading` | - | UEmpty leading slot (icon/avatar area) |
| `empty-title` | - | UEmpty title slot |
| `empty-description` | - | UEmpty description slot |
| `empty-body` | - | UEmpty body slot |
| `empty-actions` | - | UEmpty actions slot |
| `empty-footer` | - | UEmpty footer slot |

**UError Forwarded Slots (for customizing default error state):**

| Slot | Props | Description |
|------|-------|-------------|
| `error-default` | `{ error }` | UError default slot |
| `error-status-code` | `{ error }` | UError statusCode slot |
| `error-status-message` | `{ error }` | UError statusMessage slot |
| `error-message` | `{ error }` | UError message slot |
| `error-links` | `{ error }` | UError links slot |

### ListingTopbar

Toolbar component with sort dropdown, mobile filter trigger, and view mode switch.

```vue
<ListingTopbar
  :sort="sort"
  :sort-config="sortConfig"
  :has-grid-switch="true"
  :view-mode="viewMode"
  @sort-change="handleSortChange"
  @view-mode-change="handleViewModeChange"
  @open-filters="openFiltersDrawer"
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `sort` | `SortInput[]` | Current sort state |
| `sortConfig` | `SortOption[]` | Available sort options |
| `hasGridSwitch` | `boolean` | Show view mode toggle |
| `viewMode` | `'grid' \| 'list'` | Current view mode |

### ListingViewModeSwitch

Toggle between grid and list views with animated pill indicator.

```vue
<ListingViewModeSwitch
  :model-value="viewMode"
  @update:model-value="setViewMode"
/>
```

## Filter Components

### ListingFiltersAsidePanel

Desktop sidebar panel for filters (sticky positioned).

```vue
<ListingFiltersAsidePanel
  :filters="filters"
  :filters-config="filterConfig"
  :facets="facets"
  title="Filters"
  @change="handleFilterChange"
  @clear="handleClearFilters"
/>
```

### ListingFiltersDrawer

Mobile-friendly modal drawer for filters.

```vue
<ListingFiltersDrawer
  v-model:open="isDrawerOpen"
  :filters="filters"
  :filters-config="filterConfig"
  :facets="facets"
  @apply="handleApplyFilters"
  @clear="handleClearFilters"
/>
```

### ListingFiltersRenderer

Dynamically renders the appropriate filter component based on configuration.

```vue
<ListingFiltersRenderer
  :field="filterConfig"
  :filters="filters"
  :facet-min="facets?.priceMin"
  :facet-max="facets?.priceMax"
  :facet-options="facets?.categories"
  @change="handleFilterChange"
/>
```

### ListingFiltersSort

Sort dropdown component.

```vue
<ListingFiltersSort
  :sort="sort"
  :options="sortConfig"
  :label="sortLabel"
  @change="handleSortChange"
/>
```

## Individual Filter Field Components

### ListingFiltersFieldSelect

Dropdown selector for single-value filters.

```vue
<ListingFiltersFieldSelect
  :field="{
    key: 'category',
    field: 'categoryId',
    kind: 'select',
    label: 'Category',
    options: categoryOptions
  }"
  :filters="filters"
  @change="handleChange"
/>
```

### ListingFiltersFieldNumberRange

Min/max inputs with optional slider for numeric ranges.

```vue
<ListingFiltersFieldNumberRange
  :field="{
    key: 'price',
    field: 'price',
    kind: 'decimal-range',
    label: 'Price'
  }"
  :filters="filters"
  :facet-min="facets?.priceMin"
  :facet-max="facets?.priceMax"
  @change="handleChange"
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `field` | `RangeFilterFieldConfig` | Filter configuration |
| `filters` | `object` | Current filter state |
| `facetMin` | `number \| null` | Minimum bound from facets |
| `facetMax` | `number \| null` | Maximum bound from facets |

### ListingFiltersFieldDateRange

Date range picker.

```vue
<ListingFiltersFieldDateRange
  :field="{
    key: 'createdAt',
    field: 'createdAt',
    kind: 'datetime-range',
    label: 'Created Date'
  }"
  :filters="filters"
  @change="handleChange"
/>
```

### ListingFiltersFieldDateRangeGroup

Radio selection for date field + date range picker.

```vue
<ListingFiltersFieldDateRangeGroup
  :field="{
    key: 'dates',
    kind: 'datetime-range-group',
    label: 'Date Filter',
    dateFields: [
      { field: 'createdAt', label: 'Created' },
      { field: 'updatedAt', label: 'Updated' }
    ]
  }"
  :filters="filters"
  @change="handleChange"
/>
```

### ListingFiltersFieldSwitchGroup

Multiple boolean toggles.

```vue
<ListingFiltersFieldSwitchGroup
  :field="{
    key: 'flags',
    kind: 'switch-group',
    label: '',
    switches: [
      { field: 'inStock', label: 'In Stock' },
      { field: 'onSale', label: 'On Sale' }
    ]
  }"
  :filters="filters"
  @change="handleChange"
/>
```

### ListingFiltersFieldSwitchMulti

Multi-select checkboxes for array values.

```vue
<ListingFiltersFieldSwitchMulti
  :field="{
    key: 'tags',
    field: 'tags',
    kind: 'switch-multi',
    label: 'Tags',
    options: [
      { label: 'New', value: 'new' },
      { label: 'Sale', value: 'sale' }
    ]
  }"
  :filters="filters"
  @change="handleChange"
/>
```

### ListingFiltersFieldRating

Star rating selector.

```vue
<ListingFiltersFieldRating
  :field="{
    key: 'rating',
    field: 'rating',
    kind: 'rating',
    label: 'Rating',
    steps: [4, 3, 2, 1]
  }"
  :filters="filters"
  @change="handleChange"
/>
```

### ListingFiltersFieldCategoryTree

Hierarchical category selector.

```vue
<ListingFiltersFieldCategoryTree
  :field="{
    key: 'category',
    field: 'categoryId',
    kind: 'category-tree',
    label: 'Categories'
  }"
  :filters="filters"
  :facet-options="facets?.categories"
  @change="handleChange"
/>
```

## State Components

### ListingLoading

Skeleton loading state.

```vue
<ListingLoading :count="12" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `12` | Number of skeleton items |

## Complete Example

```vue
<template>
  <div class="container mx-auto px-4 py-8">
    <ListingLayout
      :items="items"
      :total="total"
      :loading="loading"
      :error="error"
      :filters="filters"
      :filters-config="filterConfig"
      :sort="sort"
      :sort-config="sortConfig"
      :offset="offset"
      :limit="limit"
      :facets="facets"
      @filter-change="setFilter"
      @sort-change="setSort"
      @offset-change="setOffset"
      @limit-change="setLimit"
    >
      <!-- Custom toolbar additions -->
      <template #top-bar-start>
        <span class="text-sm text-gray-500">
          {{ total }} products found
        </span>
      </template>

      <!-- Main content -->
      <template #content="{ items, viewMode }">
        <div
          :class="viewMode === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
            : 'flex flex-col gap-4'"
        >
          <ProductCard
            v-for="product in items"
            :key="product.id"
            :product="product"
            :layout="viewMode"
          />
        </div>
      </template>

      <!-- Custom loading state -->
      <template #loading>
        <div class="grid grid-cols-4 gap-4">
          <ProductCardSkeleton v-for="i in 12" :key="i" />
        </div>
      </template>

      <!-- Custom empty state -->
      <template #empty>
        <div class="text-center py-16">
          <Icon name="search" class="w-16 h-16 mx-auto text-gray-300" />
          <h3 class="mt-4 text-lg font-medium">No products found</h3>
          <p class="mt-2 text-gray-500">
            Try adjusting your filters or search terms
          </p>
          <UButton class="mt-4" @click="resetFilters">
            Clear all filters
          </UButton>
        </div>
      </template>

      <!-- Custom error state -->
      <template #error="{ error }">
        <div class="text-center py-16">
          <Icon name="alert-circle" class="w-16 h-16 mx-auto text-red-500" />
          <h3 class="mt-4 text-lg font-medium">Something went wrong</h3>
          <p class="mt-2 text-gray-500">{{ error.message }}</p>
          <UButton class="mt-4" @click="refetch">
            Try again
          </UButton>
        </div>
      </template>
    </ListingLayout>
  </div>
</template>

<script setup lang="ts">
const {
  items,
  total,
  loading,
  error,
  filters,
  sort,
  offset,
  limit,
  facets,
  setFilter,
  setSort,
  setOffset,
  setLimit,
  refetch
} = useProductsListing()

const filterConfig = useProductFilterConfig()
const sortConfig = useProductSortConfig()

function resetFilters() {
  setFilter({
    categoryId: null,
    priceMin: null,
    priceMax: null,
    rating: null,
    inStock: null,
    onSale: null
  })
}
</script>
```

## Styling

Components use Nuxt UI and Tailwind CSS. You can customize styles through:

1. **Tailwind Config**: Extend colors, spacing, etc.
2. **CSS Variables**: Override Nuxt UI CSS variables
3. **Slots**: Replace entire sections with custom components

## Next Steps

- Learn about [URL State](/docs/url-state) management
- See [i18n](/docs/i18n) for localization
- View [Examples](/docs/examples) for more patterns
