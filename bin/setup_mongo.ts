import { mongoCollectionName } from '../src/config'
import { mongoDb } from '../src/mongo_client'

(async () => {
  const db = await mongoDb()
  const collection = db.collection(mongoCollectionName)

  collection.createIndex({time: 1})
  collection.createIndex({point: '2dsphere'})
})()
