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

  const backup = saveResponseToS3(spotResponse)

  if (SpotAPI.isError(spotResponse)) {
    await backup
    return {success: false, message: `Error from SPOT API: ${spotResponse.response.errors.error.text}`}
  } else {
    const mongoResult = persistMessagesToMongo(spotResponse.response.feedMessageResponse.messages.message)
    await backup
    return await mongoResult
  }
}

export async function persistMessagesToMongo(messages: SpotAPI.Message[]): Promise<PersistenceResult> {
  const formatted = messages.map(m => formatSpotMessage(m))

  try {
    const db = await mongoDb()
    const insertResult = await db.collection(mongoCollectionName).insertMany(formatted, {ordered: false})
    return {success: true, message: `Inserted ${insertResult.insertedCount} messages`}
  } catch (e) {
    if (e.code === 11000 && e.result.result.ok === 1) { // duplicate key error
      const inserted = e.result.result.nInserted
      return {success: true, message: `Inserted ${inserted} messages`}
    } else {
      return {success: false, message: `Mongo error: ${e.message}`}
    }
  }
}

async function saveResponseToS3(response: SpotAPI.FeedResponse) {
  try {
    backupToS3(`Spot_Response_${spotFeedId}`, response)
  } catch (e) {
    console.log(e)
  }
}
