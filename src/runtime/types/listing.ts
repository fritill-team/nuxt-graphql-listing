import type {ApolloClient} from '@apollo/client/core'
import type {DocumentNode} from "graphql/index";

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface SortInput<F extends string = string> {
  field: F
  direction: SortDirection
}

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
  Facets = Record<string, any>
> {
  queryDocument: DocumentNode

  // Apollo client to execute listing queries.
  apolloClient: ApolloClient

  // Build GraphQL variables from current listing state
  buildVariables: (state: ListingState<Filters, Sort>) => Variables

  // Map raw GraphQL data to {items, total, facets?}
  mapResult: (data: RawData) => ListingResult<Item, Facets>

  // Initial state
  initialOffset?: number
  initialLimit?: number
  initialFilters: Partial<Filters>
  initialSort: Sort

  // URL sync
  urlBinding?: boolean
  parseQuery?: (query: Record<string, any>) => Partial<ListingState<Filters, Sort>>
  buildQuery?: (
    state: ListingState<Filters, Sort>,
    previousQuery: Record<string, any>,
  ) => Record<string, any>

  // key prefix for useAsyncData
  key?: string

  // How to serialize sort for the API. Default 'array' sends as array of {field,direction}.
  // Use 'keyed' to convert to an object map: { fieldName: direction, ... }
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
