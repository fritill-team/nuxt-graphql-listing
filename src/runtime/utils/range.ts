export type RangeBound = number | null

export interface RangeValue {
  gte?: number
  lte?: number
}

/** An empty, missing or non-numeric box is no bound, never 0. */
export function toRangeBound(value: unknown): RangeBound {
  if (value === null || value === undefined) return null
  if (typeof value === 'string' && value.trim() === '') return null
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : null
}

/**
 * The filter value for a range: only the ends the user filled. Both empty
 * clears the filter (null).
 */
export function buildRangeValue(gte: unknown, lte: unknown): RangeValue | null {
  const min = toRangeBound(gte)
  const max = toRangeBound(lte)
  if (min === null && max === null) return null
  const value: RangeValue = {}
  if (min !== null) value.gte = min
  if (max !== null) value.lte = max
  return value
}

/**
 * A slider thumb resting on its own end of the track has not narrowed
 * anything, so it is no bound rather than the facet bound.
 */
export function sliderEndToBound(value: unknown, trackEnd: number): RangeBound {
  const n = toRangeBound(value)
  return n === null || n === trackEnd ? null : n
}
