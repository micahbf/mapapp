import { config } from 'dotenv'
import { parseIsoDate } from './date_utils'

config()

export const backupS3Bucket = process.env.S3_BACKUP_BUCKET
export const cacheFrom = parseIsoDate(process.env.CACHE_FROM)
export const cacheS3Bucket = process.env.S3_CACHE_BUCKET
export const mongoUrl = process.env.MONGO_URL
export const mongoCollectionName = process.env.MONGO_COLLECTION || 'spotTracks'
export const persistPassword = process.env.PERSIST_PASSWORD
export const spotFeedId = process.env.SPOT_FEED_ID

if (!persistPassword) { throw 'persist password not defined!' }
