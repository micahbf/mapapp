import formattedMessages from '../test/formatted_messages'
import { zonedDateStringFromDate, zonedHumanDate } from './date_utils'
import {
  lastMessagePerDay,
  mapFeaturesFromMessages
} from './map_data'

describe('lastMessagePerDay', () => {
  const output = lastMessagePerDay(formattedMessages)
  const daysPresent = output.map(msg => zonedDateStringFromDate(msg.time))

  it('returns the last message for each intermediate day', () => {
    expect(output.length).toEqual(4)
    expect(output[0]._id).toEqual(1234974817)
  })

  it('uses the America/Mexico_City time zone', () => {
    const zonedHumanDates = output.map(msg => zonedHumanDate(msg.time))
    expect(zonedHumanDates).toEqual(['Jul 10', 'Jul 11', 'Jul 14', 'Jul 15'])
  })

  it('does not return messages for days which had no message', () => {
    expect(daysPresent).not.toContain('2019-07-13')
  })

  it('does not return a message for the last day', () => {
    expect(daysPresent).not.toContain('2019-07-16')
  })
})

describe('mapFeaturesFromMessages', () => {
  const output = mapFeaturesFromMessages(formattedMessages)

  it('returns a Feature for the realtime track', () => {
    const track = output.features.find(feat => feat.properties.class === 'liveTrack')
    expect(track).toBeDefined()
    expect(track.geometry.type).toEqual('LineString')
    expect(track.properties.name).toEqual('Live Track')
  })

  it('returns a Feature for each endOfDay point', () => {
    const endOfDays = output.features.filter(feat => feat.properties.class === 'endOfDay')
    expect(endOfDays.length).toEqual(4)
    expect(endOfDays[0].geometry.type).toEqual('Point')
    expect(endOfDays[0].properties.name).toEqual('Jul 10')
  })

  it('returns a Feature for the lastUpdate point', () => {
    const lastUpdate = output.features.find(feat => feat.properties.class === 'lastUpdate')
    expect(lastUpdate).toBeDefined()
    expect(lastUpdate.geometry.type).toEqual('Point')
    expect(lastUpdate.properties.name).toEqual('Last Update: Tue, Jul 16, 5:08 PM')
  })
})
