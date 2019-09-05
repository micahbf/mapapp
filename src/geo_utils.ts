import { Position } from 'geojson'

function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Haversine formula:
// a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
// c = 2 ⋅ atan2( √a, √(1−a) )
// d = R ⋅ c
// where φ is latitude, λ is longitude, and R is earth's radius
export function distanceBetweenCoords(pointA: Position, pointB: Position): number {
  const R = 6371e3 // meters
  const [longA, latA] = pointA.slice(0, 2).map(degToRad)
  const [longB, latB] = pointB.slice(0, 2).map(degToRad)

  const dLat = latB - latA
  const dLong = longB - longA

  // tslint:disable:whitespace
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(latA) * Math.cos(latB) *
            Math.sin(dLong/2) * Math.sin(dLong/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}
