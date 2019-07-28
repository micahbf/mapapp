import { dateStringFromDate, humanDate, humanTime } from './date_utils'
import { collectFeatures, pointsToLineString, wrapWithFeature } from './geojson'
import { FormattedMessage } from './spot_format'

export function mapFeaturesFromMessages(messages: FormattedMessage[]): GeoJSON.FeatureCollection {
  return collectFeatures([
    tracklineFromMessages(messages),
    lastUpdatePointFromMessages(messages),
    ...dayPointsFromMessages(messages)
  ])
}

function tracklineFromMessages(messages: FormattedMessage[]): GeoJSON.Feature {
  const points = messages.map(msg => msg.point)
  return wrapWithFeature(pointsToLineString(points), {name: 'Live Track', class: 'liveTrack'})
}

function dayPointsFromMessages(messages: FormattedMessage[]): GeoJSON.Feature[] {
  const lastMessages = lastMessagePerDay(messages)
  return lastMessages.map((msg) => {
    return wrapWithFeature(msg.point, {name: humanDate(msg.time),
                                       isoTime: msg.time.toISOString(),
                                       class: 'endOfDay'})
  })
}

function lastUpdatePointFromMessages(messages: FormattedMessage[]): GeoJSON.Feature {
  const lastMessage = messages[messages.length - 1]
  return wrapWithFeature(lastMessage.point, {name: `Last Update: ${humanTime(lastMessage.time)}`,
                                             isoTime: lastMessage.time.toISOString(),
                                             class: 'lastUpdate'})
}

export function lastMessagePerDay(messages: FormattedMessage[]): FormattedMessage[] {
  const msgPairs = eachConsecutivePair(messages)
  const dayPairs = msgPairs.filter(
    ([msgA, msgB]) => dateStringFromDate(msgA.time) !== dateStringFromDate(msgB.time)
  )
  return dayPairs.map(([msgA, _msgB]) => msgA)
}

export function eachConsecutivePair<T>(coll: T[]): Array<[T, T]> {
  return coll.reduce((acc, val, idx, ary) => {
    if (idx + 1 === ary.length) { return acc }
    return acc.concat([[val, ary[idx + 1]]])
  }, [])
}
