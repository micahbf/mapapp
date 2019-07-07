import { mongoCollectionName, spotFeedId } from './config'
import { mongoDb } from './mongo_client'
import { backupToS3 } from './s3_backup'
import { SpotAPI } from './spot_api'
import { formatSpotMessage } from './spot_format'

interface PersistenceResult {
  success: boolean
  message: string
}

export async function persistSpot(): Promise<PersistenceResult> {
  const spotResponse = await SpotAPI.getLatestMessages(spotFeedId)

  saveResponseToS3(spotResponse)

  if (SpotAPI.isError(spotResponse)) {
    return {success: false, message: `Error from SPOT API: ${spotResponse.response.errors.error.text}`}
  } else {
    return await persistMessagesToMongo(spotResponse.response.feedMessageResponse.messages.message)
  }
}

async function persistMessagesToMongo(messages: SpotAPI.Message[]): Promise<PersistenceResult> {
  const formatted = messages.map(m => formatSpotMessage(m))

  try {
    const db = await mongoDb()
    const insertResult = await db.collection(mongoCollectionName).insertMany(formatted, {ordered: false})
    return {success: true, message: `Inserted ${insertResult.insertedCount} messages`}
  } catch (e) {
    return {success: false, message: `Mongo error: ${e.message}`}
  }
}

async function saveResponseToS3(response: SpotAPI.FeedResponse) {
  backupToS3(`Spot_Response_${spotFeedId}`, response)
}
