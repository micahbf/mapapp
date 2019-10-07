import { BaseBuilder, buildGPX } from 'gpx-builder'
import { FormattedMessage } from './spot_format'

export function messagesToGPX(messages: FormattedMessage[]): string {
  const { Point } = BaseBuilder.MODELS
  const points = messages.map((message) => {
    const [lon, lat] = message.point.coordinates
    return new Point(lat, lon, {time: message.time})
  })

  const builder = new BaseBuilder()
  builder.setSegmentPoints(points)
  return buildGPX(builder.toObject())
}
