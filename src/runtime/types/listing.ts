import type { ApolloClient } from '@apollo/client/core'
import type { DocumentNode } from 'graphql/index'

// ============================================
// Sort Types
// ============================================

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface SortInput<F extends string = string> {
  field: F
  direction: SortDirection
}

export interface SortOption<F extends string = string> {
  label: string
  field: F
  direction: SortDirection
}

// ============================================
// Filter Types
// ============================================

export type FilterControlKind =
  | 'select'
  | 'boolean-select'
  | 'int-range'
  | 'decimal-range'
  | 'datetime-range'
  | 'datetime-range-group'
  | 'switch-group'
  | 'switch-multi'
  | 'rating'
  | 'category-tree'
  | 'separator'

export interface BaseFilterFieldConfig<F extends string = string> {
  key: string
  field?: F
  label: string
  kind: FilterControlKind
}

export interface SelectOption {
  label: string
  value: string | number | boolean | null
}

export interface SelectFilterFieldConfig<F extends string = string>
  extends BaseFilterFieldConfig<F> {
  kind: 'select' | 'boolean-select'
  field: F
  options: SelectOption[]
}

export interface RangeFilterFieldConfig<F extends string = string>
  extends BaseFilterFieldConfig<F> {
  kind: 'int-range' | 'decimal-range' | 'datetime-range'
  field: F
}

export interface DateTimeRangeGroupFilterFieldConfig<F extends string = string>
  extends BaseFilterFieldConfig<F> {
  kind: 'datetime-range-group'
  dateFields: Array<{ field: F; label: string }>
}

export type SeparatorFieldConfig = {
  kind: 'separator'
  key: string
  label?: string
}

export interface SwitchGroupFilterFieldConfig<F extends string = string>
  extends BaseFilterFieldConfig<F> {
  kind: 'switch-group'
  switches: Array<{
    field: F
    label: string
  }>
}

export interface SwitchMultiFilterFieldConfig<F extends string = string>
  extends BaseFilterFieldConfig<F> {
  kind: 'switch-multi'
  field: F
  options: Array<{ value: string | number | boolean; label: string }>
}

export interface RatingFilterFieldConfig<F extends string = string>
  extends BaseFilterFieldConfig<F> {
  kind: 'rating'
  field: F
  steps?: number[]
}

export interface CategoryTreeFilterFieldConfig<F extends string = string>
  extends BaseFilterFieldConfig<F> {
  kind: 'category-tree'
  field: F
}

export type FilterFieldConfig<F extends string = string> =
  | SelectFilterFieldConfig<F>
  | RangeFilterFieldConfig<F>
  | DateTimeRangeGroupFilterFieldConfig<F>
  | SwitchGroupFilterFieldConfig<F>
  | SwitchMultiFilterFieldConfig<F>
  | RatingFilterFieldConfig<F>
  | CategoryTreeFilterFieldConfig<F>
  | SeparatorFieldConfig

// ============================================
// Listing Types
// ============================================

export type RangeValue<T> = {
  eq?: T | null
  gt?: T | null
  gte?: T | null
  lt?: T | null
  lte?: T | null
}

export interface ListingState<Filters, Sort> {
  offset: number
  limit: number
  filters: Filters
  sort: Sort
  search?: string
}

export interface ListingResult<Item, Facets = Record<string, any>> {
  items: Item[]
  total: number
  facets?: Facets | null
}

export interface UseListingOptions<
  Item,
  RawData,
  Variables,
  Filters,
  Sort,
  Facets = Record<string, any>,
> {
  queryDocument: DocumentNode
  apolloClient: ApolloClient
  buildVariables: (state: ListingState<Filters, Sort>) => Variables
  mapResult: (data: RawData) => ListingResult<Item, Facets>
  initialOffset?: number
  initialLimit?: number
  initialFilters: Partial<Filters>
  initialSort: Sort
  urlBinding?: boolean
  parseQuery?: (query: Record<string, any>) => Partial<ListingState<Filters, Sort>>
  buildQuery?: (
    state: ListingState<Filters, Sort>,
    previousQuery: Record<string, any>,
  ) => Record<string, any>
  key?: string
  sortMode?: 'array' | 'keyed'
}

export interface UseListingReturn<Item, Filters, Sort, Facets = Record<string, any>> {
  items: Ref<Item[]>
  total: Ref<number>
  facets: Ref<Facets | null | undefined>
  offset: Ref<number>
  limit: Ref<number>
  filters: Ref<Filters>
  sort: Ref<Sort>
  loading: Ref<boolean>
  error: Ref<Error | null>
  setFilter: (patch: Partial<Filters>) => void
  setSort: (sort: Sort) => void
  setOffset: (offset: number) => void
  setLimit: (limit: number) => void
  refetch: () => Promise<void>
}
