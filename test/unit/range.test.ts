import { describe, it, expect } from 'vitest'
import { buildRangeValue, sliderEndToBound, toRangeBound } from '../../src/runtime/utils/range'

describe('toRangeBound', () => {
  it('treats empty, missing and non-numeric input as no bound', () => {
    for (const v of ['', '  ', null, undefined, Number.NaN, 'abc', Number.POSITIVE_INFINITY]) {
      expect(toRangeBound(v)).toBeNull()
    }
  })

  it('keeps numbers, including an explicit 0', () => {
    expect(toRangeBound(0)).toBe(0)
    expect(toRangeBound(100)).toBe(100)
    expect(toRangeBound('12.5')).toBe(12.5)
  })
})

describe('buildRangeValue', () => {
  it('sends only the minimum when the maximum is empty', () => {
    expect(buildRangeValue(100, '')).toEqual({ gte: 100 })
    expect(buildRangeValue(1, null)).toEqual({ gte: 1 })
  })

  it('sends only the maximum when the minimum is empty', () => {
    expect(buildRangeValue('', 150)).toEqual({ lte: 150 })
  })

  it('sends both ends when both are filled', () => {
    expect(buildRangeValue(50, 150)).toEqual({ gte: 50, lte: 150 })
  })

  it('clears the filter when both ends are empty', () => {
    expect(buildRangeValue('', undefined)).toBeNull()
  })
})

describe('sliderEndToBound', () => {
  it('maps a thumb resting on its track end to no bound', () => {
    expect(sliderEndToBound(0, 0)).toBeNull()
    expect(sliderEndToBound(1000, 1000)).toBeNull()
  })

  it('keeps a thumb moved off its track end', () => {
    expect(sliderEndToBound(40, 0)).toBe(40)
    expect(sliderEndToBound(900, 1000)).toBe(900)
  })
})
