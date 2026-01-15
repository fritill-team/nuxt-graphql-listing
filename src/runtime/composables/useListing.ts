import type {ListingResult, ListingState, UseListingOptions, UseListingReturn} from "../types/listing";
import {deepEqual, normalizeQuery} from "../utils";
import {computed, type Ref, ref, watch} from "vue";

export function useListing<
  Item,
  RawData,
  Variables,
  Filters,
  Sort,
  Facets = Record<string, any>
>(
  options: UseListingOptions<Item, RawData, Variables, Filters, Sort, Facets>,
): UseListingReturn<Item, Filters, Sort, Facets> {
  const {
    queryDocument,
    apolloClient,
    buildVariables,
    mapResult,
    initialOffset = 0,
    initialLimit = 20,
    initialFilters,
    initialSort,
    urlBinding = true,
    parseQuery,
    buildQuery,
    key = 'listing',
  } = options


  const route = useRoute()
  const router = useRouter()

  // ---------- 1) Resolve Apollo client ----------
  const client = apolloClient
  if (!client) {
    throw new Error('[useListing] Apollo client is required. Pass it via options.apolloClient.')
  }

  // ---------- 2) Hydrate state from query ----------
  let hydratedState: Partial<ListingState<Filters, Sort>> = {}
  if (urlBinding && parseQuery) {
    hydratedState = parseQuery(route.query as Record<string, any>) || {}
  }

  const offset = ref<number>(
    (hydratedState as any).offset ?? initialOffset,
  )
  const limit = ref<number>(
    (hydratedState as any).limit ?? initialLimit,
  )

  // init filters/sort once, then patch from hydrated state to avoid union types
  const filters = ref<Filters>(
    structuredClone(initialFilters) as Filters,
  )
  if (hydratedState.filters) {
    filters.value = hydratedState.filters as Filters
  }

  const sort = ref<Sort>(
    structuredClone(initialSort) as Sort,
  )
  if (hydratedState.sort) {
    sort.value = hydratedState.sort as Sort
  }

  const state = computed<ListingState<Filters, Sort>>(() => ({
    offset: offset.value,
    limit: limit.value,
    filters: filters.value,
    sort: sort.value,
  }))


  // ---------- 3) Build variables ----------
  const variables = computed<Variables>(() => buildVariables(state.value))

  // ---------- 4) Fetch via useAsyncData + Apollo ----------
  const {data, pending, error, refresh} = useAsyncData<ListingResult<Item, Facets>>(
    () => `${key}:${JSON.stringify(variables.value)}`,
    async () => {
      // Optionally transform sort shape based on options.sortMode
      const maybeTransformSort = (vars: any) => {
        try {
          if (!options.sortMode || options.sortMode === 'array') return vars
          const v = {...(vars || {})}
          const input = (v as any).input
          if (!input || !input.sort) return v
          const sortVal = input.sort
          // If array-based { fields: [...] }, convert to keyed object
          if ((sortVal as any).fields && Array.isArray((sortVal as any).fields)) {
            const arr = (sortVal as any).fields as Array<{ field?: string; direction?: string }>
            const keyed: Record<string, string> = {}
            for (const s of arr) {
              if (!s || !s.field) continue
              keyed[s.field] = (s.direction as any) ?? 'ASC'
            }
            input.sort = keyed
          }
          return v
        } catch {
          return vars
        }
      }

      const result = await client!.query({
        query: queryDocument,
        // TS: Variables is unconstrained; Apollo expects OperationVariables
        // so we cast once here
        variables: maybeTransformSort(variables.value as any),
        fetchPolicy: 'network-only',
      })
      return mapResult(result.data as RawData)
    },
    {
      watch: [variables],
      server: true,
      lazy: false,
    },
  )

  const items = computed<Item[]>(() => data.value?.items ?? [])
  const total = computed<number>(() => data.value?.total ?? 0)
  const facets = computed<Facets | null | undefined>(() => data.value?.facets)


  // ---------- 5) URL binding ----------
  let internalUpdate = false

  if (urlBinding && parseQuery && buildQuery) {
    // state → URL
    watch(
      state,
      (newState) => {
        internalUpdate = true
        const nextQuery = buildQuery(
          newState,
          route.query as Record<string, any>,
        )
        const current = route.query as Record<string, any>

        if (!deepEqual(normalizeQuery(current), normalizeQuery(nextQuery))) {
          void router.replace({query: nextQuery, hash: route.hash})
        }

        internalUpdate = false
      },
      {deep: true},
    )

    // URL → state
    watch(
      () => route.query,
      (q) => {
        if (internalUpdate) return
        const parsed = parseQuery(q as Record<string, any>) || {}

        if ((parsed as any).offset != null && (parsed as any).offset !== offset.value) {
          offset.value = (parsed as any).offset as number
        }
        if ((parsed as any).limit != null && (parsed as any).limit !== limit.value) {
          limit.value = (parsed as any).limit as number
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

  // ---------- 6) API helpers ----------
  function setFilter(patch: Partial<Filters>) {
    const next: any = {...(filters.value as any)}

    for (const [key, value] of Object.entries(patch)) {
      // GraphQL InputMaybe prefers null over undefined
      next[key] = value === undefined ? null : value
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
    refetch: async () => {
      await refresh()
    },
  } as UseListingReturn<Item, Filters, Sort, Facets>
}
