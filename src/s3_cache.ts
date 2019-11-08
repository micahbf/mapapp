import { S3 } from 'aws-sdk'
import { cacheFrom, cacheS3Bucket } from './config'
import { mapFeaturesFromMessages } from './map_data'
import { lastUpdateCaption, mapBounds } from './map_metadata'
import { getMessagesFromMongo } from './spot_persistence'

const s3 = new S3()

export async function cacheToS3() {
  const messages = await getMessagesFromMongo(cacheFrom)
  const bounds = mapBounds(messages, 2)
  const updateCaption = lastUpdateCaption(messages)
  const metadata = JSON.stringify({bounds, updateCaption})
  const mapData = JSON.stringify(mapFeaturesFromMessages(messages))

  const commonS3Params = {
    ACL:          'public-read',
    Bucket:       cacheS3Bucket,
    CacheControl: 'maxage=120',
    ContentType:  'application/json'
  }

  const putMetadata = s3.putObject({...commonS3Params, Key: 'map_metadata.json', Body: metadata}).promise()
  const putMapData = s3.putObject({...commonS3Params, Key: 'map_data.json', Body: mapData}).promise()
  return Promise.all([putMetadata, putMapData])
}
