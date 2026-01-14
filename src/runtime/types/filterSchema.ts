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
  key: string      // stable key
  field?: F        // optional for group configs
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

/**
 * Grouped date range: radio to choose field, then one date range.
 */
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

/** Switch group (isLive, isFree, hasDiscount, ...) */
export interface SwitchGroupFilterFieldConfig<F extends string = string>
  extends BaseFilterFieldConfig<F> {
  kind: 'switch-group'
  switches: Array<{
    field: F
    label: string
  }>
}

/** same field, many values → array (e.g. statusIn: ['PUBLISHED','DRAFT']) */
export interface SwitchMultiFilterFieldConfig<F extends string = string>
  extends BaseFilterFieldConfig<F> {
  kind: 'switch-multi'
  field: F
  options: Array<{ value: string | number | boolean; label: string }>
}

export interface RatingFilterFieldConfig<F extends string = string>
  extends BaseFilterFieldConfig<F> {
  kind: 'rating'
  field: F          // backing field in the GraphQL / API filter (e.g. "ratingGte")
  steps?: number[]  // optional override, defaults to [4, 3, 2, 1]
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
