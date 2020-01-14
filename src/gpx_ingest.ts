import { xml2js, ElementCompact } from 'xml-js'
import { FormattedMessage } from './spot_format'

interface GpxTrkseg extends ElementCompact {
  _attributes: {
    lat: string
    lon: string
  },
  ele: {_text: string}
  time: {_text: string}
}

interface JsTrkSeg {
  lat: number
  lon: number
  time: Date
  elevation: number
}

export function trackpointsFromGpx(gpx: string): GpxTrkseg[] {
  const parsed: ElementCompact = xml2js(gpx, {compact: true, trim: true})
  const trk = parsed.gpx.trk
  return trk.trkseg.trkpt
}

function parseAndRound(text: string): number {
  return parseFloat(parseFloat(text).toFixed(5))
}

export function trksegToJs(trkseg: GpxTrkseg): JsTrkSeg {
  return {
    lat: parseAndRound(trkseg._attributes.lat),
    lon: parseAndRound(trkseg._attributes.lon),
    time: new Date(trkseg.time._text),
    elevation: parseAndRound(trkseg.ele._text)
  }
}

export function filterByTimeGap(trksegs: JsTrkSeg[], gapSecs: number): JsTrkSeg[] {
  return trksegs.reduce((filtered, trkseg, idx, allSegs) => {
    if (filtered.length === 0) { return [trkseg] }
    if (idx === allSegs.length - 1) { return [...filtered, trkseg] } // always return last segment

    const last: JsTrkSeg = filtered[filtered.length - 1]
    if (last.lon === trkseg.lon && last.lat === trkseg.lat) { return filtered }

    const timeDiff = (trkseg.time.getTime() - last.time.getTime()) / 1000
    if (timeDiff >= gapSecs) { return [...filtered, trkseg] }

    return filtered
  }, [])
}

export function trackptToFormattedMsg(trkpt: JsTrkSeg): FormattedMessage {
  return {
    _id: trkpt.time.getTime(),
    time: trkpt.time,
    point: {
      type: 'Point',
      coordinates: [
        trkpt.lon,
        trkpt.lat
      ]
    },
    messageType: 'gpxImport'
  }
}

export function processGpx(gpx: string): FormattedMessage[] {
  const trackpts = trackpointsFromGpx(gpx)
  const parsed = trackpts.map(trksegToJs)
  const filtered = filterByTimeGap(parsed, 300)
  return filtered.map(trackptToFormattedMsg)
}
