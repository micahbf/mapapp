import { config } from 'dotenv'
config()

export const backupS3Bucket = process.env.S3_BACKUP_BUCKET
export const spotFeedId = process.env.SPOT_FEED_ID
export const mongoUrl = process.env.MONGO_URL
export const mongoCollectionName = process.env.MONGO_COLLECTION || 'spotTracks'
