/**
 * Caches a mapping per input object, so mapping the same cached API response on every render returns
 * the same result (stable props, no repeated work).
 */
export function memoizeByReference<In extends object, Out>(map: (input: In) => Out) {
  const results = new WeakMap<In, Out>()
  return (input: In): Out => {
    let result = results.get(input)
    if (result === undefined) {
      result = map(input)
      results.set(input, result)
    }
    return result
  }
}
