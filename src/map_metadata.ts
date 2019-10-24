import { Position } from 'geojson'
import { lastMessagePerDay, lastUpdatePointFromMessages } from './map_data'
import { FormattedMessage } from './spot_format'

export function mapBounds(messages: FormattedMessage[], days: number): [Position, Position] {
  const lastUpdate = messages[messages.length - 1]
  const lastMessagesPerDay = lastMessagePerDay(messages)
  const targetBound = lastMessagesPerDay[lastMessagesPerDay.length - days]
  return [targetBound.point.coordinates, lastUpdate.point.coordinates]
}

export function lastUpdateCaption(messages: FormattedMessage[]): string {
  const lastUpdate = lastUpdatePointFromMessages(messages)
  return lastUpdate.properties.name
}
