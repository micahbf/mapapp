/* tslint:disable:no-console */
import { readFileSync } from 'fs'
import { processGpx } from '../src/gpx_ingest'
import { persistFormattedMessagesToMongo } from '../src/spot_persistence'

async function importGpx() {
  const gpxPath = process.argv[2]
  const rawGpx = readFileSync(gpxPath, {encoding: 'utf8'})
  const messages = processGpx(rawGpx)

  const result = await persistFormattedMessagesToMongo(messages)
  console.log(result)
}

importGpx().then(() => { console.log('done') })
