import { readFileSync } from 'fs'
import { resolve } from 'path'
import {
  filterByTimeGap,
  processGpx,
  trackpointsFromGpx,
  trackptToFormattedMsg,
  trksegToJs
} from './gpx_ingest'

const rawGpx = readFileSync(resolve(__dirname, '../test/gpx_from_phone.gpx'), {encoding: 'utf8'})
const trackpoints = trackpointsFromGpx(rawGpx)

const firstGpxTrackpt = {
  _attributes: {
    lat: '7.862611416002644',
    lon: '-75.21487605406156',
  },
  ele: {_text: '70.60868750605732'},
  time: {_text: '2020-01-10T15:06:54Z'}
}

const firstJsTrkpt = {
  lat: 7.86261,
  lon: -75.21488,
  elevation: 70.60869,
  time: new Date('2020-01-10T15:06:54Z')
}

const firstFormattedMessage = {
  _id: firstJsTrkpt.time.getTime(),
  time: firstJsTrkpt.time,
  point: {
    type: 'Point',
    coordinates: [
      firstJsTrkpt.lon,
      firstJsTrkpt.lat
    ]
  },
  messageType: 'gpxImport'
}

describe('trackpointsFromGpx', () => {
  it('returns trackpoints in compact format', () => {
    expect(trackpoints[0]).toEqual(firstGpxTrackpt)
  })

  it('returns all trackpoints in the GPX', () => {
    expect(trackpoints.length).toEqual(1940)
  })
})

describe('trksegToJs', () => {
  const jsTrkseg = trksegToJs(firstGpxTrackpt)

  it('converts the GPX trackpoint into a nicer object', () => {
    expect(jsTrkseg).toEqual(firstJsTrkpt)
  })
})

describe('filterByTimeGap', () => {
  const processed = trackpointsFromGpx(rawGpx).map(trksegToJs)
  const filtered = filterByTimeGap(processed, 300)

  it('only includes trackpoints separated by 5 minutes', () => {
    expect(filtered.length).toEqual(8)
    expect(filtered[1].time.getTime() - filtered[0].time.getTime()).
      toBeGreaterThanOrEqual(300)
  })

  it('includes the first trackpoint', () => {
    expect(filtered[0]).toEqual(processed[0])
  })

  it('includes the last trackpoint even when not separated by enough time', () => {
    expect(filtered[filtered.length - 1]).toEqual(processed[processed.length - 1])
  })
})

describe('trackptToFormattedMessage', () => {
  it('converts a JsTrkPt to a FormattedMessage', () => {
    expect(trackptToFormattedMsg(firstJsTrkpt)).toEqual(firstFormattedMessage)
  })
})

describe('processGpx', () => {
  const processed = processGpx(rawGpx)

  it('parses, formats, filters, slices, dices and chops', () => {
    expect(processed.length).toEqual(8)
    expect(processed[0]).toEqual(firstFormattedMessage)
  })
})
