import { SpotAPI } from './spot_api'

export interface FormattedMessage {
  _id: number
  time: Date
  point: GeoJSON.Point
  messageType: string
  originalMessage: SpotAPI.Message
}

export function formatSpotMessage(msg: SpotAPI.Message): FormattedMessage {
  const time = new Date(msg.dateTime)
  const point: GeoJSON.Point = {type: 'Point', coordinates: [msg.longitude, msg.latitude]}

  return {_id: msg.id, time, point, messageType: msg.messageType, originalMessage: msg}
}
