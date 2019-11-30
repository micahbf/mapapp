import { mongoCollectionName } from './config'
import { mongoDb } from './mongo_client'
import { FormattedMessage } from './spot_format'
import { PersistenceResult } from './spot_persistence'

export async function persistOneOffNow(lat: number, lon: number): Promise<PersistenceResult> {
  const now = new Date()
  const message: FormattedMessage = {
    _id: now.getTime(),
    time: now,
    point: {
      type: 'Point',
      coordinates: [lon, lat]
    },
    messageType: 'oneOff'
  }

  try {
    const db = await mongoDb()
    await db.collection(mongoCollectionName).insertOne(message)
    return {success: true, message: 'Inserted 1 messages'}
  } catch (e) {
    return {success: false, message: `Mongo error: ${e.message}`}
  }
}
