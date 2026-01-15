import type {FilterFieldConfig} from './types/filterSchema'
import type {ListingState} from './types/listing'
import type {SortDirection} from './types/sortSchema'

type AnyFilters = Record<string, any>

function firstOrNull(v: unknown): string | null {
  if (v == null) return null
  if (Array.isArray(v)) return v[0] ?? null
  return String(v)
}

function parseNumberOrNull(v: unknown): number | null {
  const s = firstOrNull(v)
  if (s == null || s === '') return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

/** Parse sort from URL: "field:direction" or "field:direction,field2:direction" */
export function parseSortFromQuery<F extends string = string>(
  query: Record<string, any>
): Array<{ field: F; direction: SortDirection }> | undefined {
  const raw = firstOrNull(query.sort)
  if (!raw) return undefined

  const parts = raw.split(',').filter(Boolean)
  const result: Array<{ field: F; direction: SortDirection }> = []

  for (const part of parts) {
    const [field, dir] = part.split(':')
    if (field && (dir === 'ASC' || dir === 'DESC')) {
      result.push({field: field as F, direction: dir})
    }
  }

  return result.length > 0 ? result : undefined
}

/** Build sort query param: "field:direction,field2:direction" */
export function buildSortQuery<F extends string = string>(
  sort: Array<{ field: F; direction: SortDirection }> | null | undefined
): string | null {
  if (!sort || sort.length === 0) return null
  return sort.map(s => `${s.field}:${s.direction}`).join(',')
}

/** Generic: parse query -> partial ListingState (filters + paging + search + sort) */
export function parseListingQuery<
  F extends string,
  Filters extends AnyFilters = AnyFilters,
  Sort extends Array<{ field: string; direction: SortDirection }> = Array<{ field: string; direction: SortDirection }>
>(
  query: Record<string, any>,
  filterConfig: FilterFieldConfig<F>[],
): Partial<ListingState<Filters, Sort>> {
  const filters = {} as Filters

  for (const field of filterConfig) {
    if (field.kind === 'separator') continue

    if (field.kind === 'select' || field.kind === 'boolean-select' || field.kind === 'category-tree') {
      const paramKey = field.field as string
      const raw = firstOrNull(query[paramKey])

      if (raw == null || raw === '') continue

      if (field.kind === 'boolean-select') {
        if (raw === 'true') (filters as any)[field.field] = true
        else if (raw === 'false') (filters as any)[field.field] = false
        continue
      }

      ;(filters as any)[field.field] = raw
      continue
    }

    if (field.kind === 'switch-group') {
      for (const sw of field.switches) {
        const paramKey = sw.field as string
        const raw = firstOrNull(query[paramKey])
        if (raw === 'true') (filters as any)[sw.field] = true
        else if (raw === 'false') (filters as any)[sw.field] = false
      }
      continue
    }

    if (
      field.kind === 'int-range' ||
      field.kind === 'decimal-range' ||
      field.kind === 'datetime-range'
    ) {
      const base = field.field as string
      const minKey = field.kind === 'datetime-range' ? `${base}From` : `${base}Min`
      const maxKey = field.kind === 'datetime-range' ? `${base}To` : `${base}Max`

      if (field.kind === 'datetime-range') {
        const from = firstOrNull(query[minKey])
        const to = firstOrNull(query[maxKey])
        if (!from && !to) continue
          ;
        (filters as any)[field.field] = {
          gte: from || null,
          lte: to || null,
        }
      } else {
        const min = parseNumberOrNull(query[minKey])
        const max = parseNumberOrNull(query[maxKey])
        if (min == null && max == null) continue
          ;
        (filters as any)[field.field] = {
          gte: min,
          lte: max,
        }
      }
      continue
    }

    // Rating: treat like numeric range but only gte via <field>Min
    if (field.kind === 'rating') {
      const base = field.field as string
      const min = parseNumberOrNull(query[`${base}Min`])
      if (min != null) {
        (filters as any)[field.field] = { gte: min }
      }
      continue
    }

    if (field.kind === 'datetime-range-group') {
      for (const df of field.dateFields) {
        const base = df.field as string
        const fromKey = `${base}From`
        const toKey = `${base}To`
        const from = firstOrNull(query[fromKey])
        const to = firstOrNull(query[toKey])
        if (!from && !to) continue
          ;
        (filters as any)[df.field] = {
          gte: from || null,
          lte: to || null,
        }
      }
      continue
    }
  }

  // Pagination & search
  const offsetRaw = firstOrNull(query.offset)
  const limitRaw = firstOrNull(query.limit)
  const offset = offsetRaw != null && offsetRaw !== '' ? Number(offsetRaw) : undefined
  const limit = limitRaw != null && limitRaw !== '' ? Number(limitRaw) : undefined

  const searchRaw = firstOrNull(query.search)
  const search = searchRaw != null && searchRaw.trim() !== '' ? searchRaw.trim() : undefined

  // Sort
  const sort = parseSortFromQuery(query) as Sort | undefined

  const base: Partial<ListingState<Filters, Sort>> = {filters}

  if (offset != null && !Number.isNaN(offset)) base.offset = offset
  if (limit != null && !Number.isNaN(limit)) base.limit = limit
  if (search != null) base.search = search
  if (sort != null) base.sort = sort

  return base
}

/** Generic: build query from ListingState + schema */
export function buildListingQuery<
  F extends string,
  Filters extends AnyFilters,
  Sort extends { field: string; direction: SortDirection } = { field: string; direction: SortDirection },
>(
  state: ListingState<Filters, Sort[]>,
  filterConfig: FilterFieldConfig<F>[],
): Record<string, any> {
  const q: Record<string, any> = {}
  const f = state.filters as AnyFilters

  // Pagination
  if (state.offset && state.offset > 0) q.offset = state.offset
  if (state.limit && state.limit > 0) q.limit = state.limit

  // Search
  if (state.search && state.search.trim() !== '') {
    q.search = state.search.trim()
  }

  // Sort
  const sortStr = buildSortQuery(state.sort)
  if (sortStr) q.sort = sortStr

  // Filters by schema
  for (const field of filterConfig) {
    if (field.kind === 'separator') continue

    if (field.kind === 'select' || field.kind === 'boolean-select' || field.kind === 'category-tree') {
      const paramKey = field.field as string
      const value = f[paramKey]

      if (value == null || value === '') {
        continue
      }

      if (field.kind === 'boolean-select') {
        if (value === true) q[paramKey] = 'true'
        else if (value === false) q[paramKey] = 'false'
      } else {
        q[paramKey] = String(value)
      }
      continue
    }

    if (field.kind === 'switch-group') {
      for (const sw of field.switches) {
        const key = sw.field as string
        const value = f[key]
        if (value === true) q[key] = 'true'
        else if (value === false) q[key] = 'false'
      }
      continue
    }

    if (
      field.kind === 'int-range' ||
      field.kind === 'decimal-range' ||
      field.kind === 'datetime-range'
    ) {
      const base = field.field as string
      const v = f[base] as { gte?: any; lte?: any } | null | undefined
      const minKey = field.kind === 'datetime-range' ? `${base}From` : `${base}Min`
      const maxKey = field.kind === 'datetime-range' ? `${base}To` : `${base}Max`

      if (v && (v.gte != null || v.lte != null)) {
        if (v.gte != null) q[minKey] = v.gte
        if (v.lte != null) q[maxKey] = v.lte
      }
      continue
    }

    // Rating: only write <field>Min from v.gte
    if (field.kind === 'rating') {
      const base = field.field as string
      const v = f[base] as { gte?: any } | null | undefined
      const minKey = `${base}Min`
      if (v && v.gte != null && v.gte !== '') {
        q[minKey] = v.gte
      }
      continue
    }

    if (field.kind === 'datetime-range-group') {
      for (const df of field.dateFields) {
        const base = df.field as string
        const v = f[base] as { gte?: any; lte?: any } | null | undefined
        const fromKey = `${base}From`
        const toKey = `${base}To`

        if (v && (v.gte != null || v.lte != null)) {
          if (v.gte != null) q[fromKey] = v.gte
          if (v.lte != null) q[toKey] = v.lte
        }
      }
      continue
    }
  }

  return q
}
