export type SortDirection = 'ASC' | 'DESC'

export interface SortOption<F extends string = string> {
  label: string
  field: F
  direction: SortDirection
}

export interface SortConfig<F extends string = string> {
  options: SortOption<F>[]
  defaultField?: F
  defaultDirection?: SortDirection
}