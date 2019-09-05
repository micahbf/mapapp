import { distanceBetweenCoords } from './geo_utils'

describe('distanceBetweenCoords', () => {
  const SFO = [-122.37527, 37.61889]
  const JFK = [-73.77861, 40.64000]

  it('computes correct great circle distance in meters', () => {
    const distance = distanceBetweenCoords(SFO, JFK)
    const expectedDistance = 4152e3
    const diff = Math.abs(expectedDistance - distance)
    expect(diff).toBeLessThan(1e3)
  })

  it('does not matter what order the arguments are in', () => {
    const distanceA = distanceBetweenCoords(SFO, JFK)
    const distanceB = distanceBetweenCoords(JFK, SFO)
    expect(distanceA).toEqual(distanceB)
  })
})
