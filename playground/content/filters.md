---
title: Filters
description: Complete documentation for the filter system including all 12 filter control types and configuration options.
order: 4
---

# Filter System

The module provides a powerful filter system with 12 different control types. This page documents how to configure and use each filter type.

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

The `ListingFiltersRenderer` component automatically selects the correct component based on the `kind` property.

## Next Steps

- See [Components](/docs/components) for UI integration
- Learn about [URL State](/docs/url-state) serialization
- View [Examples](/docs/examples) for complete implementations
