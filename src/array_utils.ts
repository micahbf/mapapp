// Given an array of values, returns an array of arrays, chunked such that
// when chunkFn returns true, element a is the last element of the previous
// chunk and element b is the first element of the next chunk.
export function chunkBy<T>(coll: T[], chunkFn: (a: T, b: T) => boolean): Array<Array<T>> {
  if (coll.length === 0) return []

  return coll.reduce((acc, val, idx, ary) => {
    acc[acc.length - 1].push(val)
    if (idx + 1 === ary.length) return acc
    const next = ary[idx + 1]
    if (chunkFn(val, next)) acc.push([])
    return acc
  }, [[]])
}

export function eachConsecutivePair<T>(coll: T[]): Array<[T, T]> {
  return coll.reduce((acc, val, idx, ary) => {
    if (idx + 1 === ary.length) { return acc }
    return acc.concat([[val, ary[idx + 1]]])
  }, [])
}
