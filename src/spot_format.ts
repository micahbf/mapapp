import { SpotMessage } from './spot_api'

interface FormattedMessage {
  _id: number
  time: Date
  point: GeoJSON.Point
  messageType: string
  originalMessage: SpotMessage
}

export function formatSpotMessage(msg: SpotMessage): FormattedMessage {
  const time = new Date(msg.dateTime)
  const point: GeoJSON.Point = {type: 'Point', coordinates: [msg.longitude, msg.latitude]}

  return {_id: msg.id, time, point, messageType: msg.messageType, originalMessage: msg}
}
