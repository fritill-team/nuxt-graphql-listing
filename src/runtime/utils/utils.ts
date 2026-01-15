export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true

  // Handle NaN
  if (Number.isNaN(a) && Number.isNaN(b)) return true

  // Different types → not equal
  if (typeof a !== typeof b) return false

  // Null / primitive (already handled === above)
  if (a === null || b === null) return a === b
  if (typeof a !== 'object') return a === b

  // Arrays
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false
    }
    return true
  }

  // Plain objects
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false
    if (!deepEqual(a[key], b[key])) return false
  }

  return true
}

export function normalizeQuery(obj: Record<string, any>): Record<string, any> {
  const normalized: Record<string, any> = {}
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      const val = (obj as any)[key]
      if (val === undefined) return
      normalized[key] = Array.isArray(val) && val.length === 1 ? val[0] : val
    })
  return normalized
}
