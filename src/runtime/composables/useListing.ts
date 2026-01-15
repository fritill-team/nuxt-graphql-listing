import type { ListingResult, ListingState, SortInput, UseListingOptions, UseListingReturn } from '../types/listing'
import { deepEqual, normalizeQuery } from '../utils'
import { buildListingQuery, parseListingQuery } from '../utils/urlState'
import { computed, type Ref, ref, watch } from 'vue'

/**
 * Default variable builder following the convention:
 * { input: { offset, limit, filters, sort: { fieldName: 'ASC' } } }
 */
function defaultBuildVariables<Filters, Sort>(
  state: ListingState<Filters, Sort>,
  filterKey: string,
  wrapInput: boolean,
): any {
  const variables: Record<string, any> = {
    offset: state.offset,
    limit: state.limit,
    [filterKey]: state.filters,
    sort: convertSortToKeyed(state.sort),
  }

  return wrapInput ? { input: variables } : variables
}

/**
 * Convert array sort to keyed format: [{ field: 'name', direction: 'ASC' }] -> { name: 'ASC' }
 */
function convertSortToKeyed(sort: any): Record<string, string> {
  if (!Array.isArray(sort)) return {}
  const keyed: Record<string, string> = {}
  for (const s of sort) {
    if (s?.field) {
      keyed[s.field] = s.direction ?? 'ASC'
    }
  }
  return keyed
}

/**
 * Default result mapper using dataPath
 */
function defaultMapResult<Item, Facets>(data: any, dataPath: string): ListingResult<Item, Facets> {
  const root = data?.[dataPath]
  return {
    items: root?.items ?? [],
    total: root?.total ?? 0,
    facets: root?.facets ?? null,
  }
}

export function useListing<
  Item = any,
  Filters = Record<string, any>,
  Sort = SortInput[],
  Facets = Record<string, any>,
>(
  options: UseListingOptions<Item, Filters, Sort, Facets>,
): UseListingReturn<Item, Filters, Sort, Facets> {
  const {
    query,
    client,
    dataPath,
    initialOffset = 0,
    initialLimit = 20,
    initialFilters = {} as Partial<Filters>,
    initialSort = [] as unknown as Sort,
    filterConfig,
    key = 'listing',
    filterKey = 'filters',
    wrapInput = true,
    mapResult: customMapResult,
  } = options

  const route = useRoute()
  const router = useRouter()

  // Validate required options
  if (!client) {
    throw new Error('[useListing] client is required')
  }
  if (!dataPath && !customMapResult) {
    throw new Error('[useListing] dataPath is required (or provide custom mapResult)')
  }

  // URL binding is enabled when filterConfig is provided
  const urlBinding = !!filterConfig

  // ---------- Hydrate state from URL ----------
  let hydratedState: Partial<ListingState<Filters, Sort>> = {}
  if (urlBinding && filterConfig) {
    hydratedState = parseListingQuery(route.query as Record<string, any>, filterConfig) || {}
  }

  const offset = ref<number>(hydratedState.offset ?? initialOffset)
  const limit = ref<number>(hydratedState.limit ?? initialLimit)

  const filters = ref<Filters>(
    structuredClone(hydratedState.filters ?? initialFilters) as Filters,
  )

  const sort = ref<Sort>(
    structuredClone(hydratedState.sort ?? initialSort) as Sort,
  )

  const state = computed<ListingState<Filters, Sort>>(() => ({
    offset: offset.value,
    limit: limit.value,
    filters: filters.value,
    sort: sort.value,
  }))

  // ---------- Build variables ----------
  const variables = computed(() =>
    defaultBuildVariables(state.value, filterKey, wrapInput),
  )

  // ---------- Map result ----------
  const mapResult = customMapResult
    ? customMapResult
    : (data: any) => defaultMapResult<Item, Facets>(data, dataPath)

  // ---------- Fetch ----------
  const data = ref<ListingResult<Item, Facets> | null>(null)
  const pending = ref(true)
  const error = ref<Error | null>(null)

  const fetchData = async () => {
    pending.value = true
    error.value = null
    try {
      const result = await client.query({
        query,
        variables: variables.value,
        fetchPolicy: 'network-only',
      })
      data.value = mapResult(result.data)
    } catch (e) {
      error.value = e as Error
    } finally {
      pending.value = false
    }
  }

  // Initial fetch
  fetchData()

  // Refetch on variable changes
  watch(variables, () => fetchData(), { deep: true })

  const items = computed<Item[]>(() => data.value?.items ?? [])
  const total = computed<number>(() => data.value?.total ?? 0)
  const facets = computed<Facets | null | undefined>(() => data.value?.facets)

  // ---------- URL binding ----------
  let internalUpdate = false

  if (urlBinding && filterConfig) {
    // State → URL
    watch(
      state,
      (newState) => {
        internalUpdate = true
        const nextQuery = buildListingQuery(newState as any, filterConfig)
        const current = route.query as Record<string, any>

        if (!deepEqual(normalizeQuery(current), normalizeQuery(nextQuery))) {
          void router.replace({ query: nextQuery, hash: route.hash })
        }

        internalUpdate = false
      },
      { deep: true },
    )

    // URL → State
    watch(
      () => route.query,
      (q) => {
        if (internalUpdate) return
        const parsed = parseListingQuery(q as Record<string, any>, filterConfig) || {}

        if (parsed.offset != null && parsed.offset !== offset.value) {
          offset.value = parsed.offset
        }
        if (parsed.limit != null && parsed.limit !== limit.value) {
          limit.value = parsed.limit
        }
        if (parsed.filters && !deepEqual(parsed.filters, filters.value)) {
          filters.value = parsed.filters as Filters
        }
        if (parsed.sort && !deepEqual(parsed.sort, sort.value)) {
          sort.value = parsed.sort as Sort
        }
      },
    )
  }

  // ---------- API helpers ----------
  function setFilter(patch: Partial<Filters>) {
    const next: any = { ...(filters.value as any) }

    for (const [k, value] of Object.entries(patch)) {
      next[k] = value === undefined ? null : value
    }

    filters.value = next
    offset.value = 0
  }

  function setSort(newSort: Sort) {
    sort.value = newSort
    offset.value = 0
  }

  function setOffset(newOffset: number) {
    offset.value = newOffset < 0 ? 0 : newOffset
  }

  function setLimit(newLimit: number) {
    limit.value = newLimit
    offset.value = 0
  }

  return {
    items,
    total,
    facets,
    offset,
    limit,
    filters,
    sort,
    loading: pending as Ref<boolean>,
    error: computed(() => (error.value as any) ?? null),
    setFilter,
    setSort,
    setOffset,
    setLimit,
    refetch: fetchData,
  } as UseListingReturn<Item, Filters, Sort, Facets>
}
