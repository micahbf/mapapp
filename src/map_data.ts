import { zonedDateStringFromDate, zonedHumanDate, zonedHumanTime } from './date_utils'
import { distanceBetweenCoords } from './geo_utils'
import { collectFeatures, pointsToLineString, wrapWithFeature } from './geojson'
import { FormattedMessage } from './spot_format'

export function mapFeaturesFromMessages(messages: FormattedMessage[]): GeoJSON.FeatureCollection {
  return collectFeatures([
    ...tracklinesFromMessages(messages),
    lastUpdatePointFromMessages(messages),
    ...dayPointsFromMessages(messages)
  ])
}

function tracklinesFromMessages(messages: FormattedMessage[]): GeoJSON.Feature[] {
  const allPoints = messages.map(msg => msg.point)
  const pointChunks = chunkBy(allPoints, (a, b) => {
    return distanceBetweenCoords(a.coordinates, b.coordinates) > 100e3 // 100 km
  })

  return pointChunks.map((points) => {
    return wrapWithFeature(pointsToLineString(points), {name: 'Live Track', class: 'liveTrack'})
  })
}

function dayPointsFromMessages(messages: FormattedMessage[]): GeoJSON.Feature[] {
  const lastMessages = lastMessagePerDay(messages)
  return lastMessages.map((msg) => {
    return wrapWithFeature(msg.point, {name: zonedHumanDate(msg.time),
                                       isoTime: msg.time.toISOString(),
                                       class: 'endOfDay'})
  })
}

function lastUpdatePointFromMessages(messages: FormattedMessage[]): GeoJSON.Feature {
  const lastMessage = messages[messages.length - 1]
  return wrapWithFeature(lastMessage.point, {name: `Last Update: ${zonedHumanTime(lastMessage.time)}`,
                                             isoTime: lastMessage.time.toISOString(),
                                             class: 'lastUpdate'})
}

export function lastMessagePerDay(messages: FormattedMessage[]): FormattedMessage[] {
  const msgPairs = eachConsecutivePair(messages)
  const dayPairs = msgPairs.filter(
    ([msgA, msgB]) => zonedDateStringFromDate(msgA.time) !== zonedDateStringFromDate(msgB.time)
  )
  return dayPairs.map(([msgA, _msgB]) => msgA)
}

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
