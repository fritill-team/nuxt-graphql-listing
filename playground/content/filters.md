---
title: Filters
description: Complete documentation for the filter system including all 13 filter control types (including custom filters) and configuration options.
order: 4
---

# Filter System

The module provides a powerful filter system with 13 different control types, including support for custom filter components. This page documents how to configure and use each filter type.

## Filter Configuration

Filters are configured as an array of `FilterFieldConfig` objects:

```ts
const filterConfig: FilterFieldConfig[] = [
  {
    key: 'category',
    field: 'categoryId',
    kind: 'select',
    label: 'Category',
    options: [
      { label: 'Electronics', value: 'electronics' },
      { label: 'Clothing', value: 'clothing' }
    ]
  },
  {
    key: 'price',
    field: 'price',
    kind: 'decimal-range',
    label: 'Price'
  }
]
```

## Base Configuration

All filter types share these base properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `key` | `string` | Yes | Unique identifier for the filter |
| `field` | `string` | Varies | GraphQL field name (some types don't need this) |
| `label` | `string` | Yes | User-facing label |
| `kind` | `FilterControlKind` | Yes | Type of filter control |

## Filter Control Types

### 1. Select (`select`)

Single-value dropdown selector.

```ts
{
  key: 'category',
  field: 'categoryId',
  kind: 'select',
  label: 'Category',
  options: [
    { label: 'All Categories', value: null },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Home & Garden', value: 'home-garden' }
  ]
}
```

**Filter State:**
```ts
{ categoryId: 'electronics' }
```

**URL:**
```
?categoryId=electronics
```

### 2. Boolean Select (`boolean-select`)

Dropdown for true/false values.

```ts
{
  key: 'inStock',
  field: 'inStock',
  kind: 'boolean-select',
  label: 'Availability',
  options: [
    { label: 'All', value: null },
    { label: 'In Stock', value: true },
    { label: 'Out of Stock', value: false }
  ]
}
```

**Filter State:**
```ts
{ inStock: true }
```

### 3. Integer Range (`int-range`)

Min/max inputs for integer values with optional slider.

```ts
{
  key: 'quantity',
  field: 'quantity',
  kind: 'int-range',
  label: 'Quantity'
}
```

**Filter State:**
```ts
{ quantityMin: 10, quantityMax: 100 }
```

**URL:**
```
?quantityMin=10&quantityMax=100
```

**With Facets:**

The component can use facet data for dynamic bounds:

```vue
<NumberRange
  :field="field"
  :filters="filters"
  :facet-min="facets?.quantityMin"
  :facet-max="facets?.quantityMax"
  @change="handleChange"
/>
```

### 4. Decimal Range (`decimal-range`)

Min/max inputs for decimal/float values with optional slider.

```ts
{
  key: 'price',
  field: 'price',
  kind: 'decimal-range',
  label: 'Price'
}
```

**Filter State:**
```ts
{ priceMin: 9.99, priceMax: 199.99 }
```

**URL:**
```
?priceMin=9.99&priceMax=199.99
```

### 5. DateTime Range (`datetime-range`)

Date picker for selecting date ranges.

```ts
{
  key: 'createdAt',
  field: 'createdAt',
  kind: 'datetime-range',
  label: 'Created Date'
}
```

**Filter State:**
```ts
{
  createdAtFrom: '2024-01-01T00:00:00Z',
  createdAtTo: '2024-12-31T23:59:59Z'
}
```

**URL:**
```
?createdAtFrom=2024-01-01&createdAtTo=2024-12-31
```

### 6. DateTime Range Group (`datetime-range-group`)

Radio buttons to choose which date field to filter, then a date range picker.

```ts
{
  key: 'dates',
  kind: 'datetime-range-group',
  label: 'Date Filter',
  dateFields: [
    { field: 'createdAt', label: 'Created Date' },
    { field: 'updatedAt', label: 'Updated Date' },
    { field: 'publishedAt', label: 'Published Date' }
  ]
}
```

**Filter State:**
```ts
{
  dateField: 'publishedAt',
  dateFrom: '2024-01-01T00:00:00Z',
  dateTo: '2024-06-30T23:59:59Z'
}
```

### 7. Switch Group (`switch-group`)

Multiple boolean toggles grouped together.

```ts
{
  key: 'flags',
  kind: 'switch-group',
  label: '',  // Often no label needed
  switches: [
    { field: 'isLive', label: 'Live Only' },
    { field: 'isFree', label: 'Free Only' },
    { field: 'hasDiscount', label: 'On Sale' },
    { field: 'isFeatured', label: 'Featured' }
  ]
}
```

**Filter State:**
```ts
{
  isLive: true,
  isFree: null,
  hasDiscount: true,
  isFeatured: null
}
```

**URL:**
```
?isLive=true&hasDiscount=true
```

### 8. Switch Multi (`switch-multi`)

Multiple selection checkboxes for a single field (array values).

```ts
{
  key: 'tags',
  field: 'tags',
  kind: 'switch-multi',
  label: 'Tags',
  options: [
    { label: 'New Arrival', value: 'new' },
    { label: 'Best Seller', value: 'bestseller' },
    { label: 'Editor\'s Choice', value: 'editors-choice' },
    { label: 'Limited Edition', value: 'limited' }
  ]
}
```

**Filter State:**
```ts
{ tags: ['new', 'bestseller'] }
```

**URL:**
```
?tags=new,bestseller
```

### 9. Rating (`rating`)

Star rating filter (e.g., "4 stars & up").

```ts
{
  key: 'rating',
  field: 'rating',
  kind: 'rating',
  label: 'Customer Rating',
  steps: [4, 3, 2, 1]  // Optional, defaults to [4, 3, 2, 1]
}
```

**Filter State:**
```ts
{ rating: 4 }  // 4 stars and up
```

**URL:**
```
?rating=4
```

**UI Display:**
- Shows star icons with "& up" text
- Radio buttons for each rating level
- "Any Rating" option to clear

### 10. Category Tree (`category-tree`)

Hierarchical category selector with expandable nodes.

```ts
{
  key: 'category',
  field: 'categoryId',
  kind: 'category-tree',
  label: 'Categories'
}
```

**Required Facet Data:**

The category tree requires hierarchical data from facets:

```ts
interface CategoryFacet {
  id: string
  name: string
  count: number
  children?: CategoryFacet[]
}

// Facets structure
{
  categories: [
    {
      id: '1',
      name: 'Electronics',
      count: 150,
      children: [
        { id: '1-1', name: 'Phones', count: 80 },
        { id: '1-2', name: 'Laptops', count: 70 }
      ]
    },
    {
      id: '2',
      name: 'Clothing',
      count: 200,
      children: [
        { id: '2-1', name: 'Men', count: 100 },
        { id: '2-2', name: 'Women', count: 100 }
      ]
    }
  ]
}
```

**Filter State:**
```ts
{ categoryId: '1-1' }  // Phones selected
```

### 11. Separator (`separator`)

Visual divider between filter sections (no filtering functionality).

```ts
{
  key: 'divider-1',
  kind: 'separator',
  label: ''
}
```

### 12. Custom (`custom`)

Inject your own custom filter component. This allows consuming apps to create specialized filters that aren't covered by the built-in types.

```ts
import MyCustomFilter from '~/components/filters/MyCustomFilter.vue'

{
  key: 'myFilter',
  field: 'customField',
  kind: 'custom',
  label: 'My Custom Filter',
  component: MyCustomFilter,
  props: {
    myCustomProp: 'some value',
    anotherProp: 123
  }
}
```

**Filter State:**
```ts
{ customField: 'user-selected-value' }
```

See the [Custom Filters Guide](#custom-filters-guide) section below for detailed instructions on creating custom filter components.

## Complete Filter Configuration Example

```ts
// composables/useProductFilterConfig.ts
export function useProductFilterConfig(): FilterFieldConfig[] {
  return [
    // Boolean switches at top
    {
      key: 'flags',
      kind: 'switch-group',
      label: '',
      switches: [
        { field: 'inStock', label: 'In Stock' },
        { field: 'onSale', label: 'On Sale' },
        { field: 'freeShipping', label: 'Free Shipping' }
      ]
    },

    // Separator
    { key: 'sep-1', kind: 'separator', label: '' },

    // Category tree
    {
      key: 'category',
      field: 'categoryId',
      kind: 'category-tree',
      label: 'Categories'
    },

    // Separator
    { key: 'sep-2', kind: 'separator', label: '' },

    // Price range
    {
      key: 'price',
      field: 'price',
      kind: 'decimal-range',
      label: 'Price'
    },

    // Rating
    {
      key: 'rating',
      field: 'rating',
      kind: 'rating',
      label: 'Customer Rating'
    },

    // Brand select
    {
      key: 'brand',
      field: 'brandId',
      kind: 'select',
      label: 'Brand',
      options: [
        { label: 'All Brands', value: null },
        { label: 'Apple', value: 'apple' },
        { label: 'Samsung', value: 'samsung' },
        { label: 'Sony', value: 'sony' }
      ]
    },

    // Tags multi-select
    {
      key: 'tags',
      field: 'tags',
      kind: 'switch-multi',
      label: 'Product Tags',
      options: [
        { label: 'New Arrival', value: 'new' },
        { label: 'Best Seller', value: 'bestseller' },
        { label: 'Eco-Friendly', value: 'eco' }
      ]
    }
  ]
}
```

## Using Filters with useListing

```ts
const filterConfig = useProductFilterConfig()

const defaultFilters = {
  inStock: null,
  onSale: null,
  freeShipping: null,
  categoryId: null,
  priceMin: null,
  priceMax: null,
  rating: null,
  brandId: null,
  tags: []
}

const listing = useListing({
  // ... other options
  initialFilters: defaultFilters,
  parseQuery: (query) => parseListingQuery(query, filterConfig),
  buildQuery: (state) => buildListingQuery(state, filterConfig),
  buildVariables: (state) => ({
    input: {
      filter: {
        inStock: state.filters.inStock,
        onSale: state.filters.onSale,
        freeShipping: state.filters.freeShipping,
        categoryId: state.filters.categoryId,
        price: {
          gte: state.filters.priceMin,
          lte: state.filters.priceMax
        },
        rating: state.filters.rating ? { gte: state.filters.rating } : null,
        brandId: state.filters.brandId,
        tags: state.filters.tags?.length ? { in: state.filters.tags } : null
      },
      // ... other variables
    }
  })
})
```

## Filter Components

Each filter type has a corresponding Vue component:

| Kind | Component |
|------|-----------|
| `select`, `boolean-select` | `ListingFiltersFieldSelect` |
| `int-range`, `decimal-range` | `ListingFiltersFieldNumberRange` |
| `datetime-range` | `ListingFiltersFieldDateRange` |
| `datetime-range-group` | `ListingFiltersFieldDateRangeGroup` |
| `switch-group` | `ListingFiltersFieldSwitchGroup` |
| `switch-multi` | `ListingFiltersFieldSwitchMulti` |
| `rating` | `ListingFiltersFieldRating` |
| `category-tree` | `ListingFiltersFieldCategoryTree` |
| `custom` | Your custom component (specified in config) |

The `ListingFiltersRenderer` component automatically selects the correct component based on the `kind` property.

## Facets System

Facets provide dynamic bounds and options for filters based on the current data. The backend sends facets **keyed by field name**, and each filter type expects a specific facet structure.

### Backend Response Structure

The backend should return facets as an object where each key matches a filter field name:

```ts
{
  items: [...],
  total: 100,
  facets: {
    // For range filters (int-range, decimal-range)
    price: { min: 0, max: 1000 },
    quantity: { min: 1, max: 500 },

    // For datetime-range filters
    createdAt: { min: '2024-01-01', max: '2024-12-31' },

    // For select and switch-multi filters
    categoryId: [
      { value: 'electronics', label: 'Electronics', count: 150 },
      { value: 'clothing', label: 'Clothing', count: 200 }
    ],

    // For rating filters
    rating: [
      { value: 5, count: 50 },
      { value: 4, count: 120 },
      { value: 3, count: 80 }
    ],

    // For category-tree filters
    category: [
      {
        id: '1',
        name: 'Electronics',
        count: 150,
        children: [
          { id: '1-1', name: 'Phones', count: 80 },
          { id: '1-2', name: 'Laptops', count: 70 }
        ]
      }
    ]
  }
}
```

### Facet Types by Filter Kind

| Filter Kind | Facet Type | Structure |
|-------------|------------|-----------|
| `int-range`, `decimal-range` | `RangeFacet` | `{ min: number, max: number }` |
| `datetime-range`, `datetime-range-group` | `DateRangeFacet` | `{ min: string, max: string }` (ISO dates) |
| `select`, `boolean-select`, `switch-multi` | `OptionFacet[]` | `[{ value, label?, count? }]` |
| `rating` | `RatingFacet[]` | `[{ value: number, count? }]` |
| `category-tree` | `CategoryFacet[]` | `[{ id, name, count?, children? }]` |
| `custom` | `unknown` | Raw data passed to component as `facet` prop |

### TypeScript Types

```ts
import type {
  RangeFacet,
  DateRangeFacet,
  OptionFacet,
  RatingFacet,
  CategoryFacet,
  FieldKeyedFacets
} from '@fritill-team/nuxt-graphql-listing'

// Range facet for numeric filters
interface RangeFacet {
  min: number | null
  max: number | null
}

// Date range facet
interface DateRangeFacet {
  min: string | null  // ISO date string
  max: string | null
}

// Option facet for select/multi filters
interface OptionFacet {
  value: string | number | boolean
  label?: string
  count?: number
}

// Rating facet
interface RatingFacet {
  value: number
  count?: number
}

// Category tree facet
interface CategoryFacet {
  id: string
  name: string
  count?: number
  children?: CategoryFacet[]
  pathText?: string      // For flat lists needing path reconstruction
  treeId?: string        // For multi-tree support
  translations?: Array<{ language: string; name: string; slug?: string }>
}
```

### How Facets Are Applied

1. **Range filters** (`int-range`, `decimal-range`): Facets set the min/max bounds for the slider and inputs
2. **Select filters**: Facets can provide dynamic options with counts (overrides static `options` if provided)
3. **Switch-multi filters**: Facets add counts to each option
4. **Rating filters**: Facets show the count of items for each rating level
5. **Category tree filters**: Facets provide the entire category hierarchy with counts

### Example: GraphQL Query with Facets

```graphql
query Products($input: ProductsInput!) {
  products(input: $input) {
    items {
      id
      name
      price
    }
    total
    facets {
      price {
        min
        max
      }
      categoryId {
        value
        label
        count
      }
      rating {
        value
        count
      }
    }
  }
}
```

### Custom Filter Facets

For custom filters, the raw facet data is passed as the `facet` prop. Your component handles the facet structure:

```vue
<script setup>
const props = defineProps<{
  field: CustomFilterFieldConfig
  filters: Record<string, any>
  facet?: MyCustomFacetType  // Your custom facet structure
}>()
</script>
```

## Custom Filters Guide

The `custom` filter kind allows you to create your own filter components that integrate seamlessly with the listing system. This is useful when you need specialized UI or logic not covered by the built-in filter types.

### Creating a Custom Filter Component

Your custom filter component receives specific props and must emit a `change` event with filter updates.

**Required Props:**

| Prop | Type | Description |
|------|------|-------------|
| `field` | `CustomFilterFieldConfig` | The filter configuration object |
| `filters` | `object` | Current filter state |
| `facet` | `unknown` | (Optional) Raw facet data for this field from the backend |

**Required Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `Record<string, any>` | Emit filter changes as `{ fieldName: newValue }` |

**Additional Props:**

Any props defined in the `props` property of your filter config will be passed to your component.

### Example: Color Picker Filter

```vue
<!-- components/filters/ColorPickerFilter.vue -->
<script setup lang="ts">
import type { CustomFilterFieldConfig } from '@fritill-team/nuxt-graphql-listing'

const props = defineProps<{
  field: CustomFilterFieldConfig<string>
  filters: Record<string, any>
  colors?: Array<{ name: string; value: string; hex: string }>
}>()

const emit = defineEmits<{
  (e: 'change', patch: Record<string, any>): void
}>()

const selectedColor = computed(() => props.filters[props.field.field] ?? null)

function selectColor(value: string | null) {
  emit('change', { [props.field.field]: value })
}
</script>

<template>
  <UFormField :label="field.label">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="color in colors"
        :key="color.value"
        type="button"
        class="w-8 h-8 rounded-full border-2 transition-all"
        :class="selectedColor === color.value ? 'border-primary ring-2 ring-primary/50' : 'border-gray-200'"
        :style="{ backgroundColor: color.hex }"
        :title="color.name"
        @click="selectColor(color.value)"
      />
      <button
        v-if="selectedColor"
        type="button"
        class="text-sm text-gray-500 hover:text-gray-700"
        @click="selectColor(null)"
      >
        Clear
      </button>
    </div>
  </UFormField>
</template>
```

### Using the Custom Filter

```ts
// composables/useProductFilterConfig.ts
import ColorPickerFilter from '~/components/filters/ColorPickerFilter.vue'

export function useProductFilterConfig(): FilterFieldConfig[] {
  return [
    // ... other filters
    {
      key: 'color',
      field: 'colorId',
      kind: 'custom',
      label: 'Color',
      component: ColorPickerFilter,
      props: {
        colors: [
          { name: 'Red', value: 'red', hex: '#ef4444' },
          { name: 'Blue', value: 'blue', hex: '#3b82f6' },
          { name: 'Green', value: 'green', hex: '#22c55e' },
          { name: 'Yellow', value: 'yellow', hex: '#eab308' },
          { name: 'Purple', value: 'purple', hex: '#a855f7' }
        ]
      }
    }
  ]
}
```

### Example: Location Radius Filter

A more complex example with multiple fields:

```vue
<!-- components/filters/LocationRadiusFilter.vue -->
<script setup lang="ts">
const props = defineProps<{
  field: any
  filters: Record<string, any>
  radiusOptions?: number[]
}>()

const emit = defineEmits<{
  (e: 'change', patch: Record<string, any>): void
}>()

const radiusOptions = props.radiusOptions ?? [5, 10, 25, 50, 100]

const location = computed(() => props.filters.location ?? '')
const radius = computed(() => props.filters.radius ?? null)

function updateLocation(value: string) {
  emit('change', { location: value || null })
}

function updateRadius(value: number | null) {
  emit('change', { radius: value })
}
</script>

<template>
  <div class="space-y-3">
    <UFormField label="Location">
      <UInput
        :model-value="location"
        placeholder="Enter city or zip code"
        @update:model-value="updateLocation"
      />
    </UFormField>

    <UFormField label="Radius">
      <USelect
        :model-value="radius"
        :options="[
          { label: 'Any distance', value: null },
          ...radiusOptions.map(r => ({ label: `${r} miles`, value: r }))
        ]"
        @update:model-value="updateRadius"
      />
    </UFormField>
  </div>
</template>
```

```ts
// In filter config
{
  key: 'locationRadius',
  field: 'location',  // Primary field
  kind: 'custom',
  label: 'Location',
  component: LocationRadiusFilter,
  props: {
    radiusOptions: [5, 10, 25, 50]
  }
}
```

### TypeScript Support

For full TypeScript support, import the types:

```ts
import type {
  FilterFieldConfig,
  CustomFilterFieldConfig
} from '@fritill-team/nuxt-graphql-listing'
```

### Best Practices

1. **Emit changes immediately**: Don't batch updates; emit each change as it happens for real-time filter updates.

2. **Handle null values**: Always support `null` for clearing the filter.

3. **Use the field config**: Access labels and other config via `props.field`.

4. **Consistent styling**: Use Nuxt UI components (`UFormField`, `UInput`, etc.) for consistent look and feel.

5. **Accessibility**: Include proper labels, ARIA attributes, and keyboard navigation.

## Next Steps

- See [Components](/docs/components) for UI integration
- Learn about [URL State](/docs/url-state) serialization
- View [Examples](/docs/examples) for complete implementations
