import { lastMessagePerDay, lastUpdatePointFromMessages } from './map_data'
import { FormattedMessage } from './spot_format'

export function mapBounds(messages: FormattedMessage[], days: number): [GeoJSON.Point, GeoJSON.Point] {
  const lastUpdate = messages[messages.length - 1]
  const lastMessagesPerDay = lastMessagePerDay(messages)
  const targetBound = lastMessagesPerDay.reverse()[lastMessagesPerDay.length - days]
  return [targetBound.point, lastUpdate.point]
}

export function lastUpdateCaption(messages: FormattedMessage[]): string {
  const lastUpdate = lastUpdatePointFromMessages(messages)
  return lastUpdate.properties.name
}
