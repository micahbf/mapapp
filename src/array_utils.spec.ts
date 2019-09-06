import { chunkBy, eachConsecutivePair } from './array_utils'

describe('chunkBy', () => {
  const chunkFn = (a, b) => a !== b

  it('returns chunks delineated by chunkFn', () => {
    const input = [1, 1, 2, 3, 3]
    expect(chunkBy(input, chunkFn)).toEqual([[1, 1], [2], [3, 3]])
  })

  it('returns a single chunk if given a single element', () => {
    const input = [1]
    expect(chunkBy(input, chunkFn)).toEqual([[1]])
  })

  it('returns an empty array when given an empty array', () => {
    const input = []
    expect(chunkBy(input, chunkFn)).toEqual([])
  })
})

describe('eachConsecutivePair', () => {
  it('returns consecutive pairs from an array', () => {
    const input = [1, 2, 3]
    const expected = [[1, 2], [2, 3]]
    expect(eachConsecutivePair(input)).toEqual(expected)
  })

  it('returns an empty array given an array of length 1', () => {
    expect(eachConsecutivePair([1])).toEqual([])
  })

  it('returns an empty array given an empty array', () => {
    expect(eachConsecutivePair([])).toEqual([])
  })
})
